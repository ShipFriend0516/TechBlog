'use client';
import { useMemo } from 'react';

export default function SparkleOverlay({ children }: { children: React.ReactNode }) {
  const particles = useMemo(() => {
    const chars = ['★', '✦', '✧', '·'];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      char: chars[i % chars.length],
      sx: Math.random() * 60 - 30,
      sy: Math.random() * 30 - 40,
      sr: Math.random() * 360 - 180,
      delay: Math.random() * 0.6,
      duration: Math.random() * 0.6 + 0.8,
      color: ['text-amber-300', 'text-amber-400', 'text-amber-500'][i % 3],
    }));
  }, []);

  return (
    <div className="relative animate-starGlow rounded-2xl">
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              '--sx': `${p.sx}px`,
              '--sy': `${p.sy}px`,
              '--sr': `${p.sr}deg`,
              '--delay': `${p.delay}s`,
              '--sd': `${p.duration}s`,
            } as React.CSSProperties}
            className={`absolute animate-sparkleFloat text-lg font-bold ${p.color} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            {p.char}
          </div>
        ))}
      </div>
    </div>
  );
}
