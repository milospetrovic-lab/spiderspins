import type { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy · SpiderSpins',
  description:
    'What we collect, why we collect it, and exactly how to make us delete it.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Privacy Policy"
      title="What the web sees."
      intro="The spider notices everything but remembers only what it needs. This page tells you exactly what data we collect, why we collect it, who we share it with, and how to make us forget you."
    >
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">1. Data we collect</h2>
        <p>Account data — email, display name, country, password hash. KYC data — identity documents you upload to satisfy regulators (passport, address proof). Gameplay data — every wager, win, and session length, because the law requires us to keep it. Device data — IP address, browser, operating system. Telemetry — anonymous Web Vitals via Vercel Speed Insights.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">2. Why we collect it</h2>
        <p>To keep your account secure, prevent multi-accounting and fraud, satisfy our anti-money-laundering obligations, and improve game performance. We do not sell your data to advertisers. We do not run third-party trackers like Google Analytics, Facebook Pixel, or TikTok Pixel.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">3. Who we share it with</h2>
        <p>Payment processors (Stripe, BTCPay) for transactions. Game providers (Pragmatic, RTG, Evolution) for the games you play. KYC verification partners (Veriff or similar) only at sign-up. Regulators when legally required. Nobody else.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">4. How long we keep it</h2>
        <p>Account data — for as long as your account is active, plus 5 years after closure (regulatory). KYC documents — until verification completes, then deleted on request within 30 days. Gameplay data — 5 years (regulatory). Telemetry — 90 days, anonymized.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">5. Your rights</h2>
        <p>You can request a full export of every byte we hold on you, ask us to correct anything wrong, ask us to delete anything we are not legally required to keep, or move your data to another operator. Email <span className="text-strike">privacy@spiderspins.com</span> with the request — we respond within 30 days, usually faster.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">6. Cookies</h2>
        <p>Essential cookies only — session, language, age-gate. No advertising cookies. No social media cookies. The Vercel Speed Insights script is anonymous and does not set tracking identifiers.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">7. Contact</h2>
        <p>Data Protection Officer · <span className="text-strike">dpo@spiderspins.com</span> · written within 30 days of any request.</p>
      </section>
    </LegalLayout>
  );
}
