import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        abyss: '#0a0a0a',
        cave: '#111111',
        web: '#222222',
        'web-light': '#333333',
        venom: '#b91c1c',
        strike: '#ef4444',
        'strike-glow': 'rgba(239,68,68,0.15)',
        silk: '#e8e8e8',
        'silk-dim': '#aaaaaa',
        shadow: '#666666',
        fang: '#c4a265',
        'fang-dark': '#8b7355',
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'strike-glow': '0 0 40px rgba(239,68,68,0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
