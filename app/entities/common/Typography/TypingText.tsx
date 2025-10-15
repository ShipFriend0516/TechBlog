import { useEffect, useState } from 'react';

interface TypingTextProps {
  title: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypingText = ({
  title,
  delay = 50,
  onComplete,
  className,
}: TypingTextProps) => {
  const [displayTitle, setDisplayTitle] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!title) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= title.length) {
        setDisplayTitle(title.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [title]);

  useEffect(() => {
    if (isTypingComplete && onComplete) {
      onComplete();
    }
  }, [isTypingComplete, onComplete]);

  return (
    <p className="typing-text">
      {displayTitle}
      {!isTypingComplete && (
        <span className="inline-block w-1 h-8 ml-1 bg-black animate-blink" />
      )}
    </p>
  );
};

export default TypingText;
