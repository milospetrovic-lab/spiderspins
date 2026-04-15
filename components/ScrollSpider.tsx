'use client';

import { useEffect, useRef } from 'react';

export default function ScrollSpider() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;

    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const total = Math.max(1, h.scrollHeight - h.clientHeight);
      const pct = Math.min(1, Math.max(0, scrolled / total));

      // Descent from top of viewport to ~82vh at full scroll
      const topVh = -8 + pct * 90;
      wrap.style.setProperty('--sy', `${topVh}vh`);
      // Thread length tracks Y
      wrap.style.setProperty('--tl', `${Math.max(0, topVh + 8)}vh`);
      // Horizontal drift tied to scroll — gentle sine wave
      const driftX = Math.sin(pct * Math.PI * 3) * 14;
      wrap.style.setProperty('--sx', `${driftX}px`);
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
      ref={wrapRef}
      aria-hidden
      className="scroll-spider"
      style={
        {
          '--sy': '-10vh',
          '--tl': '0vh',
          '--sx': '0px',
        } as React.CSSProperties
      }
    >
      <span className="scroll-spider-thread" />
      <span className="scroll-spider-body">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <g stroke="#e8e8e8" strokeWidth="0.9" strokeLinecap="round">
            <path d="M12 12 L5 6 L3 8" />
            <path d="M12 12 L4 10 L2 12" />
            <path d="M12 12 L4 14 L2 16" />
            <path d="M12 12 L5 18 L3 20" />
            <path d="M12 12 L19 6 L21 8" />
            <path d="M12 12 L20 10 L22 12" />
            <path d="M12 12 L20 14 L22 16" />
            <path d="M12 12 L19 18 L21 20" />
          </g>
          <circle cx="12" cy="9" r="2" fill="#050505" stroke="#c9c9c9" strokeWidth="0.6" />
          <ellipse cx="12" cy="14.2" rx="2.9" ry="3.4" fill="#050505" stroke="#c9c9c9" strokeWidth="0.6" />
          <path d="M10.5 13 L13.5 13 L11.5 15 L12.5 15 L10.5 17 L13.5 17" stroke="#ef4444" strokeWidth="0.9" fill="none" />
        </svg>
      </span>
    </div>
  );
}
