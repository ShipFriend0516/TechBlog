'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import ProjectChallenges from '@/app/entities/portfolio/detail/ProjectChallenges';
import ProjectLinks from '@/app/entities/portfolio/detail/ProjectLinks';
import ProjectOverview from '@/app/entities/portfolio/detail/ProjectOverview';
import ProjectScreenshots from '@/app/entities/portfolio/detail/ProjectScreenshots';
import ProjectSummary from '@/app/entities/portfolio/detail/ProjectSummary';
import useCarousel from '@/app/hooks/common/useCarousel';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import NotFound from '@/app/not-found';
import { PortfolioItem } from '@/app/types/Portfolio';

interface PortfolioDetailPageProps {
  params: {
    slug: string;
  };
}

const PortfolioDetailPage = ({ params }: PortfolioDetailPageProps) => {
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

  const {
    currentImageIndex,
    handlePreviousImage,
    handleNextImage,
    selectThumbnail,
  } = useCarousel({ itemsLength: portfolio?.images.length || 0 });

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!loading && !portfolio) {
    return <NotFound />;
  }
  if (!portfolio) {
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
          <ProjectLinks portfolio={portfolio} />
        </div>

        <div className="w-full min-h-[500px] h-[500px] relative mb-8 bg-gray-100 rounded-lg overflow-hidden">
          {portfolio.images.length > 0 && (
            <Image
              src={portfolio.images[currentImageIndex]}
              alt={`${portfolio.title} screenshot ${currentImageIndex + 1}`}
              fill
              loading={'eager'}
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
