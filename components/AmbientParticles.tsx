'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getGPUTier } from 'detect-gpu';

export default function AmbientParticles() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  // GPU tier 0 = unsupported / blacklisted, 1 = low, 2 = mid, 3 = high
  // We default to 2 (mid) until detection resolves.
  const [gpuTier, setGpuTier] = useState<number>(2);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setEnabled(false);
      return;
    }
    // Touch devices skip ambient particles entirely — Three.js Points + canvas
    // texture was a measurable scroll-jank source on phones.
    try {
      if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
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
          else setGpuTier(res.tier);
        }
      } catch {
        if (!cancelled) setGpuTier(2);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 0, 1500);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      2200
    );
    camera.position.set(0, -100, 400);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Procedural radial-gradient particle texture
    const makeSprite = (inner: string, outer: string) => {
      const size = 128;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, inner);
      g.addColorStop(0.25, outer);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    const texA = makeSprite('rgba(239,68,68,0.95)', 'rgba(185,28,28,0.25)');
    const texB = makeSprite('rgba(185,28,28,0.85)', 'rgba(80,10,10,0.2)');

    const isMobile = window.innerWidth < 768;
    // Adaptive counts by GPU tier × form factor. Tier 1 (low) gets a big cut.
    const tierMultiplier = gpuTier >= 3 ? 1 : gpuTier === 2 ? 0.7 : 0.35;
    const baseA = isMobile ? 900 : 2800;
    const baseB = isMobile ? 700 : 2200;
    const countA = Math.max(200, Math.round(baseA * tierMultiplier));
    const countB = Math.max(150, Math.round(baseB * tierMultiplier));

    const buildPoints = (count: number, tex: THREE.Texture, opacity: number) => {
      const g = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const drifts = new Float32Array(count);
      const phases = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1800;
        positions[i * 3 + 1] = -600 + Math.random() * 1400;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
        drifts[i] = 0.15 + Math.random() * 0.35;
        phases[i] = Math.random() * Math.PI * 2;
      }
      g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        map: tex,
        size: 10 + Math.random() * 6,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(g, mat);
      (points as any).userData = { drifts, phases };
      scene.add(points);
      return points;
    };

    const layerA = buildPoints(countA, texA, 0.7);
    const layerB = buildPoints(countB, texB, 0.55);

    let raf = 0;
    let last = performance.now();
    const animate = () => {
      const now = performance.now();
      const dt = (now - last) / 16.67; // ~frames at 60fps
      last = now;

      for (const layer of [layerA, layerB]) {
        const pos = layer.geometry.getAttribute('position') as THREE.BufferAttribute;
        const ud = (layer as any).userData;
        const arr = pos.array as Float32Array;
        for (let i = 0; i < arr.length / 3; i++) {
          arr[i * 3 + 1] += ud.drifts[i] * dt;
          arr[i * 3] += Math.sin(now * 0.00015 + ud.phases[i]) * 0.08 * dt;
          if (arr[i * 3 + 1] > 700) {
            arr[i * 3 + 1] = -700;
            arr[i * 3] = (Math.random() - 0.5) * 1800;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 1000;
          }
        }
        pos.needsUpdate = true;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      layerA.geometry.dispose();
      layerB.geometry.dispose();
      (layerA.material as THREE.PointsMaterial).dispose();
      (layerB.material as THREE.PointsMaterial).dispose();
      texA.dispose();
      texB.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [enabled, gpuTier]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
