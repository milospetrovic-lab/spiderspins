export default function GrainOverlay() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${encoded}")`,
        backgroundSize: '240px 240px',
        opacity: 0.5,
        mixBlendMode: 'overlay',
      }}
    />
  );
}
