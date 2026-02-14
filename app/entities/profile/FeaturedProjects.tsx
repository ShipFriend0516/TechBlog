import { Project } from '@/app/types/Portfolio';
import SectionHeading from '../common/SectionHeading';
import PortfolioPreview from '../portfolio/PortfolioPreview';

interface FeaturedProjectsProps {
  projects: Project[];
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  return (
    <section className="grid gap-6">
      <SectionHeading title="Featured Projects" />
      <div className={'flex flex-col gap-8'}>
        {projects.map((project) => {
          return <PortfolioPreview key={project.title} project={project} />;
        })}
      </div>
    </section>
  );
};

export default FeaturedProjects;
