'use client';

import { useEffect, useRef, useState } from 'react';

// Web Vault — one-shot count-up triggered when the section enters the
// viewport. Previously used GSAP ScrollTrigger `scrub: 0.6` which had two
// bugs: (a) the 0.6s easing lag made the number visibly keep climbing after
// the user stopped scrolling on desktop; (b) ScrollTrigger's pixel math can
// get stale on mobile if fonts/images load after mount, so the trigger
// bands landed in the wrong place and a mobile swipe through the section
// wouldn't update the counter. IO + rAF one-shot sidesteps both.

const TARGET = 2400;
const DURATION_MS = 2800;

const rewardThresholds = [
  { at: 0.15, label: 'Freespins', color: 'venom' },
  { at: 0.35, label: 'Cashback', color: 'strike' },
  { at: 0.55, label: 'Reload Bonus', color: 'strike' },
  { at: 0.75, label: 'VIP Drop', color: 'fang' },
  { at: 0.92, label: 'Silk Bounty', color: 'fang' },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function WebVault() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduced = (() => {
      try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch {
        return false;
      }
    })();

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      if (reduced) {
        if (counterRef.current) {
          counterRef.current.textContent = '$' + TARGET.toLocaleString();
        }
        setUnlockedCount(rewardThresholds.length);
        return;
      }

      const start = performance.now();
      const step = () => {
        const t = Math.min(1, (performance.now() - start) / DURATION_MS);
        const v = Math.round(TARGET * easeOutCubic(t));
        if (counterRef.current) {
          counterRef.current.textContent = '$' + v.toLocaleString();
        }
        let unlocked = 0;
        for (const r of rewardThresholds) if (t >= r.at) unlocked++;
        setUnlockedCount(unlocked);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // Final snap — land exactly on the target, stop updating forever
          if (counterRef.current) {
            counterRef.current.textContent = '$' + TARGET.toLocaleString();
          }
          setUnlockedCount(rewardThresholds.length);
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vault"
      className="relative z-10 py-24 md:py-36 px-6"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-mono text-silk-dim text-[11px] uppercase tracking-[0.42em] mb-4">
          The Web Vault
        </p>
        <h2 className="font-display font-black text-silk leading-[0.95] text-[clamp(2rem,6vw,4.5rem)]">
          The web <span className="text-strike">remembers</span>.
        </h2>
        <p className="mt-5 max-w-xl mx-auto font-display font-light text-silk-dim text-base md:text-lg">
          Every spin thickens the silk. Each threshold unlocks another thread — all of it adds up.
        </p>

        <div className="relative mx-auto mt-14 w-[min(440px,90vw)] aspect-square">
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            <g stroke="#222" strokeWidth="1" fill="none">
              <circle cx="200" cy="200" r="180" />
              <circle cx="200" cy="200" r="140" />
              <circle cx="200" cy="200" r="100" />
              <circle cx="200" cy="200" r="60" />
            </g>
            <g className="vault-silk" stroke="#444" strokeWidth="0.8" fill="none">
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = (i / 18) * Math.PI * 2;
                const x = 200 + Math.cos(angle) * 200;
                const y = 200 + Math.sin(angle) * 200;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={y}
                    x2="200"
                    y2="200"
                    strokeDasharray="220"
                    strokeDashoffset="220"
                    style={{
                      animation: `vault-draw 2.4s ease-out ${i * 0.06}s forwards`,
                    }}
                  />
                );
              })}
            </g>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-silk-dim mb-2">
              Vault value
            </div>
            <div
              ref={counterRef}
              className="font-mono font-bold text-strike text-4xl md:text-6xl tabular-nums"
              style={{ textShadow: '0 0 28px rgba(239,68,68,0.35)' }}
            >
              $0
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-silk-dim">
              {unlockedCount} / {rewardThresholds.length} unlocked
            </div>
          </div>

          <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-strike shadow-[0_0_22px_#ef4444] opacity-70" />
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {rewardThresholds.map((r, i) => {
            const unlocked = i < unlockedCount;
            const colorClass =
              r.color === 'fang'
                ? unlocked
                  ? 'border-fang text-fang bg-fang/10'
                  : 'border-web/70 text-shadow'
                : r.color === 'strike'
                ? unlocked
                  ? 'border-strike/70 text-strike bg-strike/10'
                  : 'border-web/70 text-shadow'
                : unlocked
                ? 'border-venom/70 text-strike bg-venom/10'
                : 'border-web/70 text-shadow';
            return (
              <span
                key={r.label}
                className={[
                  'font-mono text-[11px] uppercase tracking-[0.22em] px-3.5 py-2 rounded-full border transition-all duration-500',
                  colorClass,
                  unlocked ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-60',
                ].join(' ')}
              >
                {unlocked ? '● ' : '○ '}
                {r.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
