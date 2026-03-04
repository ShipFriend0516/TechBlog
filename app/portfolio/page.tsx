import PortfolioStoneGrid from '@/app/entities/portfolio/PortfolioStoneGrid';
import { projects } from '@/app/portfolio/data';

const PortfolioPage = () => {
  return (
    <section
      className={
        'w-full h-full max-w-7xl mx-auto flex flex-col justify-center items-center'
      }
    >
      <h1 className="text-4xl text-center font-bold mt-8 mb-4">포트폴리오</h1>
      <p className="text-sm mb-8 text-center text-gray-600 dark:text-gray-400">
        참여한 프로젝트 모아보기
      </p>
      <PortfolioStoneGrid projects={projects} />
    </section>
  );
};

export default PortfolioPage;
