import Carousel from '@/app/entities/portfolio/Carousel';
import PortfolioPreview from '@/app/entities/portfolio/PortfolioPreview';
import { Project } from '@/app/types/Portfolio';
import project1 from '@/app/public/images/preview-logo.png';
import project2 from '@/app/public/images/primitive-logo.png';

const PortfolioPage = () => {
  const projects: Project[] = [
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
  ];
  const slides = [
    <PortfolioPreview key={projects[0].title} project={projects[0]} />,
    <PortfolioPreview key={projects[1].title} project={projects[1]} />,
  ];

  return (
    <section
      className={'w-full h-full flex flex-col justify-center items-center'}
    >
      <h1 className={'text-4xl text-center font-bold mt-8 mb-4'}>포트폴리오</h1>
      <div className={'max-w-3xl '}>
        <Carousel slides={slides} />
      </div>
    </section>
  );
};

export default PortfolioPage;
