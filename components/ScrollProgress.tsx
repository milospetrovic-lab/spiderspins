'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      const pct = height > 0 ? Math.min(1, scrolled / height) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${pct})`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[95] h-[3px] pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-venom origin-left"
        style={{
          transform: 'scaleX(0)',
          boxShadow: '0 0 10px rgba(185,28,28,0.55)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
