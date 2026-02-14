'use client';

import { cloneElement, ReactElement, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface CarouselProps {
  slides: React.ReactNode[];
}

const Carousel = ({ slides }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const interval = 3000;
  const carouselRef = useRef<HTMLDivElement>(null);

  // 터치 스와이프를 위한 최소 거리
  const minSwipeDistance = 50;

  const prevSlide = () => {
    setCurrentIndex(
      currentIndex - 1 < 0
        ? (slides || exampleSlides).length - 1
        : currentIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex(
      currentIndex + 1 >= (slides || exampleSlides).length
        ? 0
        : currentIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const exampleSlides = [
    <div
      key={1}
      className="bg-red-500 h-full flex items-center justify-center text-white text-xl md:text-2xl"
    >
      Slide 1
    </div>,
    <div
      key={2}
      className="bg-green-500 h-full flex items-center justify-center text-white text-xl md:text-2xl"
    >
      Slide 2
    </div>,
    <div
      key={3}
      className="bg-blue-500 h-full flex items-center justify-center text-white text-xl md:text-2xl"
    >
      Slide 3
    </div>,
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, currentIndex]);

  useEffect(() => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;

    const handleMouseEnter = () => setIsPlaying(false);
    const handleMouseLeave = () => setIsPlaying(true);

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const currentSlides = slides || exampleSlides;

  return (
    <div className="relative p-4 md:p-10 pb-8 md:pb-12">
      <div
        className="overflow-hidden rounded-md relative"
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 메인 슬라이드 컨테이너 */}
        <div
          className="flex transition-transform duration-500 ease-in-out "
          style={{
            transform: `translateX(-${currentIndex * (100 / currentSlides.length)}%)`,
            width: `${currentSlides.length * 100}%`,
          }}
        >
          {currentSlides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full"
              style={{ width: `${100 / currentSlides.length}%` }}
            >
              {slide}
            </div>
          ))}
        </div>

        {/* 데스크톱 네비게이션 버튼 */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
          aria-label="이전 슬라이드"
        >
          <FaArrowLeft size={16} />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
          aria-label="다음 슬라이드"
        >
          <FaArrowRight size={16} />
        </button>

        <div className="hidden xl:block">
          {/* 이전 슬라이드 프리뷰 */}
          {currentSlides[
            currentIndex - 1 < 0 ? currentSlides.length - 1 : currentIndex - 1
          ] && (
            <div
              onClick={prevSlide}
              className="opacity-20 hover:opacity-40 absolute -left-32 2xl:-left-40 top-1/2 -translate-y-1/2 flex-shrink-0 w-28 2xl:w-32 h-32 2xl:h-40 hover:cursor-pointer transition-opacity duration-200"
            >
              {cloneElement(
                currentSlides[
                  currentIndex - 1 < 0
                    ? currentSlides.length - 1
                    : currentIndex - 1
                ] as ReactElement,
                {
                  hideTags: true,

                }
              )}
            </div>
          )}

          {/* 다음 슬라이드 프리뷰 */}
          {currentSlides[
            currentIndex + 1 >= currentSlides.length ? 0 : currentIndex + 1
          ] && (
            <div
              onClick={nextSlide}
              className="opacity-20 hover:opacity-40 absolute -right-32 2xl:-right-40 top-1/2 -translate-y-1/2 flex-shrink-0 w-28 2xl:w-32 h-32 2xl:h-40 hover:cursor-pointer transition-opacity duration-200"
            >
              {cloneElement(
                currentSlides[
                  currentIndex + 1 >= currentSlides.length
                    ? 0
                    : currentIndex + 1
                ] as ReactElement,
                {
                  hideTags: true,

                }
              )}
            </div>
          )}
        </div>

        {/* 인디케이터 */}
        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 md:space-x-2">
          {currentSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-emerald-500' : 'bg-gray-400'
              }`}
              aria-label={`슬라이드 ${index + 1}번으로 이동`}
            />
          ))}
        </div>

        {/*  첫 번째 로드시에만 잠시 표시 */}
        <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs text-center">
          ← 스와이프하여 이동 →
        </div>
      </div>

      {/* 모바일만 네비게이션 버튼   */}
      <div className="flex md:hidden justify-center space-x-4 mt-4">
        <button
          onClick={prevSlide}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full transition-colors duration-200"
          aria-label="이전 슬라이드"
        >
          <FaArrowLeft size={14} />
        </button>

        <button
          onClick={nextSlide}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full transition-colors duration-200"
          aria-label="다음 슬라이드"
        >
          <FaArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
