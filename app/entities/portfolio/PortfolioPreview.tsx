'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Project } from '@/app/types/Portfolio';
import { FaGithub, FaGlobe } from 'react-icons/fa';

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
  const [isTouched, setIsTouched] = useState(false);

  const handleTouchStart = () => {
    if (hoverEffect) {
      setIsTouched(true);
    }
  };

  const handleTouchEnd = () => {
    if (hoverEffect) {
      setTimeout(() => setIsTouched(false), 3000);
    }
  };

  const showOverlay = hoverEffect && (isHovered || isTouched);

  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          width={500}
          height={400}
          src={project.image}
          alt={`${project.title} 프로젝트 이미지`}
          className={`w-full aspect-video object-cover transition-transform duration-500 ${
            showOverlay ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* 데스크톱 호버 오버레이 */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 hidden md:flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex gap-3  ">
            {project.demoUrl && (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center gap-2 bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded-md transition-colors text-sm ">
                  배포 <FaGlobe size={14} />
                </button>
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={'h-full'}
              >
                <button className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors text-sm   ">
                  <FaGithub size={14} /> Github
                </button>
              </Link>
            )}
            {project.slug && (
              <Link
                href={`/portfolio/${project.slug}`}
                rel="noopener noreferrer"
              >
                <button className="bg-neutral-700 hover:bg-neutral-800 text-white px-4 py-2 rounded-md transition-colors text-sm">
                  세부 정보
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* 모바일 터치 오버레이 */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex md:hidden items-center justify-center transition-opacity duration-300 ${
            isTouched ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col gap-2 px-4  ">
            {project.demoUrl && (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center justify-center gap-2 w-full bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-3 rounded-md transition-colors text-sm">
                  배포 보기 <FaGlobe size={14} />
                </button>
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded-md transition-colors text-sm ">
                  GitHub <FaGithub size={14} />
                </button>
              </Link>
            )}
            {project.slug && (
              <Link
                href={`/portfolio/${project.slug}`}
                rel="noopener noreferrer"
              >
                <button className="w-full bg-neutral-700 hover:bg-neutral-800 text-white px-4 py-3 rounded-md transition-colors text-sm">
                  세부 정보
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <Link href={project.slug ? `/portfolio/${project.slug}` : '#'}>
          <h3 className="text-lg md:text-xl font-bold mb-2 hover:text-emerald-500 transition-colors line-clamp-2">
            {project.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 md:mb-4 line-clamp-3">
          {project.description}
        </p>

        {!hideTags && project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 모바일 하단 액션 버튼들 */}
        <div className="flex md:hidden gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <button className="inline-flex items-center justify-center gap-1 w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 px-3 py-2 rounded-md transition-colors text-xs">
                <FaGlobe size={12} />
                배포
              </button>
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <button className="inline-flex items-center justify-center gap-1 w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 px-3 py-2 rounded-md transition-colors text-xs">
                <FaGithub size={12} />
                코드
              </button>
            </Link>
          )}
          {project.slug && (
            <Link
              href={`/portfolio/${project.slug}`}
              rel="noopener noreferrer"
              className="flex-1"
            >
              <button className="w-full bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-700 text-emerald-700 dark:text-emerald-200 px-3 py-2 rounded-md transition-colors text-xs">
                자세히
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;
