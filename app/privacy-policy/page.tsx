import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="font-display text-5xl mb-2">Privacy Policy</h1>
          <p className="text-muted text-sm font-mono mb-12">Last updated: March 5, 2026</p>

          <div className="space-y-10 text-sm leading-relaxed text-[var(--muted)]">

            <section>
              <h2 className="font-display text-2xl text-text mb-3">1. Overview</h2>
              <p>
                Corekilla Beats ("we", "our", or "us") operates corekilla.com. This Privacy Policy explains
                how we collect, use, and protect your personal information when you visit our website
                or make a purchase. By using our site you agree to the terms of this policy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect the following information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-text">Email address</strong> — provided at checkout for order delivery and optionally for marketing communications.</li>
                <li><strong className="text-text">Payment information</strong> — processed securely by Stripe. We never store your card details.</li>
                <li><strong className="text-text">Order details</strong> — beat titles, license types, and purchase amounts stored for order fulfillment.</li>
                <li><strong className="text-text">Usage data</strong> — basic analytics such as pages visited and time spent on site.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process your order and deliver your purchased files.</li>
                <li>To send your download links and order confirmation via email.</li>
                <li>To send promotional emails, free downloads, and beat drop announcements if you opted in. You can unsubscribe at any time.</li>
                <li>To improve our website and customer experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">4. Third-Party Services</h2>
              <p className="mb-3">We use the following third-party services to operate our store:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-text">Stripe</strong> — payment processing. View their privacy policy at stripe.com/privacy.</li>
                <li><strong className="text-text">Supabase</strong> — database and file storage. View their privacy policy at supabase.com/privacy.</li>
                <li><strong className="text-text">Resend</strong> — email delivery. View their privacy policy at resend.com/legal/privacy-policy.</li>
                <li><strong className="text-text">Vercel</strong> — website hosting. View their privacy policy at vercel.com/legal/privacy-policy.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">5. Data Retention</h2>
              <p>
                We retain your order information for as long as necessary to fulfill our legal and business obligations.
                If you subscribed to marketing emails and wish to be removed from our list, contact us and we will
                delete your email within 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">6. Cookies</h2>
              <p>
                Our website uses cookies to maintain your shopping cart session and improve your browsing experience.
                These cookies are essential for the site to function correctly and do not track you across other websites.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">7. Your Rights</h2>
              <p>
                You have the right to request access to, correction of, or deletion of your personal data at any time.
                To exercise these rights, contact us at the email below.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">8. Children's Privacy</h2>
              <p>
                Our website is not directed at children under the age of 13. We do not knowingly collect
                personal information from children.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page
                with an updated date at the top.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-text mb-3">10. Contact</h2>
              <p>
                If you have any questions about this Privacy Policy, contact us at{' '}
                <a href="mailto:corekilla26@gmail.com" className="text-accent hover:underline">
                  corekilla26@gmail.com
                </a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}