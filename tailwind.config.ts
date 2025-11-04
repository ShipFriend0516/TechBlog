import type { Config } from 'tailwindcss';

// Blog Theme Palette
const blogTheme = {
  // Primary Brand Colors
  brand: {
    primary: '#006400', // Deep Green - 브랜드 메인 컬러 (코드, 강조)
    secondary: '#10b981', // Emerald 500 - 액센트 컬러
  },

  primary: {
    rich: '#082626',
    dark: '#032221',
    bangladesh: '#03624c',
    mountain: '#2cc295',
    caribbean: '#00df81',
  },

  // Neutral Palette - 전체적인 톤 관리
  neutral: {
    50: '#f9fafb', // 라이트 배경
    100: '#f3f4f6', // 카드 배경 (light)
    200: '#e5e7eb', // 구분선, 테두리
    300: '#d1d5db', // 비활성 요소
    400: '#9ca3af', // 플레이스홀더
    500: '#6b7280', // 부제목, 메타 정보
    600: '#4b5563', // 본문 텍스트 (light)
    700: '#374151', // 제목 (light)
    800: '#1f2937', // 카드 배경 (dark)
    900: '#111827', // 진한 배경, 제목 (dark)
  },

  // Semantic Colors
  semantic: {
    success: '#10b981', // 성공 메시지
    error: '#ef4444', // 에러 메시지
    warning: '#f59e0b', // 경고 메시지
    info: '#3b82f6', // 정보 메시지
  },

  // Special Effects
  effects: {
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    blur: {
      glass: 'blur(8px)', // 글래스모피즘
    },
    opacity: {
      overlay: '0.4', // 오버레이 투명도
      disabled: '0.5', // 비활성화 요소
    },
  },
};

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

        // Theme Palette
        primary: blogTheme.primary,
        brand: blogTheme.brand,
        semantic: blogTheme.semantic,
      },
      textColor: {
        overlay: 'var(--text-overlay)',
      },
      backgroundColor: {
        card: {
          light: blogTheme.neutral[100],
          dark: blogTheme.neutral[800],
        },
      },
      borderColor: {
        DEFAULT: blogTheme.neutral[200],
        dark: blogTheme.neutral[700],
      },
      boxShadow: blogTheme.effects.shadow,
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
