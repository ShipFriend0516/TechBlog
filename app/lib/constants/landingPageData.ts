import { Project } from '@/app/types/Portfolio';

export const linkedinLink =
  'https://www.linkedin.com/in/%EC%A0%95%EC%9A%B0-%EC%84%9C-9a0b79312/';
export const githubLink = 'https://github.com/ShipFriend0516';

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
    title: 'ShipFriend TechBlog',
    description: '개발 관련 글을 작성하고 공유하는 기술 블로그 플랫폼',
    image: '/images/logo/shipfriend-logo.webp',
    tags: ['Next.js', 'TypeScript', 'MongoDB'],
    demoUrl: 'https://shipfriend.dev',
    githubUrl: 'https://github.com/ShipFriend0516/TechBlog',
    slug: 'shipfriend',
  },
  // {
  //   title: 'Primitive',
  //   description: '프로그래밍 동아리 PRIMITIVE 홍보 및 프로젝트 공유 플랫폼',
  //   image: '/images/logo/primitive-logo.webp',
  //   tags: ['React', 'TypeScript', 'Firebase'],
  //   demoUrl: 'https://primitive.kr',
  //   githubUrl: 'https://github.com/ShipFriend0516/Primitive',
  //   slug: 'primitive',
  // },
];
