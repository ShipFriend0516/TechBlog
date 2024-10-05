'use client';
import { useState } from 'react';

interface Props {
  className: string;
  defaultText: string;
  hoverText: string;
}
const HoverButton = ({ className, defaultText, hoverText }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <span className={'text-lg'}>{hoverText}</span>
      ) : (
        <span className={'text-2xl'}>{defaultText}</span>
      )}
    </button>
  );
};

export default HoverButton;
