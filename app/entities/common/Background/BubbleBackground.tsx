'use client';

const bubbles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: Math.random() * 100 + 200,
  left: Math.random() * 100,
  delay: Math.random() * 0.8,
}));

const BubbleBackground = () => {

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`
            absolute rounded-full 
            opacity-40 
            bg-gradient-to-br from-white/50 to-transparent 
            backdrop-blur-sm
            animate-float
          `}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: '-20%',
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground;
