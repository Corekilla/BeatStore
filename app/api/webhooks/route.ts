import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmation } from '@/lib/email'
import { stripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid")
      return NextResponse.json({ received: true });

    const rawItems = JSON.parse(session.metadata?.items ?? "[]");

    // Generate signed download URLs for each purchased beat/license
    const itemsWithDownloads = await Promise.all(
      rawItems.map(
        async (item: {
          beatId: string;
          beatTitle: string;
          licenseType: string;
          price: number;
        }) => {
          // Each beat file is stored at: beats/{beatId}/{licenseType}.wav (or .zip for trackout)
          const ext = "mp3";
          const fileType = item.licenseType === "exclusive" ? "mp3_lease" : item.licenseType;
          const filePath = `${item.beatId}/${fileType}.${ext}`;


          const { data, error } = await supabase.storage
            .from("beats")
            .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7-day expiry
            

          return {
            ...item,
            downloadUrl: data?.signedUrl ?? null,
          };
        },
      ),
    );

    // Update order to paid with download URLs
    await supabase
      .from("orders")
      .update({ status: "paid", items: itemsWithDownloads })
      .eq("stripe_session_id", session.id);
    
    // Send order confirmation email
    const customerEmail = session.customer_details?.email
    if (customerEmail) {
      await sendOrderConfirmation(
        customerEmail,
        itemsWithDownloads,
        session.amount_total ?? 0
      )
    }

    // If any exclusive licenses were purchased, mark beats as sold
    const exclusivePurchases = rawItems.filter(
      (i: { licenseType: string }) => i.licenseType === "exclusive",
    );
    for (const purchase of exclusivePurchases) {
      await supabase
        .from("beats")
        .update({ exclusive_sold: true, featured: false })
        .eq("id", purchase.beatId);
    }
    // Increment leases_sold for non-exclusive purchases
    const leasePurchases = rawItems.filter(
      (i: { licenseType: string }) => i.licenseType !== 'exclusive'
    )
    for (const purchase of leasePurchases) {
      await supabase.rpc('increment_leases_sold', { beat_id: purchase.beatId })
    }
      
    

    // Increment play counts / purchase counts could also go here
  }
  

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await supabase
      .from("orders")
      .update({ status: "failed" })
      .eq("stripe_session_id", session.id);
  }

  return NextResponse.json({ received: true });
}
