'use client';

import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VOID = 0x050505;
const STRIKE = 0xef4444;
const VENOM = 0xb91c1c;
const FANG = 0xc4a265;

type StyleKey = 'widow' | 'venom' | 'empress' | 'bone';

const styles: Record<
  StyleKey,
  {
    body: number;
    pip: number;
    edge: number;
    metalness: number;
    roughness: number;
    emissive: number;
    emissiveI: number;
    accentLight: string;
    label: string;
    tag: string;
  }
> = {
  widow: {
    body: VOID,
    pip: STRIKE,
    edge: VENOM,
    metalness: 0.7,
    roughness: 0.2,
    emissive: STRIKE,
    emissiveI: 0.6,
    accentLight: '#ef4444',
    label: 'Widow',
    tag: 'Entry',
  },
  venom: {
    body: 0x1a0505,
    pip: STRIKE,
    edge: STRIKE,
    metalness: 0.55,
    roughness: 0.28,
    emissive: VENOM,
    emissiveI: 0.75,
    accentLight: '#b91c1c',
    label: 'Venom',
    tag: 'High roller',
  },
  empress: {
    body: VOID,
    pip: FANG,
    edge: FANG,
    metalness: 0.85,
    roughness: 0.15,
    emissive: FANG,
    emissiveI: 0.4,
    accentLight: '#c4a265',
    label: 'Empress',
    tag: 'VIP',
  },
  bone: {
    body: 0xe8e8e8,
    pip: VOID,
    edge: VENOM,
    metalness: 0.15,
    roughness: 0.45,
    emissive: 0x000000,
    emissiveI: 0,
    accentLight: '#e8e8e8',
    label: 'Bone',
    tag: 'Classic',
  },
};

const pipPositions: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-0.25, -0.25], [0.25, 0.25]],
  3: [[-0.25, -0.25], [0, 0], [0.25, 0.25]],
  4: [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]],
  5: [[-0.25, -0.25], [0.25, -0.25], [0, 0], [-0.25, 0.25], [0.25, 0.25]],
  6: [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0], [0.25, 0], [-0.25, 0.25], [0.25, 0.25]],
};

const faces: { val: number; dir: [number, number, number]; up: [number, number, number] }[] = [
  { val: 1, dir: [0, 0, 1], up: [0, 1, 0] },
  { val: 6, dir: [0, 0, -1], up: [0, 1, 0] },
  { val: 2, dir: [1, 0, 0], up: [0, 1, 0] },
  { val: 5, dir: [-1, 0, 0], up: [0, 1, 0] },
  { val: 3, dir: [0, 1, 0], up: [0, 0, -1] },
  { val: 4, dir: [0, -1, 0], up: [0, 0, 1] },
];

// Face N rotation so that face N ends up pointing toward camera (+Z)
const faceRotations: Record<number, { x: number; y: number; z: number }> = {
  1: { x: 0, y: 0, z: 0 },
  2: { x: 0, y: -Math.PI / 2, z: 0 },
  3: { x: Math.PI / 2, y: 0, z: 0 },
  4: { x: -Math.PI / 2, y: 0, z: 0 },
  5: { x: 0, y: Math.PI / 2, z: 0 },
  6: { x: Math.PI, y: 0, z: 0 },
};

function useRoundedBoxGeometry() {
  return useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1, 6, 6, 6);
    const pos = geo.attributes.position;
    const r = 0.52;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const len = Math.sqrt(x * x + y * y + z * z);
      if (len > r) {
        const scale = r / len;
        const t = 0.22;
        pos.setXYZ(
          i,
          x * (1 - t) + x * scale * t,
          y * (1 - t) + y * scale * t,
          z * (1 - t) + z * scale * t
        );
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function useEdgeGeometry() {
  return useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.01, 1.01, 1.01)), []);
}

function computeGridPosition(i: number, n: number): [number, number, number] {
  // Strategic layout — up to 6 dice in a compact grid that fits camera frame
  let cols: number;
  if (n <= 3) cols = n;
  else if (n === 4) cols = 2;
  else cols = 3;
  const rows = Math.ceil(n / cols);
  const col = i % cols;
  const row = Math.floor(i / cols);
  const spacing = 1.45;
  const x = (col - (cols - 1) / 2) * spacing;
  const z = -(row - (rows - 1) / 2) * spacing;
  return [x, 0, z];
}

function Die({
  style,
  index,
  count,
  face,
  bodyGeo,
  edgeGeo,
}: {
  style: StyleKey;
  index: number;
  count: number;
  face: number;
  bodyGeo: THREE.BoxGeometry;
  edgeGeo: THREE.EdgesGeometry;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const baseRot = faceRotations[face];
  const tiltTargetRef = useRef({ x: 0, y: 0 });
  const flourishRef = useRef({ active: false, start: 0, duration: 700 });
  const [hovered, setHovered] = useState(false);
  const s = styles[style];
  const { pointer } = useThree();
  const pos = computeGridPosition(index, count);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;

    // Aim tilt target from pointer (-1..1 normalized device coords)
    const targetX = baseRot.x + pointer.y * 0.22 + (hovered ? 0.05 : 0);
    const targetY = baseRot.y + pointer.x * 0.35 + (hovered ? 0.05 : 0);
    tiltTargetRef.current.x += (targetX - tiltTargetRef.current.x) * 0.12;
    tiltTargetRef.current.y += (targetY - tiltTargetRef.current.y) * 0.12;

    let flourishOffsetY = 0;
    let flourishOffsetZ = 0;
    let liftY = 0;

    if (flourishRef.current.active) {
      const elapsed = performance.now() - flourishRef.current.start;
      const t = Math.min(elapsed / flourishRef.current.duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      flourishOffsetY = ease * Math.PI * 2;
      flourishOffsetZ = Math.sin(t * Math.PI) * 0.3;
      liftY = Math.sin(t * Math.PI) * 0.45;
      if (t >= 1) flourishRef.current.active = false;
    }

    g.rotation.x = tiltTargetRef.current.x;
    g.rotation.y = tiltTargetRef.current.y + flourishOffsetY;
    g.rotation.z = baseRot.z + flourishOffsetZ;
    g.position.x = pos[0];
    g.position.y = liftY + (hovered ? 0.12 : 0);
    g.position.z = pos[2];
  });

  const onClick = (e: any) => {
    e.stopPropagation();
    flourishRef.current = { active: true, start: performance.now(), duration: 700 };
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'none';
      }}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <mesh geometry={bodyGeo} castShadow>
        <meshStandardMaterial
          color={s.body}
          metalness={s.metalness}
          roughness={s.roughness}
          emissive={s.emissive}
          emissiveIntensity={s.emissiveI * 0.28}
        />
      </mesh>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial
          color={s.edge}
          transparent
          opacity={hovered ? 0.85 : 0.45}
        />
      </lineSegments>
      {faces.map((f) =>
        pipPositions[f.val].map(([px, py], i) => {
          const d = f.dir;
          const u = f.up;
          const rVec: [number, number, number] = [
            u[1] * d[2] - u[2] * d[1],
            u[2] * d[0] - u[0] * d[2],
            u[0] * d[1] - u[1] * d[0],
          ];
          const pipPos: [number, number, number] = [
            d[0] * 0.5 + rVec[0] * px + u[0] * py,
            d[1] * 0.5 + rVec[1] * px + u[1] * py,
            d[2] * 0.5 + rVec[2] * px + u[2] * py,
          ];
          return (
            <mesh key={`${f.val}-${i}`} position={pipPos}>
              <sphereGeometry args={[0.065, 14, 14]} />
              <meshStandardMaterial
                color={s.pip}
                metalness={0.3}
                roughness={0.3}
                emissive={s.pip}
                emissiveIntensity={s.emissiveI * (hovered ? 1.35 : 1)}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

function SceneLights({ accent }: { accent: string }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    const t = performance.now() * 0.0004;
    l.position.x = Math.sin(t * 1.4) * 4;
    l.position.z = Math.cos(t * 1.4) * 4;
  });
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight ref={light} color={accent} intensity={4.2} distance={14} position={[-3, 2, 3]} />
      <pointLight color={'#b91c1c'} intensity={1.1} distance={10} position={[3, -1, -3]} />
    </>
  );
}

function FloorShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <shadowMaterial transparent opacity={0.4} />
    </mesh>
  );
}

function DiceScene({
  styleKey,
  count,
  face,
}: {
  styleKey: StyleKey;
  count: number;
  face: number;
}) {
  const bodyGeo = useRoundedBoxGeometry();
  const edgeGeo = useEdgeGeometry();
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Die
          key={`${styleKey}-${count}-${face}-${i}`}
          style={styleKey}
          index={i}
          count={count}
          face={face}
          bodyGeo={bodyGeo}
          edgeGeo={edgeGeo}
        />
      ))}
    </>
  );
}

export default function SpiderDice() {
  const [styleKey, setStyleKey] = useState<StyleKey>('widow');
  const [step, setStep] = useState(3);
  const accent = styles[styleKey].accentLight;

  // count === step, face === step — strategic "N of a kind with face N"
  const count = step;
  const face = step;

  // Scale camera distance based on count so larger grids still fit
  const cameraZ = count <= 3 ? 5.6 : count <= 4 ? 6.4 : 7.2;
  const cameraY = count <= 3 ? 2.3 : 3.0;

  return (
    <section className="relative z-10 py-24 md:py-32 px-6" id="stakes">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 md:mb-14 text-center">
          <p className="font-mono text-silk-dim text-xs uppercase tracking-[0.4em] mb-4">
            Plan the stake
          </p>
          <h2 className="font-display font-black text-silk leading-[0.95] text-[clamp(2rem,6vw,4.5rem)]">
            Cast the <span className="text-strike">silk</span>.
          </h2>
          <p className="mt-5 max-w-xl mx-auto font-display font-light text-silk-dim text-base md:text-lg">
            Pick your rank. <span className="text-silk">{count}</span> {count === 1 ? 'die' : 'dice'},
            every face showing <span className="text-silk">{face}</span>. The web is strategic, not random.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-6 items-stretch">
          {/* 3D stage */}
          <div className="relative rounded-xl overflow-hidden border border-web/60 bg-gradient-to-b from-cave/70 to-abyss min-h-[440px] md:min-h-[540px]">
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{ position: [0, cameraY, cameraZ], fov: 38 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <color attach="background" args={['#050505']} />
              <fog attach="fog" args={['#050505', 6, 20]} />
              <Suspense fallback={null}>
                <SceneLights accent={accent} />
                <FloorShadow />
                <DiceScene styleKey={styleKey} count={count} face={face} />
              </Suspense>
            </Canvas>

            {/* HUD — step indicator */}
            <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-strike shadow-[0_0_10px_#ef4444]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-silk-dim">
                Rank {face} · {count} {count === 1 ? 'die' : 'dice'}
              </span>
            </div>
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-shadow">
              Hover to tilt · click a die for a flourish
            </div>
          </div>

          {/* controls */}
          <aside className="flex flex-col gap-5 rounded-xl border border-web/60 bg-cave/50 p-5">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-shadow">
                  Rank
                </span>
                <span className="font-mono text-[10px] text-strike">
                  {face} of a kind
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((n) => {
                  const active = n === step;
                  return (
                    <button
                      key={n}
                      onClick={() => setStep(n)}
                      className={[
                        'hover-target relative py-3 rounded-md border text-sm font-display transition-all',
                        active
                          ? 'border-strike/80 bg-strike/10 text-strike'
                          : 'border-web/70 text-silk-dim hover:text-silk hover:border-web-light',
                      ].join(' ')}
                    >
                      <span className="block font-mono text-[11px]">{n}</span>
                      {active && (
                        <span className="absolute inset-x-2 -bottom-px h-[2px] bg-strike" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-shadow">
                Each rank unlocks {face} {face === 1 ? 'die' : 'dice'} — the web catches {face}.
              </p>
            </div>

            <div className="h-px bg-web/60" />

            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-shadow mb-2">
                Dice style
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(styles) as StyleKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setStyleKey(k)}
                    className={[
                      'hover-target flex flex-col items-start gap-0.5 px-3 py-2 rounded-md border text-left transition-colors',
                      k === styleKey
                        ? 'border-strike/70 bg-strike/10'
                        : 'border-web/70 hover:border-web-light',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'text-xs font-display uppercase tracking-wide',
                        k === styleKey ? 'text-strike' : 'text-silk-dim',
                      ].join(' ')}
                    >
                      {styles[k].label}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-shadow">
                      {styles[k].tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-web/60" />

            <div className="rounded-lg border border-venom/25 bg-venom/5 p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-shadow mb-1">
                Weave
              </div>
              <div className="font-display font-black text-strike text-3xl leading-none">
                {face * count}
                <span className="text-silk-dim text-lg font-light ml-1">silk</span>
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-silk-dim">
                {count} × {face} · rank {step}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
