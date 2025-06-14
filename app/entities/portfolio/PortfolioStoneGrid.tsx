import { Project } from '@/app/types/Portfolio';
import React, { useState } from 'react';
import PortfolioStone from '@/app/entities/portfolio/PortfolioStone';

const PortfolioStoneGrid = ({ projects }: { projects: Project[] }) => {
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
        {!projects || projects.length === 0 ? (
          <p className="text-center text-gray-500">프로젝트가 없습니다.</p>
        ) : null}
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

export default PortfolioStoneGrid;
