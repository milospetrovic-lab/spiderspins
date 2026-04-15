'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 18, mass: 0.5 });
  const rounded = useTransform(spring, (v) => {
    const f = v.toFixed(decimals);
    const [int, dec] = f.split('.');
    const intStr = Number(int).toLocaleString();
    return `${prefix}${dec ? `${intStr}.${dec}` : intStr}${suffix}`;
  });
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  return <motion.span>{rounded}</motion.span>;
}

export default function TermsCalculator() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [deposit, setDeposit] = useState(100);
  const [match, setMatch] = useState(150);

  const bonus = deposit * (match / 100);
  const wagering = bonus * 35;
  const totalPlay = deposit + bonus + wagering;
  const estSessions = Math.max(1, Math.round(totalPlay / 60));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.calc-reveal'), {
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
      id="terms"
      className="relative z-10 py-24 md:py-32 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 md:mb-14 text-center">
          <p className="calc-reveal font-mono text-silk-dim text-[11px] uppercase tracking-[0.42em] mb-4">
            Transparent Terms
          </p>
          <h2 className="calc-reveal font-display font-black text-silk leading-[0.95] text-[clamp(2rem,6vw,4.5rem)]">
            See the <span className="text-strike">math</span>.
          </h2>
          <p className="calc-reveal mt-5 max-w-xl mx-auto font-display font-light text-silk-dim text-base md:text-lg">
            No fine print games. Pick a deposit and match — we&apos;ll show you every number that matters.
          </p>
        </div>

        <div className="calc-reveal relative rounded-2xl border border-web/70 overflow-hidden">
          {/* spider web border pattern */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.05]"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="#e8e8e8" strokeWidth="0.6" fill="none">
              {Array.from({ length: 14 }).map((_, i) => {
                const a = (i / 14) * Math.PI * 2;
                return (
                  <line
                    key={i}
                    x1="400"
                    y1="200"
                    x2={400 + Math.cos(a) * 500}
                    y2={200 + Math.sin(a) * 500}
                  />
                );
              })}
              {[60, 120, 180, 240, 320].map((r) => (
                <circle key={r} cx="400" cy="200" r={r} />
              ))}
            </g>
          </svg>

          <div
            className="relative grid md:grid-cols-2 gap-0"
            style={{
              backdropFilter: 'blur(18px)',
              background:
                'linear-gradient(135deg, rgba(17,17,17,0.7), rgba(10,10,10,0.85))',
            }}
          >
            {/* Left — inputs */}
            <div className="p-6 md:p-9 border-b md:border-b-0 md:border-r border-web/60 space-y-7">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label
                    htmlFor="deposit"
                    className="font-mono text-[10px] uppercase tracking-[0.28em] text-silk-dim"
                  >
                    Deposit
                  </label>
                  <span className="font-mono text-strike font-bold text-lg">
                    <AnimatedNumber value={deposit} prefix="$" />
                  </span>
                </div>
                <input
                  id="deposit"
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="hover-target w-full accent-[#ef4444] deposit-slider"
                />
                <div className="flex justify-between mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-shadow">
                  <span>$10</span>
                  <span>$500</span>
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-silk-dim mb-3">
                  Match
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 150, 200].map((p) => {
                    const active = p === match;
                    return (
                      <button
                        key={p}
                        onClick={() => setMatch(p)}
                        className={[
                          'hover-target py-2.5 rounded-md border font-display text-sm transition-colors',
                          active
                            ? 'border-strike/80 bg-strike/10 text-strike'
                            : 'border-web/80 text-silk-dim hover:text-silk hover:border-web-light',
                        ].join(' ')}
                      >
                        {p}%
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-web/50">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-shadow leading-relaxed">
                  Wagering multiplier: <span className="text-silk-dim">35×</span> ·
                  Avg bet: <span className="text-silk-dim">$1</span> ·
                  Session length: <span className="text-silk-dim">~60 spins</span>
                </p>
              </div>
            </div>

            {/* Right — outputs */}
            <div className="p-6 md:p-9 grid grid-cols-2 gap-4 md:gap-5 content-center">
              {[
                { label: 'Bonus', value: bonus, prefix: '$', color: 'text-strike' },
                { label: 'Wagering req.', value: wagering, prefix: '$', color: 'text-silk' },
                { label: 'Total play', value: totalPlay, prefix: '$', color: 'text-silk' },
                { label: 'Est. sessions', value: estSessions, suffix: '', color: 'text-fang' },
              ].map((r) => (
                <div
                  key={r.label}
                  className="rounded-lg border border-web/70 bg-void/60 p-4"
                >
                  <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-silk-dim">
                    {r.label}
                  </div>
                  <div
                    className={[
                      'mt-1 font-mono font-bold text-2xl md:text-3xl tabular-nums',
                      r.color,
                    ].join(' ')}
                  >
                    <AnimatedNumber
                      value={r.value}
                      prefix={r.prefix || ''}
                      suffix={r.suffix || ''}
                      decimals={0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
