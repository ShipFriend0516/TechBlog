import { FaSearch } from 'react-icons/fa';
import { ReactNode } from 'react';

interface OverlayProps {
  setSearchOpen: (open: boolean) => void;
  children: ReactNode;
}
const Overlay = ({ setSearchOpen, children }: OverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="container bg-overlay bg-opacity-90 text-overlay rounded-lg mx-auto mt-[24%] max-w-2xl">
        {children}
      </div>
    </div>
  );
};

export default Overlay;
