'use client';
import { useMemo } from 'react';

export default function FlowerOverlay({ children }: { children: React.ReactNode }) {
  const particles = useMemo(() => {
    const chars = ['🌸', '🌺', '✿', '❀'];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      char: chars[i % chars.length],
      // 각 파티클별 랜덤 값 (마운트 시 1회 고정)
      px: Math.random() * 60 - 30,      // -30px ~ 30px
      py: Math.random() * 30 - 40,      // -40px ~ -10px (위로 떠오름)
      pr: Math.random() * 360 - 180,    // -180deg ~ 180deg
      delay: Math.random() * 0.6,       // 0 ~ 0.6s
      duration: Math.random() * 0.6 + 0.8, // 0.8s ~ 1.4s
      color: ['text-pink-300', 'text-pink-400', 'text-rose-400'][i % 3],
    }));
  }, []);

  return (
    <div className="relative animate-flowerGlow rounded-2xl">
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              '--px': `${p.px}px`,
              '--py': `${p.py}px`,
              '--pr': `${p.pr}deg`,
              '--delay': `${p.delay}s`,
              '--pd': `${p.duration}s`,
            } as React.CSSProperties}
            className={`absolute animate-petalFloat ${p.color} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold`}
          >
            {p.char}
          </div>
        ))}
      </div>
    </div>
  );
}
