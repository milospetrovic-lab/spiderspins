// Shared layout for the static legal pages (Terms / Privacy / Responsible Gaming).
// Spider-voiced, structured, intentionally not lawyer-grade — these are stubs
// pending a real legal review before the production launch.

import Link from 'next/link';

export default function LegalLayout({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative z-10 min-h-screen px-6 pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="hover-target inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-silk-dim hover:text-strike transition-colors mb-10"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to the web
        </Link>

        <p className="font-mono text-silk-dim text-[11px] uppercase tracking-[0.42em] mb-4">
          {eyebrow}
        </p>
        <h1 className="font-display font-black text-silk leading-[0.95] text-[clamp(2rem,6vw,4.5rem)] mb-6">
          {title}
        </h1>
        <p className="font-display font-light text-silk-dim text-base md:text-lg leading-relaxed max-w-2xl mb-12">
          {intro}
        </p>

        <div className="legal-prose font-display text-silk/85 text-[15px] leading-relaxed space-y-7">
          {children}
        </div>

        <p className="mt-16 pt-6 border-t border-web/60 font-mono text-[10px] uppercase tracking-[0.3em] text-shadow text-center">
          Stub copy · pending full legal review before production launch
        </p>
      </div>
    </main>
  );
}
