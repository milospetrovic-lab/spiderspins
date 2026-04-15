'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Contained warp tunnel — intended to sit INSIDE a hex/octagon behind the
// hero headline. Subtle, slow, wine-red palette. No pulsing dot. The
// octagonal spider-web frame is the thing the visitor sees; the warp adds
// depth inside it.

export default function WarpTunnel({
  minimal = false,
  speed = 1,
}: {
  minimal?: boolean;
  speed?: number;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.09);

    const camera = new THREE.PerspectiveCamera(
      60,
      Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight),
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Gentle S-curve — keeps depth without swinging too hard
    class WarpCurve extends THREE.Curve<THREE.Vector3> {
      getPoint(t: number, target = new THREE.Vector3()) {
        const z = -t * 260;
        const x = Math.sin(t * Math.PI * 1.4) * 3.2;
        const y = Math.cos(t * Math.PI * 1.0) * 1.8;
        return target.set(x, y, z);
      }
    }
    const curve = new WarpCurve();
    const tubeGeometry = new THREE.TubeGeometry(curve, 240, 2.4, 44, true);

    // Wine-red procedural streak texture — darker than v1, less pure red
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 512;
    texCanvas.height = 1024;
    const tctx = texCanvas.getContext('2d')!;
    tctx.fillStyle = '#050505';
    tctx.fillRect(0, 0, 512, 1024);

    // Wine palette — deeper, less saturated, very few bright streaks
    const streakColors = [
      'rgba(58,8,8,',    // deep wine
      'rgba(91,20,20,',  // wine
      'rgba(110,30,30,', // soft burgundy
      'rgba(140,40,40,', // rust
      'rgba(185,28,28,', // venom (sparse)
    ];
    for (let i = 0; i < 280; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 1024;
      const len = 80 + Math.random() * 420;
      const a = 0.08 + Math.random() * 0.42;
      const colorIdx =
        Math.random() < 0.35
          ? 0
          : Math.random() < 0.65
          ? 1
          : Math.random() < 0.85
          ? 2
          : Math.random() < 0.96
          ? 3
          : 4;
      const color = streakColors[colorIdx];
      const grad = tctx.createLinearGradient(x, y, x, y + len);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, `${color}${a})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      tctx.fillStyle = grad;
      tctx.fillRect(x - 0.7, y, 1.4, len);
    }
    // A handful of silk-white streaks for contrast (very sparse)
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 1024;
      const len = 60 + Math.random() * 160;
      const grad = tctx.createLinearGradient(x, y, x, y + len);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, 'rgba(200,200,200,0.25)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      tctx.fillStyle = grad;
      tctx.fillRect(x - 0.5, y, 1, len);
    }

    const texture = new THREE.CanvasTexture(texCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 1);

    const tubeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.68,
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMat);
    scene.add(tube);

    // Spider-web octagonal frame in front of camera — outlined in venom
    // (darker than strike). Static, no pulse.
    const spokes = 8;
    const maskRadius = 1.35;

    const makeOctagon = (
      r: number,
      color: number,
      opacity: number
    ): { line: THREE.Line; geo: THREE.BufferGeometry; mat: THREE.LineBasicMaterial } => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= spokes; i++) {
        const a = (i / spokes) * Math.PI * 2 - Math.PI / 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
      });
      const line = new THREE.Line(geo, mat);
      line.position.set(0, 0, -3.6);
      scene.add(line);
      return { line, geo, mat };
    };

    const outer = minimal ? null : makeOctagon(maskRadius, 0xb91c1c, 0.82);
    const inner = minimal ? null : makeOctagon(maskRadius * 0.6, 0x8b1a1a, 0.45);

    // Inner spokes — dark wine
    const spokeGeo = new THREE.BufferGeometry();
    const spokePts: number[] = [];
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2 - Math.PI / 2;
      spokePts.push(0, 0, 0);
      spokePts.push(Math.cos(a) * maskRadius, Math.sin(a) * maskRadius, 0);
    }
    spokeGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(spokePts, 3)
    );
    const spokeMat = new THREE.LineBasicMaterial({
      color: 0x6e1818,
      transparent: true,
      opacity: 0.4,
    });
    const spokeLines = minimal ? null : new THREE.LineSegments(spokeGeo, spokeMat);
    if (spokeLines) {
      spokeLines.position.set(0, 0, -3.6);
      scene.add(spokeLines);
    }

    // Render loop — slow texture flow, slow camera drift, NO pulsing dot
    let raf = 0;
    const start = performance.now();
    let inView = true;
    const animate = () => {
      if (!inView) {
        raf = 0;
        return;
      }
      const now = performance.now();
      const elapsed = (now - start) / 1000;
      // Much slower flow for depth-not-distraction feel
      texture.offset.y = -elapsed * 0.18 * speed;
      camera.rotation.z = Math.sin(elapsed * 0.12) * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Pause rendering when the container scrolls out of view
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !inView) {
            inView = true;
            if (!raf) raf = requestAnimationFrame(animate);
          } else if (!entry.isIntersecting) {
            inView = false;
          }
        }
      },
      { rootMargin: '100px' }
    );
    io.observe(mount);

    const onResize = () => {
      if (!mount) return;
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
    // ResizeObserver for container changes
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      io.disconnect();
      renderer.dispose();
      tubeGeometry.dispose();
      tubeMat.dispose();
      texture.dispose();
      outer?.geo.dispose();
      outer?.mat.dispose();
      inner?.geo.dispose();
      inner?.mat.dispose();
      spokeGeo.dispose();
      spokeMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [minimal, speed]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
    />
  );
}
