import { PortfolioItem } from '@/app/types/Portfolio';

const shipfriend: PortfolioItem = {
  title: 'ShipFriend Tech Blog',
  description:
    '개인 블로그 및 포트폴리오 목적으로 개발한 웹사이트입니다. Next.js의 App Router와 Server Components를 활용해 SEO 최적화와 웹 성능 향상에 중점을 두었습니다. 특히 Lighthouse 성능 지표를 분석하여 CLS와 LCP를 대폭 개선하고, 다크모드 FOUC 문제를 해결하는 등 사용자 경험 향상에 집중했습니다.',
  technologies: [
    'Next.js',
    'TypeScript',
    'MongoDB Atlas',
    'TailwindCSS',
    'NextAuth',
    'Vercel Blobs',
  ],
  features: [
    '서버 컴포넌트와 클라이언트 컴포넌트의 적절한 분리를 통한 SEO 최적화',
    'next/image와 최적화 기법을 통한 CLS 및 LCP 성능 지표 개선 (CLS 0.8→0.02, LCP 1.9초→0.5초)',
    'GitHub OAuth를 활용한 관리자 인증 시스템',
    '인라인 스크립트를 통한 다크모드 FOUC 문제 해결',
    'Vercel Blobs를 활용한 이미지 저장 및 관리',
  ],
  challenges: [
    '검색엔진 최적화를 위해 정적 메타데이터와 동적 메타데이터를 적절히 구성하는 방법 학습',
    '다크모드 전환 시 발생하는 깜빡임(FOUC) 문제를 인라인 스크립트로 해결하는 과정에서 Next.js의 동작 방식 이해',
    'Vercel Edge Functions와 Server Components의 차이점을 이해하고 적절한 사용 사례 파악',
  ],
  mainImage: '/plane.png',
  images: [
    '/images/projects/shipfriend/bloglist.webp',
    '/images/projects/shipfriend/blog-detail.webp',
    '/images/projects/shipfriend/main.webp',
    '/images/projects/shipfriend/serieslist.webp',
  ],
  year: '2025',
  duration: '4개월 (진행 중)',
  category: '개인 블로그',
  links: {
    githubUrl: 'https://github.com/shipfriend0516/techblog',
    deployUrl: 'https://shipfriend.vercel.app',
  },
};
const preview: PortfolioItem = {
  title: 'PREVIEW - 실시간 화상 면접 스터디',
  description:
    '면접 준비를 위한 실시간 화상 면접 스터디 서비스입니다. WebRTC와 Socket.io를 활용하여 실시간 화상 통화와 스터디 진행 기능을 구현했습니다. 특히 WebRTC의 mesh 토폴로지 구조를 이해하고 최적화하는 과정에서 깊이 있는 기술적 탐구를 경험했으며, 복잡한 코드를 커스텀 훅으로 분리하여 유지보수성을 크게 향상시켰습니다.',
  technologies: [
    'React',
    'TypeScript',
    'WebRTC',
    'Socket.io',
    'TailwindCSS',
    'Zustand',
    'React Query',
  ],
  features: [
    'WebRTC 네이티브 API를 활용한 실시간 P2P 화상 통화 구현',
    'Socket.io 기반 시그널링 서버와의 통신',
    'Axios Interceptor를 활용한 토큰 기반 인증 시스템 최적화',
    '대규모 RTC 코드의 커스텀 훅 분리를 통한 유지보수성 향상 (600줄→135줄)',
    'Intersection Observer API를 활용한 스크롤 애니메이션',
  ],
  challenges: [
    'WebRTC ICE Candidate 교환 문제 발견 및 해결 과정에서 webrtc-internals 도구 활용',
    '백엔드 개발자와의 페어 프로그래밍을 통한 시그널링 서버 코드 수정',
    'forwardRef로 전달받는 ref 객체의 재생성으로 인한 불필요한 리렌더링 문제 해결',
    'GitHub Project를 활용한 애자일 스프린트 경험',
  ],
  mainImage: '/images/projects/preview/main.webp',
  images: [
    '/images/projects/preview/main.webp',
    '/images/projects/preview/session-quit.webp',
    '/images/projects/preview/question-list-page.webp',
    '/images/projects/preview/landing-page.webp',
    '/images/projects/preview/login-page.webp',
    '/images/projects/preview/session-list.webp',
  ],
  year: '2024',
  duration: '2개월',
  category: '웹 애플리케이션',
  links: {
    githubUrl: 'https://github.com/boostcampwm-2024/web27-Preview',
  },
};
const primitive: PortfolioItem = {
  title: '프리미티브 - 교내 개발 동아리 플랫폼',
  description:
    '교내 개발 동아리 홍보 및 프로젝트 공유 플랫폼으로, 동아리 활동과 개발 결과물을 소개하기 위한 웹사이트입니다. 초기에는 JavaScript와 Webpack으로 개발했으나, 이후 TypeScript와 Vite로 마이그레이션하는 과정에서 새로운 기술을 적용하고 빌드 성능을 최적화하는 경험을 쌓았습니다.',
  technologies: [
    'React',
    'TypeScript',
    'Firebase',
    'Recoil',
    'Vite',
    'TailwindCSS',
  ],
  features: [
    'Firebase를 활용한 사용자 인증 및 프로젝트 데이터 관리',
    'JavaScript에서 TypeScript로의 마이그레이션',
    'Webpack에서 Vite로의 마이그레이션으로 빌드 시간 50% 이상 단축',
    'Intersection Observer API를 활용한 랜딩 페이지 애니메이션',
    '프로젝트 리스트 페이지 무한 스크롤 구현',
  ],
  challenges: [
    'Firebase 회원가입 메서드의 자동 로그인 문제 해결',
    'TypeScript 마이그레이션 시 타입 정의와 인터페이스 설계',
    'Vite 마이그레이션을 통한 개발 환경 최적화',
    'Recoil을 활용한 전역 상태 관리 설계',
  ],
  mainImage: '/images/projects/primitive/project-list.webp',
  images: [
    '/images/projects/primitive/project-list.webp',
    '/images/projects/primitive/project-detail.webp',
    '/images/projects/primitive/add-project.webp',
    '/images/projects/primitive/faq.webp',
    '/images/projects/primitive/admin-page.webp',
    '/images/projects/primitive/recruit.webp',
  ],
  year: '2024',
  duration: '6개월',
  category: '웹 애플리케이션',
  links: {
    githubUrl: 'https://github.com/shipfriend0516/primitive',
    deployUrl: 'https://primitive.kr',
  },
};
const storyhelper: PortfolioItem = {
  title: 'StoryHelper - 티스토리 블로그 SEO 관리 확장 프로그램',
  description:
    '티스토리 블로그의 SEO 관리를 위한 Chrome 확장 프로그램입니다. 블로그 운영에 있어 중요한 SEO를 최적화하는데 편의성을 중점으로 도구를 추가하고, 글자수 카운터를 추가하고, 기본 단축키 이외 자주쓰이는 기능의 단축키를 추가했습니다. 이 과정에서 Chrome Extension API와 Manifest V3에 대한 이해를 높일 수 있었습니다.\n\n' +
    'Chrome 웹스토어에서 추천 확장프로그램으로 선정되었고, 우수 게시자 배지를 부여받았습니다.',
  technologies: ['React', 'TypeScript', 'Chrome Extension API'],
  features: [
    'Chrome Extension API를 활용한 웹 페이지 DOM 조작',
    'Zustand를 활용한 상태 관리',
    'Manifest V3를 통한 보안 강화 및 성능 최적화',
    '사용자 설정에 따른 키워드 분석 및 SEO 점수 제공',
  ],
  challenges: [
    'Chrome Extension API의 다양한 기능 이해 및 활용',
    'Manifest V3로의 마이그레이션 과정에서 발생한 호환성 문제 해결',
    '사용자 경험을 고려한 UI/UX 디자인 개선',
    'SEO 점수 계산 알고리즘 최적화',
  ],
  mainImage: '/images/projects/storyhelper/main.webp',
  images: ['/images/projects/storyhelper/main.webp'],
  year: '2024',
  duration: '3개월',
  category: 'Chrome Extension',
  links: {
    githubUrl: 'https://github.com/shipfriend0516/storyhelper',
    deployUrl:
      'https://chromewebstore.google.com/detail/storyhelper/inmbdknioncgblpeiiohmdihhidnjpfp?authuser=0&hl=ko',
  },
};

export const portfolioData: {
  [key: string]: PortfolioItem;
} = {
  shipfriend,
  preview,
  primitive,
  storyhelper,
};
