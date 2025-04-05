'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Project } from '@/app/types/Portfolio';

interface PortfolioPreviewProps {
  project: Project;
  hideTags?: boolean;
  hoverEffect?: boolean;
}

const PortfolioPreview = ({
  project,
  hideTags,
  hoverEffect = true,
}: PortfolioPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Image
          width={500}
          height={400}
          src={project.image}
          alt={`${project.title} 프로젝트 이미지`}
          className={`w-full aspect-video object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {hoverEffect && (
          <div
            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex gap-3">
              {project.demoUrl && (
                <Link
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded-md transition-colors">
                    배포 링크
                  </button>
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors">
                    GitHub
                  </button>
                </Link>
              )}{' '}
              {project.slug && (
                <Link
                  href={`/portfolio/${project.slug}`}
                  rel="noopener noreferrer"
                >
                  <button className="bg-neutral-700 hover:bg-neutral-800 text-white px-4 py-2 rounded-md transition-colors">
                    세부 정보
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <Link href={project.slug ? `/portfolio/${project.slug}` : '#'}>
          <h3 className="text-xl font-bold mb-2 hover:text-emerald-500 transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {project.description}
        </p>

        {!hideTags && project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPreview;
