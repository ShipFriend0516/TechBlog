import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      keyframes: {
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
        float: 'float 10s ease-in-out infinite',
        slideUp: 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
