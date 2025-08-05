import { useState } from 'react';

const useOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    setIsOpen,
  };
};

export default useOverlay;
