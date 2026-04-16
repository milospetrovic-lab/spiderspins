// Procedural SVG spider portraits — each species has different leg count,
// abdomen shape, eye pattern, mark. Placeholder until commissioned art lands.

type Variant =
  | 'wolf'
  | 'orb'
  | 'funnel'
  | 'widow'
  | 'goliath'
  | 'peacock'
  | 'garden'
  | 'ghost';

type Props = {
  variant: Variant;
  accent: string;
  size?: number;
};

export default function SpiderPortrait({ variant, accent, size = 200 }: Props) {
  const cx = 100;
  const cy = 100;

  // Leg geometry per species — bent in 3 segments for character
  const legShapes: Record<Variant, { count: number; spread: number; bend: number }> = {
    wolf: { count: 8, spread: 0.95, bend: 0.7 },
    orb: { count: 8, spread: 1.1, bend: 0.4 },
    funnel: { count: 8, spread: 0.85, bend: 0.85 },
    widow: { count: 8, spread: 1.0, bend: 0.55 },
    goliath: { count: 8, spread: 1.3, bend: 0.45 },
    peacock: { count: 8, spread: 0.8, bend: 0.65 },
    garden: { count: 8, spread: 1.0, bend: 0.5 },
    ghost: { count: 8, spread: 1.15, bend: 0.6 },
  };
  const cfg = legShapes[variant];

  // Abdomen
  const abdomen: Record<Variant, { rx: number; ry: number; markPath?: string }> = {
    wolf: { rx: 22, ry: 28, markPath: 'M 92 100 L 108 100 L 100 112' },
    orb: { rx: 26, ry: 26 },
    funnel: { rx: 18, ry: 32 },
    widow: { rx: 24, ry: 30, markPath: 'M 92 96 L 108 96 L 96 106 L 104 106 L 92 116 L 108 116' },
    goliath: { rx: 32, ry: 36 },
    peacock: { rx: 24, ry: 22 },
    garden: { rx: 22, ry: 26, markPath: 'M 96 90 L 100 100 L 104 90 M 96 110 L 100 100 L 104 110' },
    ghost: { rx: 24, ry: 30 },
  };
  const ab = abdomen[variant];

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id={`glow-${variant}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
          <stop offset="70%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`abdomen-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
      </defs>

      {/* glow halo */}
      <circle cx={cx} cy={cy} r="92" fill={`url(#glow-${variant})`} />

      {/* legs */}
      <g stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round" fill="none">
        {Array.from({ length: cfg.count }).map((_, i) => {
          const sideIdx = i < cfg.count / 2 ? i : i - cfg.count / 2;
          const isLeft = i < cfg.count / 2;
          const sign = isLeft ? -1 : 1;
          // angle from vertical
          const angleStep = (Math.PI * cfg.spread) / (cfg.count / 2 - 1 || 1);
          const angle = -Math.PI / 2 + (sideIdx + 0.5) * angleStep;
          const baseLen = 70;
          const segA = baseLen * 0.45;
          const segB = baseLen * 0.45;
          const dirX = Math.cos(angle) * sign;
          const dirY = Math.sin(angle);
          const j1x = cx + dirX * segA;
          const j1y = cy + dirY * segA - cfg.bend * 6;
          const tx = j1x + dirX * segB;
          const ty = j1y + dirY * segB + cfg.bend * 12;
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${j1x.toFixed(1)} ${j1y.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}`}
              opacity={variant === 'ghost' ? 0.55 : 1}
            />
          );
        })}
      </g>

      {/* cephalothorax */}
      <circle cx={cx} cy={cy - 18} r="9" fill={`url(#abdomen-${variant})`} stroke="#c9c9c9" strokeWidth="1" />
      {/* eyes */}
      <g fill="#c9c9c9">
        <circle cx={cx - 3} cy={cy - 21} r="1.1" />
        <circle cx={cx + 3} cy={cy - 21} r="1.1" />
        <circle cx={cx - 5.5} cy={cy - 18.5} r="0.7" />
        <circle cx={cx + 5.5} cy={cy - 18.5} r="0.7" />
      </g>
      {/* center eye glow for widow + ghost */}
      {(variant === 'widow' || variant === 'ghost') && (
        <>
          <circle cx={cx - 3} cy={cy - 21} r="1.1" fill="#ef4444" />
          <circle cx={cx + 3} cy={cy - 21} r="1.1" fill="#ef4444" />
        </>
      )}

      {/* abdomen */}
      <ellipse
        cx={cx}
        cy={cy + 6}
        rx={ab.rx}
        ry={ab.ry}
        fill={`url(#abdomen-${variant})`}
        stroke="#c9c9c9"
        strokeWidth="0.9"
        opacity={variant === 'ghost' ? 0.85 : 1}
      />

      {/* species mark on abdomen */}
      {ab.markPath && (
        <path
          d={ab.markPath}
          stroke={accent}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* peacock — color flares on the abdomen */}
      {variant === 'peacock' && (
        <g>
          <ellipse cx={cx - 8} cy={cy + 4} rx="3" ry="5" fill="#c4a265" opacity="0.7" />
          <ellipse cx={cx + 8} cy={cy + 4} rx="3" ry="5" fill="#ef4444" opacity="0.7" />
          <ellipse cx={cx} cy={cy + 14} rx="3" ry="5" fill="#b91c1c" opacity="0.7" />
        </g>
      )}

      {/* funnel-web — funnel mouth at top */}
      {variant === 'funnel' && (
        <path
          d={`M ${cx - 14} ${cy - 40} L ${cx} ${cy - 32} L ${cx + 14} ${cy - 40}`}
          stroke="#aaa"
          strokeWidth="0.8"
          fill="none"
          opacity="0.55"
        />
      )}

      {/* goliath — extra body bristles */}
      {variant === 'goliath' && (
        <g stroke="#c4a265" strokeWidth="0.6" opacity="0.55">
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const r1 = ab.rx + 1;
            const r2 = ab.rx + 5;
            return (
              <line
                key={i}
                x1={cx + Math.cos(a) * r1}
                y1={cy + 6 + Math.sin(a) * ab.ry * (r1 / ab.rx)}
                x2={cx + Math.cos(a) * r2}
                y2={cy + 6 + Math.sin(a) * ab.ry * (r2 / ab.rx)}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}
