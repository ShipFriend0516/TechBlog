'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaGithub, FaGlobe } from 'react-icons/fa';
import NotFound from '@/app/not-found';
import { PortfolioItem } from '@/app/types/Portfolio';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import ProjectOverview from '@/app/entities/portfolio/detail/ProjectOverview';
import ProjectScreenshots from '@/app/entities/portfolio/detail/ProjectScreenshots';
import ProjectChallenges from '@/app/entities/portfolio/detail/ProjectChallenges';
import ProjectSummary from '@/app/entities/portfolio/detail/ProjectSummary';

interface PortfolioDetailPageProps {
  params: {
    slug: string;
  };
}

const PortfolioDetailPage = ({ params }: PortfolioDetailPageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getPortfolioDetailConfig: useDataFetchConfig = {
    url: `/api/portfolio/${params.slug}`,
    method: 'get',
    onError: (error) => {
      console.error('Error fetching portfolio details:', error);
    },
    dependencies: [params.slug],
  };

  const { data: portfolio, loading } = useDataFetch<PortfolioItem>(
    getPortfolioDetailConfig
  );

  if (!portfolio) {
    return <NotFound />;
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? portfolio.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === portfolio.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectThumbnail = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!loading && portfolio.title === '') {
    return <NotFound />;
  }

  return (
    <section className="min-h-screen">
      <main className="w-full max-w-7xl mx-auto px-8 py-6 md:py-12">
        <div className="mb-10">
          <div className={'flex justify-between items-center mb-3'}>
            <h1 className="text-xl md:text-4xl font-bold">{portfolio.title}</h1>
            <Link
              href="/portfolio"
              className="text-weak hover:text-default flex items-center gap-2 transition-colors"
            >
              <FaArrowLeft size={18} />
              <span className={'hidden lg:inline'}>목록으로 돌아가기</span>
            </Link>
          </div>
          {/* 기술 스택 태그 및 링크 버튼 */}
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
        </div>

        <div className="w-full h-[500px] relative mb-8 bg-gray-100 rounded-lg overflow-hidden">
          {portfolio.images.length > 0 && (
            <Image
              src={portfolio.images[currentImageIndex]}
              alt={`${portfolio.title} screenshot ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
          )}

          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={handlePreviousImage}
              className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-lg hover:bg-white transition-colors dark:text-black"
              aria-label="이전 이미지"
            >
              <IoMdArrowDropleft size={24} />
            </button>

            <button
              onClick={handleNextImage}
              className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-lg hover:bg-white transition-colors dark:text-black"
              aria-label="다음 이미지"
            >
              <IoMdArrowDropright size={24} />
            </button>
          </div>
        </div>
        <ProjectOverview description={portfolio.description} />
        <ProjectScreenshots
          images={portfolio.images}
          currentImageIndex={currentImageIndex}
          selectThumbnail={selectThumbnail}
          handleNextImage={handleNextImage}
          handlePreviousImage={handlePreviousImage}
        />
        <ProjectChallenges challenges={portfolio.challenges || []} />
        <ProjectSummary
          year={portfolio.year}
          category={portfolio.category}
          technologies={portfolio.technologies}
        />
      </main>
    </section>
  );
};

export default PortfolioDetailPage;
