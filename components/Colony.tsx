'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const TelegramIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);
const DiscordIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.3 4.4A17.9 17.9 0 0 0 16 3l-.2.4a16.1 16.1 0 0 1 3.9 1.2C17.6 3.7 15 3.1 12 3.1s-5.6.6-7.7 1.5A16 16 0 0 1 8.2 3.4L8 3a17.9 17.9 0 0 0-4.3 1.4C1.5 7.8.9 11.2 1.2 14.5a18 18 0 0 0 5.4 2.7l.8-1.2a11.8 11.8 0 0 1-1.9-.9l.5-.3c3.6 1.6 7.5 1.6 11 0l.5.3c-.6.4-1.3.7-2 1l.8 1.1a18 18 0 0 0 5.5-2.7c.3-3.8-.5-7.2-1.5-10.1zM9.3 13c-.9 0-1.6-.9-1.6-1.9s.7-1.9 1.6-1.9 1.6.9 1.6 1.9S10.2 13 9.3 13zm5.4 0c-.9 0-1.6-.9-1.6-1.9s.7-1.9 1.6-1.9 1.6.9 1.6 1.9-.7 1.9-1.6 1.9z" />
  </svg>
);

export default function Colony() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.colony-reveal'), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 78%' },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="colony"
      className="relative z-10 py-24 md:py-32 px-6"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="colony-reveal font-mono text-silk-dim text-[11px] uppercase tracking-[0.42em] mb-4">
          The Colony
        </p>
        <h2 className="colony-reveal font-display font-black text-silk leading-[0.95] text-[clamp(2rem,6vw,4.5rem)]">
          Join the <span className="text-strike">Colony</span>.
        </h2>
        <p className="colony-reveal mt-5 max-w-xl mx-auto font-display font-light text-silk-dim text-base md:text-lg">
          8,000+ players. The web grows.
        </p>

        <div className="colony-reveal mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#telegram"
            className="hover-target group inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-strike/50 bg-strike/10 hover:bg-strike/20 transition-all font-display uppercase tracking-[0.18em] text-sm text-silk"
            style={{ boxShadow: '0 0 0 rgba(239,68,68,0)' }}
          >
            <span className="text-strike transition-transform group-hover:scale-110">
              {TelegramIcon}
            </span>
            Telegram
            <span className="font-mono text-[10px] text-silk-dim normal-case tracking-normal ml-1">
              / Instant
            </span>
          </a>

          <a
            href="#discord"
            className="hover-target group inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-venom/50 bg-venom/10 hover:bg-venom/20 transition-all font-display uppercase tracking-[0.18em] text-sm text-silk"
          >
            <span className="text-strike transition-transform group-hover:scale-110">
              {DiscordIcon}
            </span>
            Discord
            <span className="font-mono text-[10px] text-silk-dim normal-case tracking-normal ml-1">
              / Voice rooms
            </span>
          </a>
        </div>

        <div className="colony-reveal mt-10 flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] uppercase tracking-[0.28em] text-silk-dim">
          <span>
            <span className="text-strike font-bold">● 2,140</span> online
          </span>
          <span>
            <span className="text-fang font-bold">12</span> tournaments / week
          </span>
          <span>
            <span className="text-silk font-bold">24 / 7</span> hosts
          </span>
        </div>
      </div>
    </section>
  );
}
