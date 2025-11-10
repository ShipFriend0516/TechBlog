import { Project } from '@/app/types/Portfolio';
import PortfolioPreview from '../portfolio/PortfolioPreview';

interface FeaturedProjectsProps {
  projects: Project[];
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  return (
    <section className="grid gap-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Featured Projects
        </h2>
        <div className="h-1 w-24 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
      </div>
      <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
        {projects.map((project) => {
          return <PortfolioPreview key={project.title} project={project} />;
        })}
      </div>
    </section>
  );
};

export default FeaturedProjects;
