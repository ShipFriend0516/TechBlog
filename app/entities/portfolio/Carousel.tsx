'use client';

import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface CarouselProps {
  slides: React.ReactNode[];
}

const Carousel = ({ slides }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const interval = 3000;
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
  const exampleSlides = [
    <div key={1} className="bg-red-500 h-full">
      Slide 1
    </div>,
    <div key={2} className="bg-green-500 h-full">
      Slide 2
    </div>,
    <div key={3} className="bg-blue-500 h-full">
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

  return (
    <div className={'relative p-10 pb-12'}>
      <div className={'overflow-hidden'}>
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * (100 / (slides || exampleSlides).length)}%)`,
            width: `${(slides || exampleSlides).length * 100}%`,
          }}
        >
          {(slides || exampleSlides).map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full"
              style={{ width: `${100 / (slides || exampleSlides).length}%` }}
            >
              {slide}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => prevSlide()}
          className="absolute -left-20 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-4 text-black hover:bg-neutral-300"
          aria-label="Previous slide"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={() => nextSlide()}
          className="absolute -right-20 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-4 text-black hover:bg-neutral-300"
          aria-label="Next slide"
        >
          <FaArrowRight />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {(slides || exampleSlides).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-emerald-500' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
