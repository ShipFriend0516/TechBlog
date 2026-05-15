'use client';

const chars = ['🌸', '🌺', '✿', '❀'];
const colors = ['text-pink-300', 'text-pink-400', 'text-rose-400'];
const particles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  char: chars[i % chars.length],
  px: Math.random() * 60 - 30,
  py: Math.random() * 30 - 40,
  pr: Math.random() * 360 - 180,
  delay: Math.random() * 0.6,
  duration: Math.random() * 0.6 + 0.8,
  color: colors[i % 3],
}));

const FlowerOverlay = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative animate-flowerGlow rounded-2xl">
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {particles.map((p) => (
          <div
            key={p.id}
            style={
              {
                '--px': `${p.px}px`,
                '--py': `${p.py}px`,
                '--pr': `${p.pr}deg`,
                '--delay': `${p.delay}s`,
                '--pd': `${p.duration}s`,
              } as React.CSSProperties
            }
            className={`absolute animate-petalFloat ${p.color} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold`}
          >
            {p.char}
          </div>
        ))}
      </div>
    </div>
  );
};
export default FlowerOverlay;
