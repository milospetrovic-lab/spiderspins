import type { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Responsible Gaming · SpiderSpins',
  description:
    'The web has boundaries. Tools to set deposit limits, pause your account, and reach professional help.',
};

export default function ResponsibleGamingPage() {
  return (
    <LegalLayout
      eyebrow="Responsible Gaming"
      title="The web has boundaries."
      intro="Patient players are long-term players. If the web ever starts to chase you instead of the other way around, these are the tools to reset it. Use them early, use them often, and use them without shame."
    >
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">Deposit limits</h2>
        <p>Set a daily, weekly, or monthly cap from your account dashboard. Lowering a limit takes effect immediately. Raising a limit triggers a 7-day cooling period before it activates — that delay is intentional and non-negotiable.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">Session reminders</h2>
        <p>You can ask the site to interrupt you at 30, 60, or 120 minutes of continuous play with a non-dismissible reminder. The reminder shows your session length, your net wagering, and your win/loss balance. We do not soften any of those numbers.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">Self-exclusion</h2>
        <p>Three options:</p>
        <ul className="space-y-2 pl-5 list-disc marker:text-strike">
          <li><strong className="text-silk">Cool-off — 72 hours.</strong> Account locked. Pending withdrawals process normally.</li>
          <li><strong className="text-silk">Pause — 1 to 6 months.</strong> Account locked. Marketing emails stopped. Funds remain.</li>
          <li><strong className="text-silk">Permanent self-exclusion.</strong> Cannot be reversed under any circumstance. Funds withdrawn. Account closed forever. Your email blocked from re-registering.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">Reality check</h2>
        <p>If any of these statements describe you, please pause and talk to one of the helplines below:</p>
        <ul className="space-y-1.5 pl-5 list-disc marker:text-strike text-silk-dim">
          <li>You are gambling with money you cannot afford to lose.</li>
          <li>You are chasing losses or feel you "deserve" the next win.</li>
          <li>You are hiding the amount you wager from people in your life.</li>
          <li>You feel anxious or angry when you cannot play.</li>
          <li>You have tried to stop and could not.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">Help — independent, free, confidential</h2>
        <ul className="space-y-2.5 pl-5 list-disc marker:text-strike">
          <li><strong className="text-silk">GamCare</strong> (UK) — <a className="text-strike hover:underline" href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer">gamcare.org.uk</a> · 0808 8020 133</li>
          <li><strong className="text-silk">GambleAware</strong> (UK) — <a className="text-strike hover:underline" href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer">begambleaware.org</a></li>
          <li><strong className="text-silk">National Council on Problem Gambling</strong> (US) — <a className="text-strike hover:underline" href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer">ncpgambling.org</a> · 1-800-522-4700</li>
          <li><strong className="text-silk">Gambling Therapy</strong> (international) — <a className="text-strike hover:underline" href="https://www.gamblingtherapy.org" target="_blank" rel="noopener noreferrer">gamblingtherapy.org</a></li>
        </ul>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">Protecting under-18s</h2>
        <p>Gambling is for adults. If a minor uses your device, install one of: <a className="text-strike hover:underline" href="https://www.netnanny.com" target="_blank" rel="noopener noreferrer">Net Nanny</a>, <a className="text-strike hover:underline" href="https://gamblock.com" target="_blank" rel="noopener noreferrer">GamBlock</a>, or <a className="text-strike hover:underline" href="https://www.cyberpatrol.com" target="_blank" rel="noopener noreferrer">CyberPatrol</a>. Set screen-time limits via your operating system. Do not save your account credentials in a shared browser.</p>
      </section>
      <section>
        <h2 className="font-display font-extrabold text-silk text-xl md:text-2xl mb-3">Our commitment</h2>
        <p>VIP hosts will proactively suggest cool-offs if your play pattern shifts in a way our systems flag. We will close your account on request without question, without retention attempts, and without trying to entice you back.</p>
      </section>
    </LegalLayout>
  );
}
