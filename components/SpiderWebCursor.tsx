'use client';

import { useEffect, useRef } from 'react';

type Anchor = { x: number; y: number };
type Thread = {
  from: Anchor;
  to: Anchor;
  life: number;
  maxLife: number;
  born: number;
};
type Burst = {
  x: number;
  y: number;
  start: number;
};

const ANCHOR_EDGE_COUNT = 22;
const ANCHOR_RADIAL_RINGS = 4;
const ANCHOR_RADIAL_SPOKES = 12;
const MAX_THREADS = 140;
const THREAD_MAX_LIFE = 1.6;
const PROXIMITY_RADIUS = 280;
const SLOW_SPEED = 1.5;
const FAST_SPEED = 20;
const BURST_DURATION = 2200;

function isTouchOnly() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

export default function SpiderWebCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const anchorsRef = useRef<Anchor[]>([]);
  const threadsRef = useRef<Thread[]>([]);
  const burstsRef = useRef<Burst[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, px: -9999, py: -9999, speed: 0 });
  const rafRef = useRef<number | null>(null);
  const lastThreadTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const touchDevice = isTouchOnly();

    const buildAnchors = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const anchors: Anchor[] = [];

      // Edge anchors
      for (let i = 0; i < ANCHOR_EDGE_COUNT; i++) {
        const t = i / ANCHOR_EDGE_COUNT;
        anchors.push({ x: t * w, y: 0 });
        anchors.push({ x: t * w, y: h });
        anchors.push({ x: 0, y: t * h });
        anchors.push({ x: w, y: t * h });
      }

      // Radial web pattern — concentric rings x spokes across viewport
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.48;
      for (let r = 1; r <= ANCHOR_RADIAL_RINGS; r++) {
        const radius = (r / ANCHOR_RADIAL_RINGS) * maxR;
        for (let s = 0; s < ANCHOR_RADIAL_SPOKES; s++) {
          const angle = (s / ANCHOR_RADIAL_SPOKES) * Math.PI * 2 + r * 0.18;
          anchors.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
          });
        }
      }

      anchorsRef.current = anchors;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildAnchors();
    };

    const onMouseMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      const dx = e.clientX - m.x;
      const dy = e.clientY - m.y;
      m.speed = Math.hypot(dx, dy);
      m.px = m.x;
      m.py = m.y;
      m.x = e.clientX;
      m.y = e.clientY;
    };

    const onMouseLeave = () => {
      const m = mouseRef.current;
      m.x = -9999;
      m.y = -9999;
      m.speed = 0;
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      burstsRef.current.push({
        x: t.clientX,
        y: t.clientY,
        start: performance.now(),
      });
    };

    const addThread = (now: number) => {
      const threads = threadsRef.current;
      if (threads.length >= MAX_THREADS) return;
      const m = mouseRef.current;
      if (m.x < 0) return;

      // Pick a nearby anchor probabilistically (closer = more likely)
      const anchors = anchorsRef.current;
      const candidates: { a: Anchor; d: number }[] = [];
      for (const a of anchors) {
        const d = Math.hypot(a.x - m.x, a.y - m.y);
        if (d < PROXIMITY_RADIUS * 1.8) candidates.push({ a, d });
      }
      if (candidates.length === 0) return;

      // Weighted random — prefer closer anchors
      candidates.sort((p, q) => p.d - q.d);
      const pick = candidates[Math.floor(Math.random() * Math.min(6, candidates.length))];

      // Avoid duplicate threads to same anchor
      for (const th of threads) {
        if (th.to === pick.a && now - th.born < 300) return;
      }

      threads.push({
        from: { x: m.x, y: m.y },
        to: pick.a,
        life: THREAD_MAX_LIFE,
        maxLife: THREAD_MAX_LIFE,
        born: now,
      });
    };

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const now = performance.now();
      const m = mouseRef.current;
      const speed = m.speed;

      // Spawn new threads — even at rest we keep a faint web near cursor
      if (!touchDevice && m.x > 0 && speed < SLOW_SPEED * 6) {
        if (now - lastThreadTimeRef.current > 22) {
          addThread(now);
          // A second thread per tick for richer silk
          if (speed > 0.3 && speed < 8) addThread(now);
          lastThreadTimeRef.current = now;
        }
      }

      // Fade fast-motion threads aggressively
      const threads = threadsRef.current;
      const decayBase = 0.008;
      const fastFactor = speed > FAST_SPEED ? 5 : 1;
      for (const th of threads) {
        // Threads near fast-moving cursor snap
        const dToCursor = Math.hypot(th.from.x - m.x, th.from.y - m.y);
        const nearCursorBoost = dToCursor < 60 && speed > FAST_SPEED ? 4 : 1;
        th.life -= decayBase * fastFactor * nearCursorBoost;
      }
      threadsRef.current = threads.filter((t) => t.life > 0);

      // Draw threads — whiter silk tone, thinner, two-pass with soft glow
      for (const th of threadsRef.current) {
        const lifeFrac = Math.max(0, Math.min(1, th.life / th.maxLife));
        // Outer ghost glow — very faint
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = `rgba(232,232,232,${lifeFrac * 0.12})`;
        ctx.beginPath();
        ctx.moveTo(th.from.x, th.from.y);
        ctx.lineTo(th.to.x, th.to.y);
        ctx.stroke();
        // Core thread — silk white, thinner
        ctx.lineWidth = 0.55;
        ctx.strokeStyle = `rgba(220,220,220,${lifeFrac * 0.75})`;
        ctx.beginPath();
        ctx.moveTo(th.from.x, th.from.y);
        ctx.lineTo(th.to.x, th.to.y);
        ctx.stroke();
      }

      // Draw intersection dots (anchors) — tight red dew drops near cursor
      for (const a of anchorsRef.current) {
        const d = Math.hypot(a.x - m.x, a.y - m.y);
        const proximity = Math.max(0, 1 - d / PROXIMITY_RADIUS);
        // slightly smaller base; show only noticeable ones
        if (proximity <= 0.04) continue;
        const alpha = 0.08 + proximity * 0.85;
        const radius = 0.9 + proximity * 1.6;
        if (proximity > 0.35) {
          ctx.fillStyle = `rgba(239,68,68,${proximity * 0.18})`;
          ctx.beginPath();
          ctx.arc(a.x, a.y, radius * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(239,68,68,${alpha})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mobile / touch — render bursts
      const bursts = burstsRef.current;
      const remaining: Burst[] = [];
      for (const b of bursts) {
        const age = now - b.start;
        if (age > BURST_DURATION) continue;
        const t = age / BURST_DURATION;
        const fade = 1 - t;
        const reach = 300 * Math.min(1, t * 2.5);
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = `rgba(200,200,200,${fade * 0.9})`;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const tx = b.x + Math.cos(angle) * reach;
          const ty = b.y + Math.sin(angle) * reach;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          // intersection dot at tip
          ctx.fillStyle = `rgba(239,68,68,${fade})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        remaining.push(b);
      }
      burstsRef.current = remaining;

      // Decay mouse speed toward zero (prevents stale "fast" state)
      m.speed *= 0.85;

      rafRef.current = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!touchDevice) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseleave', onMouseLeave);
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[2]"
    />
  );
}
