'use client';

import { useEffect, useRef } from 'react';

export default function FogLayers() {
  const refs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];

  useEffect(() => {
    const speeds = [0.03, 0.05, 0.04, 0.035];
    let raf = 0;

    const update = () => {
      const y = window.scrollY;
      refs.forEach((r, i) => {
        if (r.current) {
          r.current.style.transform = `translate3d(0, ${y * speeds[i]}px, 0)`;
        }
      });
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]">
      <div
        ref={refs[0]}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(185,28,28,0.08) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={refs[1]}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(185,28,28,0.055) 0%, transparent 60%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={refs[2]}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 40% at 50% 100%, rgba(10,10,10,0.85) 0%, transparent 50%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={refs[3]}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(5,5,5,0.7) 100%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
