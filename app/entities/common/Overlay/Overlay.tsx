import { ReactNode, useEffect, useRef } from 'react';

interface OverlayProps {
  overlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
  children: ReactNode;
}
const Overlay = ({
  overlayOpen = false,
  setOverlayOpen,
  children,
}: OverlayProps) => {
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
    overlayOpen && (
      <div
        ref={overlayRef}
        className="fixed flex justify-center items-center w-screen h-screen top-0 left-0 inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="animate-popUp  container bg-opacity-90 text-overlay rounded-lg mx-auto max-w-2xl">
          {children}
        </div>
      </div>
    )
  );
};

export default Overlay;
