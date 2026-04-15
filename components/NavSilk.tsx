'use client';

import { useEffect, useState } from 'react';

export default function NavSilk() {
  const [descentKey, setDescentKey] = useState(0);
  const [descentX, setDescentX] = useState(55);

  useEffect(() => {
    const id = window.setInterval(() => {
      setDescentX(25 + Math.random() * 55);
      setDescentKey((k) => k + 1);
    }, 11000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* horizontal silk strands drifting across bar */}
      <span className="silk-strand" style={{ top: '22%', animationDelay: '0s' }} />
      <span className="silk-strand silk-strand--b" style={{ top: '62%', animationDelay: '-3.5s' }} />
      <span className="silk-strand silk-strand--c" style={{ top: '84%', animationDelay: '-6s' }} />

      {/* pulsing anchor dots — like web intersections */}
      <span className="anchor-dot" style={{ left: '12%', top: '50%', animationDelay: '0s' }} />
      <span className="anchor-dot" style={{ left: '46%', top: '32%', animationDelay: '-1.2s' }} />
      <span className="anchor-dot" style={{ left: '68%', top: '72%', animationDelay: '-2.6s' }} />
      <span className="anchor-dot" style={{ left: '88%', top: '40%', animationDelay: '-3.8s' }} />

      {/* small radial web glyph */}
      <svg
        className="absolute opacity-30"
        style={{ right: '18%', top: '50%', transform: 'translateY(-50%)' }}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <g stroke="#444" strokeWidth="0.6" className="nav-web-glyph">
          <circle cx="24" cy="24" r="6" />
          <circle cx="24" cy="24" r="12" />
          <circle cx="24" cy="24" r="18" />
          <line x1="24" y1="4" x2="24" y2="44" />
          <line x1="4" y1="24" x2="44" y2="24" />
          <line x1="10" y1="10" x2="38" y2="38" />
          <line x1="38" y1="10" x2="10" y2="38" />
        </g>
      </svg>

      {/* descending spider on silk thread */}
      <div
        key={descentKey}
        className="spider-descent"
        style={{ left: `${descentX}%` }}
      >
        <span className="spider-thread" />
        <svg
          className="spider-body"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
        >
          <g stroke="#e8e8e8" strokeWidth="0.8" strokeLinecap="round">
            <path d="M10 10 L4 5 L2 7" />
            <path d="M10 10 L3 9 L1 11" />
            <path d="M10 10 L3 13 L1 15" />
            <path d="M10 10 L4 16 L2 17" />
            <path d="M10 10 L16 5 L18 7" />
            <path d="M10 10 L17 9 L19 11" />
            <path d="M10 10 L17 13 L19 15" />
            <path d="M10 10 L16 16 L18 17" />
          </g>
          <circle cx="10" cy="8" r="1.5" fill="#050505" stroke="#e8e8e8" strokeWidth="0.5" />
          <ellipse cx="10" cy="12" rx="2.2" ry="2.6" fill="#050505" stroke="#e8e8e8" strokeWidth="0.5" />
          <circle cx="10" cy="12" r="0.7" fill="#ef4444" />
        </svg>
      </div>
    </div>
  );
}
