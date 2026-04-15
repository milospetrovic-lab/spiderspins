'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getGPUTier } from 'detect-gpu';

// Ported from Zach Saucier-style jQuery/TweenMax particle warp.
// Tuned for SpiderSpins: slower pace, spider palette (red + wine + occasional
// gold/silk), GPU-tier-adaptive count, replaces the heavier AmbientParticles.

export default function ParticleField3D() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [tier, setTier] = useState<number>(2);

  useEffect(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setEnabled(false);
        return;
      }
    } catch {}
    let cancelled = false;
    (async () => {
      try {
        const res = await getGPUTier();
        if (!cancelled) {
          if (res.tier === 0) setEnabled(false);
          else setTier(res.tier);
        }
      } catch {
        /* mid */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const isMobile = window.innerWidth < 768;
    // Adaptive count — higher counts now that visibility is boosted
    const base =
      tier >= 3 ? 320 : tier === 2 ? 220 : 130;
    const count = Math.max(
      70,
      Math.round((isMobile ? base * 0.55 : base))
    );

    const w = window.innerWidth;
    const h = window.innerHeight;
    const rand = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // Build particle DOM
    const particles: HTMLSpanElement[] = [];
    for (let i = 0; i < count; i++) {
      const c = document.createElement('span');
      // Slightly larger base so particles read against the dark bg
      const size = rand(1.5, 11);
      // Palette: bright strike-red spectrum + silk & fang highlights
      const roll = Math.random();
      let color: string;
      if (roll < 0.55) {
        // bright strike red — punchy
        color = `hsla(0, 85%, 60%, 1)`;
      } else if (roll < 0.78) {
        // venom / wine
        color = `hsla(358, 78%, 48%, 1)`;
      } else if (roll < 0.9) {
        // fang gold
        color = `hsla(40, 55%, 65%, 0.95)`;
      } else {
        // silk white
        color = `hsla(0, 0%, 92%, 0.9)`;
      }
      c.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        `background:${color}`,
        `width:${size.toFixed(1)}px`,
        `height:${size.toFixed(1)}px`,
        // brighter halo — 1.8× size glow
        `box-shadow:0 0 ${(size * 1.8).toFixed(1)}px ${color}`,
        'left:0',
        'top:0',
        'will-change:transform,opacity',
      ].join(';');
      wrap.appendChild(c);
      particles.push(c);
    }

    // Animate each particle — slower than original (20-26s per cycle)
    const tweens: gsap.core.Tween[] = [];
    particles.forEach((c, i) => {
      const x = rand(0, w);
      const y = rand(0, h);
      const z = rand(-1100, -220);
      const dur = rand(20, 26);
      const tw = gsap.fromTo(
        c,
        { opacity: 0, x, y, z },
        {
          opacity: 1,
          z: 500,
          duration: dur,
          ease: 'none',
          repeat: -1,
          delay: i * -(dur / count) * 0.9,
        }
      );
      tweens.push(tw);
    });

    // Mouse/touch follows the perspective origin (smooth)
    let ox = w / 2;
    let oy = h / 2;
    const onMove = (e: PointerEvent) => {
      ox = e.clientX;
      oy = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // Smoothly interpolate perspective origin via rAF
    let currentX = ox;
    let currentY = oy;
    let raf = 0;
    const lerp = () => {
      currentX += (ox - currentX) * 0.06;
      currentY += (oy - currentY) * 0.06;
      if (wrap) {
        wrap.style.perspectiveOrigin = `${currentX.toFixed(1)}px ${currentY.toFixed(1)}px`;
      }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);

    // Pause when tab hidden
    const onVis = () => {
      if (document.hidden) {
        tweens.forEach((t) => t.pause());
      } else {
        tweens.forEach((t) => t.resume());
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf);
      tweens.forEach((t) => t.kill());
      particles.forEach((c) => c.remove());
    };
  }, [enabled, tier]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="fixed inset-0 z-[2] pointer-events-none overflow-hidden"
      style={{
        perspective: '100px',
        transformStyle: 'preserve-3d',
      }}
    />
  );
}
