'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import NotFound from '@/app/not-found';

interface PortfolioDetailPageProps {
  params: {
    slug: string;
  };
}

interface PortfolioItem {
  title: string;
  description: string;
  technologies: string[];
  mainImage: string;
  images: string[];
  year: string;
  category: string;
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
      <main className="w-full max-w-7xl mx-auto px-8 py-12">
        <div className="mb-10">
          <div className={'flex justify-between items-center mb-2'}>
            <h1 className="text-4xl font-bold mb-3">{portfolio.title}</h1>
            <Link
              href="/portfolio"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <FaArrowLeft size={18} />
              <span>목록으로 돌아가기</span>
            </Link>
          </div>
          <div className="flex gap-3 text-gray-600">
            {portfolio.technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                {tech}
              </span>
            ))}
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
              className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <FaArrowLeft size={24} />
            </button>

            <button
              onClick={handleNextImage}
              className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <FaArrowRight size={24} />
            </button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">프로젝트 개요</h2>
          <p className="text-gray-700 leading-relaxed">
            {portfolio.description}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">프로젝트 스크린샷</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousImage}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Previous thumbnail"
              >
                <FaArrowLeft size={18} />
              </button>
              <button
                onClick={handleNextImage}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Next thumbnail"
              >
                <FaArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {portfolio.images.map((image, index) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">
              프로젝트 유형
            </h3>
            <p className="font-medium">{portfolio.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">
              완료 연도
            </h3>
            <p className="font-medium">{portfolio.year}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">
              사용 기술
            </h3>
            <p className="font-medium">{portfolio.technologies.join(', ')}</p>
          </div>
        </div>
      </main>
    </section>
  );
};

export default PortfolioDetailPage;
