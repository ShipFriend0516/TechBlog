import { Project } from '@/app/types/Portfolio';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaGlobe } from 'react-icons/fa';
import React from 'react';

interface PortfolioStoneProps {
  project: Project;
  pastelColors: string[];
  setHoveredIndex: (index: number | null) => void;
  index: number;
  isHovered: boolean;
  translateX: number;
  translateY: number;
}
const PortfolioStone = ({
  project,
  pastelColors,
  setHoveredIndex,
  isHovered,
  index,
  translateY,
  translateX,
}: PortfolioStoneProps) => {
  return (
    <div
      className={`
                  ${pastelColors[index % pastelColors.length]}
                  rounded-2xl 
                  shadow-lg 
                  cursor-pointer
                  transition-all 
                  duration-300 
                  ease-out
                  overflow-hidden
                  ${isHovered ? 'shadow-2xl z-10 relative' : 'shadow-lg'}
                `}
      style={{
        transform: `translate(${translateX}px, ${translateY}px) ${isHovered ? 'scale(1.15)' : 'scale(1)'}`,
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="w-full relative overflow-hidden">
        <div className="w-full h-48 bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
          {project.image ? (
            <Image
              width={500}
              height={400}
              src={project.image}
              alt={`${project.title} 프로젝트 이미지`}
              className={`w-full aspect-video object-cover transition-transform duration-500`}
            />
          ) : (
            <span className="text-4xl font-bold text-white/80">
              {project.title.charAt(0)}
            </span>
          )}

          <div
            className={`
                    absolute top-4 right-4 w-3 h-3 rounded-full bg-white/50
                    transition-all duration-300
                    ${isHovered ? 'scale-150 bg-green-300/80' : 'scale-100'}
                  `}
          />
        </div>
      </div>

      <div className="p-4 md:p-6 bg-white/90 backdrop-blur-sm">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-800 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-xs"
            >
              <FaGlobe size={12} />
              배포
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-xs"
            >
              <FaGithub size={12} />
              코드
            </Link>
          )}
          {project.slug && (
            <Link
              href={`/portfolio/${project.slug}`}
              className="flex-1 bg-emerald-100 text-center hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition-colors text-xs"
            >
              자세히
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default PortfolioStone;
