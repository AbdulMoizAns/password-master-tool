/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"JetBrains Mono"', '"Share Tech Mono"', 'monospace'],
        mono: ['"Fira Code"', '"Share Tech Mono"', 'monospace'],
      },
      colors: {
        neon: {
          accent: '#00FF41',
          primary: '#00E635',
          muted: '#008822',
          dim: 'rgba(0,255,65,0.4)',
          red: '#ff2a2a',
        },
        risk: {
          warning: '#FFD700',
          danger: '#FF3131',
        },
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        scan: 'scan 8s linear infinite',
        flicker: 'flicker 0.15s infinite',
      },
    },
  },
  plugins: [],
}
