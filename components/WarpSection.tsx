'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WarpTunnel from './WarpTunnel';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function WarpSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.warp-reveal'), {
        y: 40,
        opacity: 0,
        duration: 0.9,
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
      id="warp"
      className="relative z-10 h-[90vh] md:h-[96vh] overflow-hidden"
    >
      {/* full-bleed tunnel */}
      <div className="absolute inset-0 z-[1]">
        <WarpTunnel />
      </div>

      {/* top + bottom fades so the section bleeds into neighbours */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 z-[2]"
        style={{
          background:
            'linear-gradient(180deg, #050505 0%, rgba(5,5,5,0) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 z-[2]"
        style={{
          background:
            'linear-gradient(0deg, #050505 0%, rgba(5,5,5,0) 100%)',
        }}
      />

      {/* narrative overlay */}
      <div className="relative z-[5] h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="warp-reveal font-mono text-silk-dim text-[11px] uppercase tracking-[0.42em] mb-5">
          Through the silk
        </p>
        <h2 className="warp-reveal font-display font-black text-silk leading-[0.9] text-[clamp(2.4rem,8vw,6rem)] max-w-4xl">
          Every thread <span className="text-strike">leads</span>
          <br />
          somewhere.
        </h2>
        <p className="warp-reveal mt-6 max-w-xl font-display font-light text-silk-dim text-base md:text-lg">
          The tunnel moves at the speed of patience. Pull any thread — the web is already connected.
        </p>

        <div className="warp-reveal mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-shadow">
          <span className="text-strike">●</span>
          <span>Warp engaged</span>
          <span className="nav-scan-line" />
          <span>silk flux 0.86</span>
        </div>
      </div>
    </section>
  );
}
