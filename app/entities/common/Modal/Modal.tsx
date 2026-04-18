'use client';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

const Modal = ({ onClose, children, className = '' }: ModalProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`animate-popUp bg-background border border-border rounded-2xl shadow-xl w-full max-w-sm mx-4 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
