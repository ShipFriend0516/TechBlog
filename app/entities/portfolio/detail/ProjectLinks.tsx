import { FaGithub, FaGlobe } from 'react-icons/fa';
import { PortfolioItem } from '@/app/types/Portfolio';

interface ProjectLinksProps {
  portfolio: PortfolioItem;
}
const ProjectLinks = ({ portfolio }: ProjectLinksProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center">
      <div className="flex flex-wrap gap-3 text-gray-600">
        {portfolio.technologies.map((tech, index) => (
          <span
            key={index}
            className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* GitHub 및 배포 링크 버튼 */}
      <div className="flex gap-3 mt-3 sm:mt-0">
        {portfolio.links?.githubUrl && (
          <a
            href={portfolio.links?.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 text-default hover:opacity-75 rounded-md  transition-colors"
            aria-label="GitHub 저장소"
          >
            <FaGithub size={18} />
          </a>
        )}

        {portfolio.links?.deployUrl && (
          <a
            href={portfolio.links?.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 text-default hover:opacity-75 rounded-md transition-colors"
            aria-label="배포 사이트"
          >
            <FaGlobe size={18} />
          </a>
        )}
      </div>
    </div>
  );
};
export default ProjectLinks;
