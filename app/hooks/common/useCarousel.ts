import { useState } from 'react';

interface useCarouselProps {
  itemsLength: number;
}

const useCarousel = ({ itemsLength }: useCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? itemsLength - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === itemsLength - 1 ? 0 : prevIndex + 1
    );
  };

  const selectThumbnail = (index: number) => {
    setCurrentImageIndex(index);
  };

  return {
    currentImageIndex,
    handlePreviousImage,
    handleNextImage,
    selectThumbnail,
  };
};

export default useCarousel;
