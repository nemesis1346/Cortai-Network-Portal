/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        'panel-2': 'var(--panel-2)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        wired: 'var(--wired)',
        'wired-dim': 'var(--wired-dim)',
        wireless: 'var(--wireless)',
        'wireless-dim': 'var(--wireless-dim)',
        iot: 'var(--iot)',
        'iot-dim': 'var(--iot-dim)',
        danger: 'var(--danger)',
        'danger-bg': 'var(--danger-bg)',
        ok: 'var(--ok)',
      },
      fontFamily: {
        mono: 'var(--mono)',
        sans: 'var(--sans)',
        disp: 'var(--disp)',
      },
    },
  },
  plugins: [],
}