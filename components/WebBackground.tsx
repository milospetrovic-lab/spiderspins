'use client';

import { useEffect, useRef, useMemo } from 'react';

export default function WebBackground() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      if (ref.current) {
        const rot = (y * 0.01).toFixed(3);
        ref.current.style.transform = `translate3d(-50%, calc(-50% + ${
          y * 0.15
        }px), 0) rotate(${rot}deg)`;
      }
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

  const svg = useMemo(() => {
    const size = 1600;
    const cx = size / 2;
    const cy = size / 2;
    const rings = 9;
    const spokes = 16;
    const maxR = size * 0.47;
    const stroke = '#333333';

    const circles: string[] = [];
    for (let r = 1; r <= rings; r++) {
      const radius = (r / rings) * maxR;
      // Spider web — slightly polygonal, not perfect circles
      const pts: string[] = [];
      for (let s = 0; s < spokes; s++) {
        const angle = (s / spokes) * Math.PI * 2;
        const wobble = r % 2 === 0 ? 1 : 0.985;
        const x = cx + Math.cos(angle) * radius * wobble;
        const y = cy + Math.sin(angle) * radius * wobble;
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      circles.push(
        `<polygon points="${pts.join(' ')}" fill="none" stroke="${stroke}" stroke-width="0.5"/>`
      );
    }

    const lines: string[] = [];
    for (let s = 0; s < spokes; s++) {
      const angle = (s / spokes) * Math.PI * 2;
      const x = cx + Math.cos(angle) * maxR;
      const y = cy + Math.sin(angle) * maxR;
      lines.push(
        `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${stroke}" stroke-width="0.5"/>`
      );
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${lines.join('')}${circles.join('')}</svg>`;
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-1/2 left-1/2 pointer-events-none z-0"
      style={{
        width: '1600px',
        height: '1600px',
        transform: 'translate3d(-50%, -50%, 0)',
        opacity: 0.055,
        willChange: 'transform',
      }}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
