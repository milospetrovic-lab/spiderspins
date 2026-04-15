// Crisp SVG octagon frame behind the hero headline — the shape the user
// wants visible. Responsive, centered, subtle red glow.
export default function HeroHexFrame() {
  const size = 560;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.44;
  const rInner = size * 0.26;
  const spokes = 8;

  const poly = (r: number, rotOffset = -Math.PI / 2) => {
    const pts: string[] = [];
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2 + rotOffset;
      pts.push(
        `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`
      );
    }
    return pts.join(' ');
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[2]"
      style={{
        transform: 'translate(-50%, -50%)',
        width: 'min(860px, 94vw)',
        height: 'min(620px, 82vh)',
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          <filter id="hexGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="hexHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(185,28,28,0.28)" />
            <stop offset="55%" stopColor="rgba(185,28,28,0.06)" />
            <stop offset="100%" stopColor="rgba(185,28,28,0)" />
          </radialGradient>
        </defs>

        {/* very soft wine halo */}
        <circle cx={cx} cy={cy} r={rOuter * 0.95} fill="url(#hexHalo)" opacity="0.55" />

        {/* outer octagon — wine, dim, soft glow */}
        <polygon
          points={poly(rOuter)}
          fill="none"
          stroke="#8b1a1a"
          strokeWidth="1.0"
          strokeLinejoin="round"
          opacity="0.55"
          filter="url(#hexGlow)"
        />

        {/* secondary outer — thin depth line */}
        <polygon
          points={poly(rOuter * 1.035)}
          fill="none"
          stroke="#5b1414"
          strokeWidth="0.5"
          strokeLinejoin="round"
          opacity="0.4"
        />

        {/* inner octagon */}
        <polygon
          points={poly(rInner)}
          fill="none"
          stroke="#6e1818"
          strokeWidth="0.7"
          strokeLinejoin="round"
          opacity="0.42"
        />

        {/* spokes */}
        <g stroke="#5b1414" strokeWidth="0.5" opacity="0.28">
          {Array.from({ length: spokes }).map((_, i) => {
            const a = (i / spokes) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={cx + Math.cos(a) * rInner}
                y1={cy + Math.sin(a) * rInner}
                x2={cx + Math.cos(a) * rOuter}
                y2={cy + Math.sin(a) * rOuter}
              />
            );
          })}
        </g>

        {/* dim dew drops on outer vertices */}
        <g>
          {Array.from({ length: spokes }).map((_, i) => {
            const a = (i / spokes) * Math.PI * 2 - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={cx + Math.cos(a) * rOuter}
                cy={cy + Math.sin(a) * rOuter}
                r="1.8"
                fill="#b91c1c"
                opacity="0.55"
              />
            );
          })}
        </g>

        {/* subtle tick marks around the ring for sci-fi texture */}
        <g stroke="#333" strokeWidth="0.35" opacity="0.4">
          {Array.from({ length: 48 }).map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const r1 = rOuter * 1.08;
            const r2 = r1 + (i % 6 === 0 ? 10 : 5);
            return (
              <line
                key={i}
                x1={cx + Math.cos(a) * r1}
                y1={cy + Math.sin(a) * r1}
                x2={cx + Math.cos(a) * r2}
                y2={cy + Math.sin(a) * r2}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
