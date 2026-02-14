'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaGlobe } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';
import { Project } from '@/app/types/Portfolio';

interface PortfolioPreviewProps {
  project: Project;
  hideTags?: boolean;
}

const PortfolioPreview = ({ project, hideTags }: PortfolioPreviewProps) => {
  return (
    <div className="flex flex-col md:flex-row group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-primary-rich rounded-2xl overflow-hidden shadow transition-all duration-300 border border-gray-200 dark:border-gray-700">
      {/* 이미지 영역 */}
      <div className="relative overflow-hidden w-full md:w-1/3 shrink-0">
        <Link href={project.slug ? `/portfolio/${project.slug}` : '#'}>
          <Image
            width={500}
            height={400}
            src={project.image}
            alt={`${project.title} 프로젝트 이미지`}
            className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* 정보 + 버튼 영역 */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* 텍스트 정보 */}
        <div className="flex-1 p-5 md:p-6">
          <Link href={project.slug ? `/portfolio/${project.slug}` : '#'}>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors line-clamp-2">
              {project.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {!hideTags && project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex md:flex-col gap-2 p-4 md:p-5   border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 justify-center items-stretch">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none"
              title="배포 링크"
            >
              <button className="inline-flex items-center justify-center gap-1.5 w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg transition-colors text-xs font-medium">
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
              className="flex-1 md:flex-none"
              title="GitHub 코드 보기"
            >
              <button className="inline-flex items-center justify-center gap-1.5 w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg transition-colors text-xs font-medium">
                <FaGithub size={12} />
                코드
              </button>
            </Link>
          )}
          {project.slug && (
            <Link
              href={`/portfolio/${project.slug}`}
              rel="noopener noreferrer"
              className="flex-1 md:flex-none"
              title="자세히 보기"
            >
              <button className="inline-flex items-center justify-center gap-1.5 w-full bg-gray-800 dark:bg-gray-200 hover:bg-gray-700 dark:hover:bg-gray-300 text-gray-100 dark:text-gray-900 px-3 py-2 rounded-lg transition-colors text-xs font-medium">
                <MdArrowForward size={12} />
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
