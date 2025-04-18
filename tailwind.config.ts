import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        default: 'var(--text-default)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        overlay: 'var(--bg-overlay)',
        weak: 'var(--text-weak)',
      },
      textColor: {
        overlay: 'var(--text-overlay)',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'sans-serif'],
      },
      keyframes: {
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.25)' },
          '30%': { transform: 'scale(0.95)' },
          '45%': { transform: 'scale(1.15)' },
          '60%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1)' },
        },
        heartPing: {
          '75%, 100%': {
            transform: 'scale(1.5)',
            opacity: '0',
          },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        popUp: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%': {
            transform: 'translateY(0) scale(0)',
            opacity: '0',
          },
          '20%': {
            transform: 'translateY(-20vh) scale(1)',
            opacity: '0.1',
          },
          '80%': {
            transform: 'translateY(-80vh) scale(1)',
            opacity: '0.1',
          },
          '100%': {
            transform: 'translateY(-100vh) scale(1)',
            opacity: '0',
          },
        },
      },
      animation: {
        blink: 'blink 1s ease-in-out infinite',
        popUp: 'popUp 0.5s ease-out',
        float: 'float 10s ease-in-out infinite',
        slideUp: 'slideUp 0.5s ease-out',
        heartBeat: 'heartBeat 0.7s cubic-bezier(0.17, 0.89, 0.32, 1.49)',
        heartPing: 'heartPing 0.8s cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
