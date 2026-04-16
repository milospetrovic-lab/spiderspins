'use client';

import { useEffect, useRef } from 'react';

type Cell = {
  el: HTMLSpanElement;
  baseX: number;
  baseY: number;
  offX: number;
  offY: number;
  vx: number;
  vy: number;
  exploded: boolean;
  pulled: boolean;
  // container-relative center, cached
  cx: number;
  cy: number;
};

const PULL_DIST = 90;

export default function InteractiveWebGrid() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cellsRef = useRef<Cell[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Mount only on touch devices. Desktop uses WebParticleNet (the connecting
    // constellation effect) instead — same z-layer, different interaction model.
    try {
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    } catch {}

    const cells: Cell[] = [];
    const rings = 4;
    const spokes = 14;
    // We'll place the cells as absolutely positioned children inside wrap.
    // Coordinates computed from container size.
    const build = () => {
      wrap.innerHTML = '';
      cells.length = 0;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const maxR = Math.min(rect.width, rect.height) * 0.42;

      // center piece
      const makeCell = (x: number, y: number) => {
        const el = document.createElement('span');
        el.className = 'web-cell';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        // inline spider cross SVG
        el.innerHTML = `<svg viewBox="0 0 20 20" width="14" height="14"><g stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><line x1="10" y1="2" x2="10" y2="18"/><line x1="2" y1="10" x2="18" y2="10"/><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/><circle cx="10" cy="10" r="1.6" fill="currentColor" stroke="none"/></g></svg>`;
        wrap.appendChild(el);
        const c: Cell = {
          el,
          baseX: x,
          baseY: y,
          offX: 0,
          offY: 0,
          vx: 0,
          vy: 0,
          exploded: false,
          pulled: false,
          cx: x,
          cy: y,
        };
        cells.push(c);
        return c;
      };

      makeCell(cx, cy);
      for (let r = 1; r <= rings; r++) {
        const rad = (r / rings) * maxR;
        const extras = r; // add spokes as rings grow
        const thisSpokes = spokes + extras * 2;
        for (let s = 0; s < thisSpokes; s++) {
          const a = (s / thisSpokes) * Math.PI * 2 + r * 0.1;
          const x = cx + Math.cos(a) * rad;
          const y = cy + Math.sin(a) * rad;
          makeCell(x, y);
        }
      }
      cellsRef.current = cells;
    };

    build();

    let clicked = false;
    let pointerX = -9999;
    let pointerY = -9999;
    let lastReact = 0;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      // For responsiveness, update pulls directly each move too (debounced via rAF)
      if (!lastReact) lastReact = requestAnimationFrame(applyPull);
    };
    const onLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
      if (!lastReact) lastReact = requestAnimationFrame(applyPull);
    };

    const applyPull = () => {
      lastReact = 0;
      if (clicked) return;
      for (const c of cellsRef.current) {
        const dx = pointerX - c.baseX;
        const dy = pointerY - c.baseY;
        const dist = Math.hypot(dx, dy);
        if (dist < PULL_DIST) {
          const pct = dist / PULL_DIST;
          c.pulled = true;
          c.offX = dx * pct;
          c.offY = dy * pct;
          c.el.style.transform = `translate3d(${c.offX}px, ${c.offY}px, 0)`;
          c.el.classList.add('is-near');
        } else if (c.pulled) {
          c.pulled = false;
          c.offX = 0;
          c.offY = 0;
          c.el.style.transform = `translate3d(0, 0, 0)`;
          c.el.classList.remove('is-near');
        }
      }
    };

    const onClick = () => {
      if (clicked) return;
      clicked = true;
      // Scatter physics
      for (const c of cellsRef.current) {
        const angle = 250 + Math.random() * 40; // degrees
        const rad = (angle * Math.PI) / 180;
        const speed = 6 + Math.random() * 12;
        c.vx = Math.cos(rad) * speed;
        c.vy = Math.sin(rad) * speed;
        c.exploded = true;
        c.el.classList.add('is-exploded');
      }
      // Reset after 1.4s with elastic return
      setTimeout(() => {
        const startOffs = cellsRef.current.map((c) => ({
          x: c.offX,
          y: c.offY,
        }));
        const start = performance.now();
        const dur = 900;
        const returnTick = () => {
          const t = Math.min((performance.now() - start) / dur, 1);
          // elastic out
          const p = t;
          const c2 = (2 * Math.PI) / 0.45;
          const ease =
            p === 0
              ? 0
              : p === 1
              ? 1
              : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c2) + 1;
          cellsRef.current.forEach((c, i) => {
            c.offX = startOffs[i].x * (1 - ease);
            c.offY = startOffs[i].y * (1 - ease);
            c.el.style.transform = `translate3d(${c.offX}px, ${c.offY}px, 0)`;
          });
          if (t < 1) requestAnimationFrame(returnTick);
          else {
            cellsRef.current.forEach((c) => {
              c.offX = 0;
              c.offY = 0;
              c.vx = 0;
              c.vy = 0;
              c.exploded = false;
              c.el.classList.remove('is-exploded');
              c.el.style.transform = `translate3d(0,0,0)`;
            });
            clicked = false;
          }
        };
        requestAnimationFrame(returnTick);
      }, 1400);

      // Explosion physics loop
      const gravity = 0.7;
      const start = performance.now();
      const physicsDur = 1400;
      const physTick = () => {
        for (const c of cellsRef.current) {
          if (!c.exploded) continue;
          c.vy += gravity;
          c.offX += c.vx;
          c.offY += c.vy;
          c.el.style.transform = `translate3d(${c.offX}px, ${c.offY}px, 0)`;
        }
        if (performance.now() - start < physicsDur) requestAnimationFrame(physTick);
      };
      requestAnimationFrame(physTick);
    };

    const onResize = () => {
      build();
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="interactive-web-grid absolute inset-0 pointer-events-auto"
    />
  );
}
