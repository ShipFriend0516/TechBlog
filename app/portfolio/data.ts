import { Project } from '@/app/types/Portfolio';

export const projects: Project[] = [
  {
    title: 'PREVIEW',
    description: 'WebRTC 기반 화상 면접 스터디 플랫폼',
    image: '/images/logo/preview-logo.png',
    tags: ['React', 'WebRTC', 'Fullstack'],
    githubUrl: 'https://github.com/boostcampwm-2024/web27-Preview',
    slug: 'preview',
  },
  {
    title: 'Primitive',
    description: '프로그래밍 동아리 PRIMITIVE 홍보 및 프로젝트 공유 플랫폼',
    image: '/images/logo/primitive-logo.webp',
    tags: ['React', 'TypeScript', 'Firebase'],
    demoUrl: 'https://primitive.kr',
    githubUrl: 'https://github.com/ShipFriend0516/Primitive',
    slug: 'primitive',
  },
  {
    title: 'ShipFriend TechBlog',
    description: '개인 개발 블로그',
    image: '/images/logo/shipfriend-logo.webp',
    tags: ['Next.js', 'TypeScript', 'MongoDB'],
    demoUrl: 'https://shipfriend.dev/',
    githubUrl: 'https://github.com/ShipFriend0516/TechBlog',
    slug: 'shipfriend',
  },
  {
    title: 'StoryHelper',
    description: '티스토리 블로그 SEO 관리 확장프로그램',
    image: '/images/logo/storyhelper-logo.webp',
    tags: ['React', 'Chrome Extension'],
    demoUrl:
      'https://chromewebstore.google.com/detail/storyhelper/inmbdknioncgblpeiiohmdihhidnjpfp?authuser=0&hl=ko',
    githubUrl: 'https://github.com/ShipFriend0516/StoryHelper',
    slug: 'storyhelper',
  },
];
