import { Project } from '@/app/types/Portfolio';
import project1 from '@/app/public/images/preview-logo.png';
import project2 from '@/app/public/images/primitive-logo.webp';
import project3 from '@/app/public/images/shipfriend-logo.webp';
import project4 from '@/app/public/images/storyhelper-logo.webp';

export const projects: Project[] = [
  {
    title: 'PREVIEW',
    description: 'WebRTC 기반 화상 면접 스터디 플랫폼',
    image: project1,
    tags: ['React', 'WebRTC', 'Fullstack'],
    demoUrl: 'https://boostcamp-preview.kro.kr/',
    githubUrl: 'https://github.com/boostcampwm-2024/web27-Preview',
  },
  {
    title: 'Primitive',
    description: '프로그래밍 동아리 PRIMITIVE 홍보 및 프로젝트 공유 플랫폼',
    image: project2,
    tags: ['React', 'TypeScript', 'Firebase'],
    demoUrl: 'https://primitive.kr',
    githubUrl: 'https://github.com/ShipFriend0516/Primitive',
    slug: 'primitive',
  },
  {
    title: 'ShipFriend TechBlog',
    description: '개인 개발 블로그',
    image: project3,
    tags: ['Next.js', 'TypeScript', 'MongoDB'],
    demoUrl: 'https://shipfriend.vercel.app/',
    githubUrl: 'https://github.com/ShipFriend0516/TechBlog',
  },
  {
    title: 'StoryHelper',
    description: '티스토리 블로그 SEO 관리 확장프로그램',
    image: project4,
    tags: ['React', 'Chrome Extension'],
    demoUrl:
      'https://chromewebstore.google.com/detail/storyhelper/inmbdknioncgblpeiiohmdihhidnjpfp?authuser=0&hl=ko',
    githubUrl: 'https://github.com/ShipFriend0516/StoryHelper',
  },
];
