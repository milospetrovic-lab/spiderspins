export default function SpiderMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* legs */}
      <g stroke="#e8e8e8" strokeWidth="1.2" strokeLinecap="round">
        <path d="M20 20 L8 8 L4 12" />
        <path d="M20 20 L6 16 L2 20" />
        <path d="M20 20 L6 24 L2 24" />
        <path d="M20 20 L8 32 L4 36" />
        <path d="M20 20 L32 8 L36 12" />
        <path d="M20 20 L34 16 L38 20" />
        <path d="M20 20 L34 24 L38 24" />
        <path d="M20 20 L32 32 L36 36" />
      </g>
      {/* cephalothorax */}
      <circle cx="20" cy="16" r="3.2" fill="#050505" stroke="#e8e8e8" strokeWidth="1" />
      {/* abdomen */}
      <ellipse cx="20" cy="24" rx="5" ry="6" fill="#050505" stroke="#e8e8e8" strokeWidth="1" />
      {/* hourglass */}
      <path
        d="M18 22 L22 22 L19 25 L21 25 L18 28 L22 28"
        stroke="#ef4444"
        strokeWidth="1.1"
        fill="none"
      />
    </svg>
  );
}
