'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaGithub, FaGlobe } from 'react-icons/fa';
import NotFound from '@/app/not-found';
import { Challenge, PortfolioItem } from '@/app/types/Portfolio';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { FaLink } from 'react-icons/fa6';

interface PortfolioDetailPageProps {
  params: {
    slug: string;
  };
}

const PortfolioDetailPage = ({ params }: PortfolioDetailPageProps) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem>({
    title: '',
    description: '',
    technologies: [],
    mainImage: '',
    images: [],
    year: '',
    category: '',
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioDetail();
  }, [params.slug]);

  const getPortfolioDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/portfolio`, {
        params: { slug: params.slug },
      });
      const data = await response.data;
      setPortfolio(data);
    } catch (error) {
      console.error('Error fetching portfolio details:', error);
    } finally {
      setLoading(false);
    }
  };

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

const ProjectOverview = ({ description }: { description: string }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">프로젝트 개요</h2>
      <p className="whitespace-pre-line text-weak leading-relaxed">
        {description}
      </p>
    </div>
  );
};

interface ProjectScreenshotsProps {
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  images: string[];
  currentImageIndex: number;
  selectThumbnail: (index: number) => void;
}

const ProjectScreenshots = ({
  handlePreviousImage,
  handleNextImage,
  images,
  currentImageIndex,
  selectThumbnail,
}: ProjectScreenshotsProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">프로젝트 스크린샷</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousImage}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors "
            aria-label="이전 썸네일"
          >
            <IoMdArrowDropleft size={18} />
          </button>
          <button
            onClick={handleNextImage}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="다음 썸네일"
          >
            <IoMdArrowDropright size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative h-24 bg-gray-100 rounded cursor-pointer overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-emerald-500 ring-offset-2' : 'hover:opacity-80'}`}
            onClick={() => selectThumbnail(index)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ProjectSummaryProps {
  category: string;
  year: string;
  technologies: string[];
}

const ProjectSummary = ({
  category,
  year,
  technologies,
}: ProjectSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-gray-50 rounded-lg text-neutral-600">
      <div>
        <h3 className="text-sm font-semibold mb-1 text-neutral-800">
          프로젝트 유형
        </h3>
        <p className="font-medium">{category}</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1 text-neutral-800">
          완료 연도
        </h3>
        <p className="font-medium">{year}</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1 text-neutral-800">
          사용 기술
        </h3>
        <p className="font-medium">{technologies.join(', ')}</p>
      </div>
    </div>
  );
};

interface ProjectChallengesProps {
  challenges: Challenge[];
}

const ProjectChallenges = ({ challenges }: ProjectChallengesProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold">프로젝트 문제해결</h2>
      <p className="text-weak leading-relaxed">
        이 섹션에서는 프로젝트 진행 중 발생한 문제와 해결 방법을 공유합니다.
      </p>
      {challenges.map((problem, index) => (
        <div key={index} className="mt-6">
          {problem.url ? (
            <Link
              href={problem.url || '#'}
              className={`${problem.url && 'text-blue-400 hover:text-blue-500'} flex items-center gap-2`}
            >
              <h3 className="text-lg font-semibold">{problem.title}</h3>
              {problem.url && <FaLink />}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold">{problem.title}</h3>
          )}
          <p className="text-weak">{problem.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PortfolioDetailPage;
