import { ReactNode, useEffect, useRef } from 'react';

interface OverlayProps {
  setOverlayOpen: (open: boolean) => void;
  children: ReactNode;
}
const Overlay = ({ setOverlayOpen, children }: OverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && overlayRef.current === (event.target as Node)) {
        setOverlayOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="container bg-overlay bg-opacity-90 text-overlay rounded-lg mx-auto mt-[24%] max-w-2xl">
        {children}
      </div>
    </div>
  );
};

export default Overlay;
