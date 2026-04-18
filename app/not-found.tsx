'use client';

import { useEffect, useRef, useState } from 'react';

// Spider-styled 404:
//  - Giant red "404" sits behind a particle Empress spider
//  - Particles start scattered and morph into the Empress silhouette (~4s)
//  - Hold the formed spider for ~1.8s
//  - Auto-redirect to the games section on the home page at 6s total
//
// Runs on a light 2D canvas (no Three.js) so the 404 page stays fast even
// on low-end devices. Particle count + target positions scale with viewport.

const REDIRECT_DELAY_MS = 6000;
const MORPH_MS = 4000;
const REDIRECT_TARGET = '/#games';

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_MS);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = Math.min(640, Math.floor(window.innerHeight * 0.62));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle count scales with viewport size — capped for phones.
    const isMobile = w < 768;
    const N = isMobile ? 420 : 720;

    // Build target positions for an Empress spider silhouette.
    // Units relative to viewport center; SCALE picks the visual size.
    const SCALE = Math.min(w, h) * 0.4;
    const cx = w / 2;
    const cy = h / 2;

    type P = {
      x: number; y: number;   // live position
      sx: number; sy: number; // start (scattered)
      tx: number; ty: number; // target (spider)
      size: number;
      color: string;
      delay: number;          // animation stagger
    };

    const targets: Array<{ x: number; y: number }> = [];

    // Proportions mirror the main MorphingSpiderForms Empress: big body +
    // big abdomen + 8 long bezier legs + 3 gold crown rings.
    const nCeph = Math.round(N * 0.16);
    const nAbd = Math.round(N * 0.28);
    const nCrown = Math.round(N * 0.08);
    const nLegs = N - nCeph - nAbd - nCrown;
    const perLeg = Math.floor(nLegs / 8);

    // Cephalothorax
    for (let i = 0; i < nCeph; i++) {
      const u = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      targets.push({
        x: Math.cos(u) * r * SCALE * 0.18,
        y: Math.sin(u) * r * SCALE * 0.14 + SCALE * 0.12,
      });
    }
    // Abdomen
    for (let i = 0; i < nAbd; i++) {
      const u = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      targets.push({
        x: Math.cos(u) * r * SCALE * 0.30,
        y: Math.sin(u) * r * SCALE * 0.32 - SCALE * 0.18,
      });
    }
    // Gold crown bands — 3 rings around the abdomen
    const bands = [-SCALE * 0.05, -SCALE * 0.18, -SCALE * 0.32];
    for (let i = 0; i < nCrown; i++) {
      const ring = i % 3;
      const y = bands[ring] + (Math.random() - 0.5) * 3;
      const rBand = SCALE * 0.30 * Math.sqrt(
        Math.max(0, 1 - Math.pow((y + SCALE * 0.18) / (SCALE * 0.32), 2))
      );
      const a = Math.random() * Math.PI * 2;
      targets.push({ x: Math.cos(a) * (rBand + 2), y });
    }
    // 8 bezier legs
    const legDirs: Array<[number, number]> = [
      [-1, 0.7], [-1, 0.25], [-1, -0.2], [-1, -0.65],
      [1, 0.7], [1, 0.25], [1, -0.2], [1, -0.65],
    ];
    for (let leg = 0; leg < 8; leg++) {
      const [sx, ay] = legDirs[leg];
      const bx = sx * SCALE * 0.14;
      const by = ay * SCALE * 0.06 + SCALE * 0.04;
      const kx = sx * SCALE * 0.62;
      const ky = by + SCALE * 0.22;
      const txp = sx * SCALE * 1.10;
      const typ = ay * SCALE * 0.55;
      for (let i = 0; i < perLeg; i++) {
        const t = i / Math.max(perLeg - 1, 1);
        const x = (1 - t) * (1 - t) * bx + 2 * (1 - t) * t * kx + t * t * txp;
        const y = (1 - t) * (1 - t) * by + 2 * (1 - t) * t * ky + t * t * typ;
        targets.push({ x, y });
      }
    }
    while (targets.length < N) {
      // pad any remainder onto the abdomen
      const u = Math.random() * Math.PI * 2;
      targets.push({ x: Math.cos(u) * SCALE * 0.28, y: Math.sin(u) * SCALE * 0.28 - SCALE * 0.18 });
    }

    // Initial scattered positions + colours (mostly silk white, some gold, some red)
    const particles: P[] = targets.map((t, i) => {
      const ang = Math.random() * Math.PI * 2;
      const r = SCALE * (1.1 + Math.random() * 0.9);
      const roll = Math.random();
      const color =
        roll < 0.08
          ? 'rgba(239,68,68,0.95)'                // strike red (hourglass/crown nods)
          : roll < 0.18
          ? 'rgba(255,215,0,0.9)'                 // gold for crown accents
          : 'rgba(232,232,232,0.85)';             // silk white majority
      return {
        x: cx + Math.cos(ang) * r,
        y: cy + Math.sin(ang) * r,
        sx: cx + Math.cos(ang) * r,
        sy: cy + Math.sin(ang) * r,
        tx: cx + t.x,
        ty: cy + t.y,
        size: 1.4 + Math.random() * 1.2,
        color,
        delay: Math.random() * 400,
      };
    });

    const startAt = performance.now();
    let raf = 0;

    const ease = (t: number) => {
      // easeInOutCubic
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const tick = () => {
      const now = performance.now();
      const elapsed = now - startAt;
      setCountdown(Math.max(0, REDIRECT_DELAY_MS - elapsed));

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        const localT = Math.max(0, Math.min(1, (elapsed - p.delay) / (MORPH_MS - 400)));
        const e = ease(localT);
        p.x = p.sx + (p.tx - p.sx) * e;
        p.y = p.sy + (p.ty - p.sy) * e;

        // subtle idle shimmer once formed
        if (elapsed > MORPH_MS) {
          const phase = (elapsed - MORPH_MS) * 0.003 + (p.size * 3);
          p.x += Math.sin(phase) * 0.25;
          p.y += Math.cos(phase * 0.8) * 0.25;
        }

        // halo (subtle additive)
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (elapsed < REDIRECT_DELAY_MS) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    const to = window.setTimeout(() => {
      window.location.href = REDIRECT_TARGET;
    }, REDIRECT_DELAY_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(to);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const seconds = (countdown / 1000).toFixed(3);
  const progressPct = ((REDIRECT_DELAY_MS - countdown) / REDIRECT_DELAY_MS) * 100;

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Stage: giant red 404 behind, particle canvas in front */}
      <div className="relative w-full max-w-[1100px] flex items-center justify-center" style={{ height: 'min(640px, 62vh)' }}>
        {/* Giant red 404 behind the spider */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            color: '#b91c1c',
            opacity: 0.22,
            fontFamily: 'var(--font-outfit, system-ui)',
            fontWeight: 900,
            fontSize: 'clamp(10rem, 36vw, 28rem)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            textShadow:
              '0 0 60px rgba(185,28,28,0.45), 0 0 120px rgba(239,68,68,0.25)',
          }}
        >
          404
        </div>

        {/* Particle Empress canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="relative z-10 w-full h-full"
        />
      </div>

      <p className="mt-2 font-mono text-silk-dim text-[11px] uppercase tracking-[0.42em]">
        The web has a gap
      </p>
      <h1 className="mt-3 font-display font-black text-silk leading-[0.95] text-[clamp(2rem,6vw,4rem)] text-center">
        A silk thread <span className="text-strike">snapped</span>.
      </h1>

      {/* Countdown + redirect info */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-silk-dim">
          Returning you to the web in
        </p>
        <p className="font-mono text-strike text-3xl md:text-4xl font-bold tabular-nums">
          {seconds}s
        </p>
        <div className="w-56 h-[2px] bg-web relative overflow-hidden rounded-full mt-1">
          <span
            className="absolute left-0 top-0 h-full bg-strike"
            style={{ width: `${progressPct}%`, transition: 'width 60ms linear' }}
          />
        </div>
      </div>

      {/* Skip link */}
      <a
        href={REDIRECT_TARGET}
        className="hover-target mt-6 inline-flex items-center gap-2 px-6 py-3 bg-venom text-silk uppercase tracking-[0.18em] text-sm font-display font-medium hover:bg-strike transition-colors shadow-strike-glow"
      >
        Skip — take me now
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </main>
  );
}
