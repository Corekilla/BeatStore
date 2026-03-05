import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  beatTitle: string
  licenseType: string
  price: number
  downloadUrl: string | null
}

export async function sendOrderConfirmation(
  email: string,
  items: OrderItem[],
  total: number
) {
  const licenseLabels: Record<string, string> = {
    mp3_lease: 'MP3 Lease',
    exclusive: 'Exclusive Rights',
  }

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a;">
          <strong style="color: #f0f0f0;">${item.beatTitle}</strong>
          <br/>
          <span style="color: #6b6b6b; font-size: 13px;">${licenseLabels[item.licenseType] ?? item.licenseType}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; text-align: right; color: #f0f0f0;">
          $${(item.price / 100).toFixed(2)}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; text-align: right;">
          ${
            item.downloadUrl
              ? `<a href="${item.downloadUrl}" style="background: #3A79E3; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 13px;">Download</a>`
              : `<span style="color: #6b6b6b;">Unavailable</span>`
          }
        </td>
      </tr>
    `
    )
    .join('')

  await resend.emails.send({
    from: 'Corekilla Beats <noreply@orders.corekilla.com>',
    to: email,
    subject: `Your beats are ready 🎵`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </head>
        <body style="margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #0a0a0a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding-bottom: 32px; border-bottom: 1px solid #2a2a2a;">
                      <h1 style="margin: 0; color: #f0f0f0; font-size: 28px; letter-spacing: -0.5px;">COREKILLA</h1>
                      <p style="margin: 4px 0 0; color: #6b6b6b; font-size: 13px;">Premium Beats</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 32px 0;">
                      <h2 style="margin: 0 0 8px; color: #f0f0f0; font-size: 22px;">Your order is confirmed ✅</h2>
                      <p style="margin: 0 0 24px; color: #6b6b6b; font-size: 15px;">
                        Thanks for your purchase. Your download links are below and are valid for <strong style="color: #f0f0f0;">7 days</strong>.
                      </p>

                      <!-- Items -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <thead>
                          <tr>
                            <th style="text-align: left; color: #6b6b6b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Beat</th>
                            <th style="text-align: right; color: #6b6b6b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Price</th>
                            <th style="text-align: right; color: #6b6b6b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Download</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsHtml}
                        </tbody>
                      </table>

                      <!-- Total -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                        <tr>
                          <td style="color: #6b6b6b; font-size: 14px;">Total</td>
                          <td style="text-align: right; color: #f0f0f0; font-size: 18px; font-weight: bold;">$${(total / 100).toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 32px; border-top: 1px solid #2a2a2a;">
                      <p style="margin: 0; color: #6b6b6b; font-size: 12px;">
                        Questions? Reply to this email or reach out at your contact email.<br/>
                        Download links expire after 7 days. Keep this email safe.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  })
}