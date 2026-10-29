import type { Metadata } from 'next'
import { buildStaticMetadata } from '@/lib/seo-metadata'

export const metadata: Metadata = buildStaticMetadata({
  title: 'Privacy Policy | Hospitality121',
  description: 'How Hospitality121 collects, uses, and protects your personal data.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted text-sm mb-12">Last updated: 29 October 2026</p>

      <div className="flex flex-col gap-10 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">1. Who we are</h2>
          <p>Hospitality121 (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a hospitality media publication operated by IDLOGICE. We publish editorial content, newsletters, and podcasts covering the global hospitality industry.</p>
          <p className="mt-3">If you have any questions about this policy, contact us at <a href="mailto:privacy@hospitality121.com" className="text-gold hover:underline">privacy@hospitality121.com</a>.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">2. What data we collect</h2>
          <p className="mb-3">We collect personal data in the following ways:</p>
          <ul className="flex flex-col gap-2 pl-4">
            {[
              'Email address and name when you subscribe to our newsletter',
              'Email address, name, and message when you submit our contact form',
              'Email address, name, and company when you download a resource',
              'Usage data (pages visited, time on site, referring URLs) via Google Analytics, only if you consent to cookies',
              'IP address and browser information collected automatically by our hosting provider (Netlify)',
              'Article view counts: a random per-article browser-session identifier prevents refreshes from increasing the count. Our counter stores the article slug and random identifier, without names, email addresses, IP addresses or cross-site tracking. Counts begin on 29 October 2026 and represent sessions, not unique people or confirmed reads.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">3. How we use your data</h2>
          <ul className="flex flex-col gap-2 pl-4">
            {[
              'To send you the Hospitality121 weekly newsletter (if you subscribed)',
              'To respond to enquiries submitted via our contact form',
              'To deliver requested resource downloads',
              'To understand how our site is used and improve it (analytics, with consent only)',
              'To comply with legal obligations',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">4. Cookies and analytics</h2>
          <p className="mb-3">We use cookies to improve your experience on our site. Cookies are only placed after you give explicit consent via our cookie banner.</p>
          <p className="mb-3">We use <strong>Google Analytics 4</strong> to understand site usage. This service collects anonymised data about your visit including pages viewed, session duration, and approximate location. Google Analytics data is processed by Google LLC. For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google&apos;s Privacy Policy</a>.</p>
          <p>You can withdraw your cookie consent at any time by clearing your browser&apos;s local storage for this site, or by declining cookies on a new visit.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">5. Newsletter and email</h2>
          <p className="mb-3">If you subscribe to our newsletter, your email address and name are stored and processed by <strong>Beehiiv</strong> (Story Arc Inc.), our newsletter platform. Beehiiv processes data in accordance with its own <a href="https://www.beehiiv.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Privacy Policy</a>.</p>
          <p>You can unsubscribe from our newsletter at any time by clicking the unsubscribe link in any email we send, or by contacting us directly.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">6. Data retention</h2>
          <p>We retain your personal data only for as long as necessary to fulfil the purpose for which it was collected, or as required by law. Newsletter subscriber data is retained until you unsubscribe. Contact form submissions are retained for up to 24 months.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">7. Your rights</h2>
          <p className="mb-3">Under applicable data protection law (including the UK GDPR and EU GDPR), you have the right to:</p>
          <ul className="flex flex-col gap-2 pl-4">
            {[
              'Access the personal data we hold about you',
              'Request correction of inaccurate data',
              'Request deletion of your data',
              'Object to or restrict our processing of your data',
              'Data portability (receive your data in a structured format)',
              'Withdraw consent at any time where processing is based on consent',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:privacy@hospitality121.com" className="text-gold hover:underline">privacy@hospitality121.com</a>.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">8. Third-party services</h2>
          <p className="mb-2">Our site uses the following third-party services which may process personal data:</p>
          <ul className="flex flex-col gap-2 pl-4">
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /><strong>Netlify</strong> — hosting and form processing</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /><strong>Google Analytics 4</strong> — site analytics (consent required)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /><strong>Beehiiv</strong> — newsletter delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">9. Changes to this policy</h2>
          <p>We may update this Privacy Policy from time to time. We will post the revised policy on this page with an updated date. For significant changes, we will notify newsletter subscribers by email.</p>
        </section>

      </div>
    </div>
  )
}
