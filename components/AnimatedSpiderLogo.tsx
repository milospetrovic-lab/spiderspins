export default function AnimatedSpiderLogo({ size = 36 }: { size?: number }) {
  return (
    <span
      className="animated-logo inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <defs>
          <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(239,68,68,0.35)" />
            <stop offset="70%" stopColor="rgba(185,28,28,0)" />
          </radialGradient>
        </defs>

        {/* soft red glow */}
        <circle cx="24" cy="24" r="22" fill="url(#logoGlow)" />

        {/* waving web — rotates slowly + scales subtly */}
        <g className="logo-web" stroke="#888" strokeWidth="0.5" fill="none">
          {[6, 11, 16].map((r) => (
            <circle key={r} cx="24" cy="24" r={r} opacity="0.55" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const x = 24 + Math.cos(a) * 18;
            const y = 24 + Math.sin(a) * 18;
            return (
              <line
                key={i}
                x1="24"
                y1="24"
                x2={x.toFixed(2)}
                y2={y.toFixed(2)}
                opacity="0.45"
              />
            );
          })}
        </g>

        {/* spider body — static */}
        <g>
          {/* legs */}
          <g stroke="#e8e8e8" strokeWidth="0.9" strokeLinecap="round">
            <path d="M24 24 L15 16 L12 18" />
            <path d="M24 24 L14 22 L11 24" />
            <path d="M24 24 L14 26 L11 28" />
            <path d="M24 24 L15 32 L12 34" />
            <path d="M24 24 L33 16 L36 18" />
            <path d="M24 24 L34 22 L37 24" />
            <path d="M24 24 L34 26 L37 28" />
            <path d="M24 24 L33 32 L36 34" />
          </g>
          {/* cephalothorax */}
          <circle cx="24" cy="20" r="2.6" fill="#050505" stroke="#e8e8e8" strokeWidth="0.6" />
          {/* abdomen */}
          <ellipse cx="24" cy="26" rx="3.6" ry="4.2" fill="#050505" stroke="#e8e8e8" strokeWidth="0.6" />
          {/* red hourglass */}
          <path
            d="M22 24 L26 24 L23 27 L25 27 L22 30 L26 30"
            stroke="#ef4444"
            strokeWidth="0.9"
            fill="none"
          />
          {/* eye glint */}
          <circle cx="23.5" cy="19.5" r="0.6" fill="#ef4444" className="logo-eye" />
          <circle cx="24.5" cy="19.5" r="0.6" fill="#ef4444" className="logo-eye" />
        </g>
      </svg>
    </span>
  );
}
