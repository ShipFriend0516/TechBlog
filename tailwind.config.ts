import type { Config } from 'tailwindcss';

// Space + Minimal 디자인 토큰 — 실제 값은 app/globals.css 의 CSS 변수에 정의
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'ring-2',
    'ring-amber-400/50',
    'ring-pink-400/50',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surface — bg 대신 base 로 명명 (bg-base)
        base: token('base'),
        surface: token('surface'),
        raised: token('raised'),
        overlay: token('overlay'),

        // Text
        fg: {
          DEFAULT: token('fg'),
          soft: token('fg-soft'),
          muted: token('fg-muted'),
          faint: token('fg-faint'),
        },

        // Accent — 클릭 가능한 요소에만 사용
        accent: {
          DEFAULT: token('accent'),
          strong: token('accent-strong'),
          subtle: 'rgb(var(--accent) / var(--accent-subtle-alpha))',
        },
        'on-accent': token('on-accent'),

        // Nebula — 배경, 히어로, 썸네일 같은 장식에만 사용
        nebula: {
          DEFAULT: token('nebula'),
          soft: token('nebula-soft'),
          subtle: 'rgb(var(--nebula) / var(--nebula-subtle-alpha))',
          haze: 'rgb(var(--nebula) / var(--nebula-haze-alpha))',
        },

        hairline: 'rgb(var(--fg) / var(--hairline-alpha))',

        // Semantic
        danger: token('danger'),
        warning: token('warning'),
        info: token('info'),
      },
      borderColor: {
        DEFAULT: 'rgb(var(--fg) / var(--hairline-alpha))',
      },
      boxShadow: {
        'glow-sm': 'var(--glow-sm)',
        'glow-md': 'var(--glow-md)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
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
            transform: 'translateY(50%)',
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
        bubbleInRight: {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bubbleInLeft: {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        atelierIn: {
          '0%': { transform: 'scale(0.75)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
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
        bubblePop: {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
            filter: 'blur(0px) brightness(1)',
          },
          '55%': {
            transform: 'scale(1.08)',
            opacity: '1',
            filter: 'blur(0px) brightness(1)',
          },
          '68%': {
            transform: 'scale(1.16)',
            opacity: '0.9',
            filter: 'blur(0px) brightness(1.6)',
          },
          '80%': {
            transform: 'scale(1.9)',
            opacity: '0.15',
            filter: 'blur(5px) brightness(1)',
          },
          '100%': {
            transform: 'scale(2.4)',
            opacity: '0',
            filter: 'blur(10px)',
          },
        },
        sparkleFloat: {
          '0%':   { transform: 'translate(0, 0) scale(0) rotate(0deg)',   opacity: '0' },
          '20%':  { transform: 'translate(var(--sx), var(--sy)) scale(1) rotate(var(--sr))', opacity: '1' },
          '80%':  { transform: 'translate(calc(var(--sx) * 1.5), calc(var(--sy) * 1.5)) scale(0.6) rotate(calc(var(--sr) * 2))', opacity: '0.6' },
          '100%': { transform: 'translate(calc(var(--sx) * 2), calc(var(--sy) * 2)) scale(0) rotate(calc(var(--sr) * 3))', opacity: '0' },
        },
        sparklePulse: {
          '0%, 100%': { transform: 'scale(1)',   opacity: '1' },
          '50%':      { transform: 'scale(1.4)', opacity: '0.7' },
        },
        starGlow: {
          '0%, 100%': { boxShadow: '0 0 4px 1px rgba(251,191,36,0.6)' },
          '50%':      { boxShadow: '0 0 12px 4px rgba(251,191,36,0.9)' },
        },
        petalFloat: {
          '0%':   { transform: 'translate(0, 0) scale(0) rotate(0deg)',   opacity: '0' },
          '20%':  { transform: 'translate(var(--px), var(--py)) scale(1) rotate(var(--pr))', opacity: '1' },
          '80%':  { transform: 'translate(calc(var(--px) * 1.5), calc(var(--py) * 1.5)) scale(0.7) rotate(calc(var(--pr) * 2))', opacity: '0.5' },
          '100%': { transform: 'translate(calc(var(--px) * 2), calc(var(--py) * 2)) scale(0) rotate(calc(var(--pr) * 3))', opacity: '0' },
        },
        flowerGlow: {
          '0%, 100%': { boxShadow: '0 0 4px 1px rgba(244,114,182,0.6)' },
          '50%':      { boxShadow: '0 0 12px 4px rgba(244,114,182,0.9)' },
        },
        // 글이 많은 태그(초거성)의 빛 번짐
        tagGlow: {
          // bg-clip-text 그라디언트 글자는 text-shadow 가 위에 덮이므로 drop-shadow 사용
          '0%, 100%': { filter: 'drop-shadow(0 0 3px rgb(var(--accent) / 0.35))' },
          '50%': {
            filter:
              'drop-shadow(0 0 6px rgb(var(--accent) / 0.75)) drop-shadow(0 0 14px rgb(var(--nebula) / 0.4))',
          },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.6) rotate(0deg)', opacity: '0.4' },
          '50%': { transform: 'scale(1.1) rotate(90deg)', opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '0.35' },
        },
        arrowChase: {
          '0%':   { transform: 'translateX(-10px)', opacity: '0' },
          '25%':  { transform: 'translateX(0)',     opacity: '1' },
          '70%':  { transform: 'translateX(10px)',  opacity: '1' },
          '100%': { transform: 'translateX(14px)',  opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s ease-in-out infinite',
        popUp: 'popUp 0.5s ease-out',
        float: 'float 10s ease-in-out infinite',
        slideUp: 'slideUp 0.5s ease-out',
        heartBeat: 'heartBeat 0.7s cubic-bezier(0.17, 0.89, 0.32, 1.49)',
        heartPing: 'heartPing 0.8s cubic-bezier(0, 0, 0.2, 1)',
        bubbleInRight:
          'bubbleInRight 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        bubbleInLeft:
          'bubbleInLeft 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        atelierIn: 'atelierIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        bubblePop: 'bubblePop 0.5s ease-in forwards',
        sparkleFloat: 'sparkleFloat var(--sd, 1.2s) ease-out var(--delay, 0s) infinite',
        sparklePulse: 'sparklePulse 1.5s ease-in-out infinite',
        starGlow:     'starGlow 2s ease-in-out infinite',
        petalFloat: 'petalFloat var(--pd, 1.2s) ease-out var(--delay, 0s) infinite',
        flowerGlow: 'flowerGlow 2s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        tagGlow: 'tagGlow 3s ease-in-out infinite',
        sparkle: 'sparkle 2.4s ease-in-out infinite',
        arrowChase: 'arrowChase 1.1s cubic-bezier(0.5, 0, 0.4, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
