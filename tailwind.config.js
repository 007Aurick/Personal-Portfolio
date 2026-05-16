/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          raised: '#111111',
          card: '#151515',
          muted: '#9ca3af',
        },
        gold: {
          DEFAULT: '#b57a10',
          light: '#d5a63c',
          bright: '#f0ce70',
          dim: 'rgba(181, 122, 16, 0.35)',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 60px rgba(181, 122, 16, 0.12)',
        'gold-card': '0 0 0 1px rgba(181, 122, 16, 0.22), 0 18px 50px rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'eq-bar': 'eqBar 0.85s ease-in-out infinite',
        float: 'floaty 5s ease-in-out infinite',
        shimmer: 'shimmer 14s linear infinite',
      },
      keyframes: {
        eqBar: {
          '0%, 100%': { transform: 'scaleY(0.32)' },
          '50%': { transform: 'scaleY(1)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      backgroundImage: {
        'grain':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
