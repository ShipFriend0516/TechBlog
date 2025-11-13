import PortfolioStoneGrid from '@/app/entities/portfolio/PortfolioStoneGrid';
import { projects } from '@/app/portfolio/data';

const PortfolioPage = () => {
  return (
    <section
      className={
        'w-full h-full max-w-7xl mx-auto flex flex-col justify-center items-center'
      }
    >
      <PortfolioStoneGrid projects={projects} />
    </section>
  );
};

export default PortfolioPage;
