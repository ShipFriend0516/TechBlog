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
    title: 'Primitive',
    description: '프로그래밍 동아리 PRIMITIVE 홍보 및 프로젝트 공유 플랫폼',
    image: '/images/logo/primitive-logo.webp',
    tags: ['React', 'TypeScript', 'Firebase'],
    demoUrl: 'https://primitive.kr',
    githubUrl: 'https://github.com/ShipFriend0516/Primitive',
    slug: 'primitive',
  },
];
