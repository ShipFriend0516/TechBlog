'use client';
import { projects } from '@/app/portfolio/data';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaGithub, FaGlobe } from 'react-icons/fa';
import { Project } from '@/app/types/Portfolio';
import Link from 'next/link';

const PortfolioPage = () => {
  return (
    <section
      className={
        'w-full h-full max-w-7xl mx-auto flex flex-col justify-center items-center'
      }
    >
      <PortfolioStonesGrid />
    </section>
  );
};

const PortfolioStonesGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pastelColors = [
    'bg-emerald-200',
    'bg-blue-200',
    'bg-amber-200',
    'bg-purple-200',
    'bg-teal-200',
    'bg-rose-200',
  ];

  return (
    <div className="min-h-full p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl text-center font-bold mt-8 mb-4">포트폴리오</h1>
        <p className="text-sm mb-8 text-center text-gray-600">
          참여한 프로젝트 모아보기
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-6">
          {projects.map((project, index) => {
            // 현재 카드의 위치 계산 (행, 열)
            const cols =
              window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
            const row = Math.floor(index / cols);
            const col = index % cols;

            // 호버된 카드의 위치 계산
            const hoveredRow =
              hoveredIndex !== null ? Math.floor(hoveredIndex / cols) : -1;
            const hoveredCol = hoveredIndex !== null ? hoveredIndex % cols : -1;

            // 호버된 카드와의 거리 계산
            const isHovered = hoveredIndex === index;
            const isAdjacent =
              hoveredIndex !== null &&
              Math.abs(row - hoveredRow) <= 1 &&
              Math.abs(col - hoveredCol) <= 1;

            // 호버된 카드 기준으로 이동 방향 계산
            let translateX = 0;
            let translateY = 0;

            if (hoveredIndex !== null && !isHovered && isAdjacent) {
              const deltaRow = row - hoveredRow;
              const deltaCol = col - hoveredCol;

              // 대각선 및 직선 방향으로 밀어내기
              translateX = deltaCol * 12;
              translateY = deltaRow * 12;
            }

            return (
              <PortfolioStone
                key={project.title}
                project={project}
                index={index}
                setHoveredIndex={setHoveredIndex}
                isHovered={isHovered}
                pastelColors={pastelColors}
                translateX={translateX}
                translateY={translateY}
              />
            );
          })}
        </div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          프로젝트 카드에 마우스를 올려보세요 - 주변 카드들이 밀려납니다
        </p>
      </div>
    </div>
  );
};

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
      {/* 이미지 영역 */}
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
          {/* 호버 인디케이터 */}
          <div
            className={`
                    absolute top-4 right-4 w-3 h-3 rounded-full bg-white/50
                    transition-all duration-300
                    ${isHovered ? 'scale-150 bg-green-300/80' : 'scale-100'}
                  `}
          />
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4 md:p-6 bg-white/90 backdrop-blur-sm">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-800 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* 태그들 */}
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

        {/* 액션 버튼들 */}
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

export default PortfolioPage;
