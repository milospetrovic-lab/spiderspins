'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    const handler = () => setEnabled(mq.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;

      const target = e.target as HTMLElement | null;
      const isHover =
        !!target &&
        !!target.closest(
          'a, button, [role="button"], input, textarea, select, .hover-target'
        );
      if (isHover !== hovering) {
        hovering = isHover;
        ring.style.transform = buildRingTransform();
        ring.style.borderColor = isHover
          ? 'rgba(239,68,68,0.6)'
          : 'rgba(239,68,68,0.3)';
      }
    };

    const buildRingTransform = () => {
      const scale = hovering ? 1.5 : 1;
      return `translate3d(${ringX - 16}px, ${ringY - 16}px, 0) scale(${scale})`;
    };

    const tick = () => {
      // Lerp roughly ~0.15s trailing
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = buildRingTransform();
      raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-2 h-2 rounded-full bg-strike"
        style={{ transform: 'translate3d(-100px,-100px,0)', willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99] w-8 h-8 rounded-full border transition-[border-color] duration-200"
        style={{
          borderColor: 'rgba(239,68,68,0.3)',
          transform: 'translate3d(-100px,-100px,0)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
