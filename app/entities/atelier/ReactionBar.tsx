'use client';
import { AtelierEmoji, ReactionBucket } from '@/app/types/Atelier';

interface ReactionBarProps {
  reactions: ReactionBucket[];
  onToggle: (emoji: AtelierEmoji) => void;
}

// 메시지 아래에 표시되는 반응 칩들
const ReactionBar = ({ reactions, onToggle }: ReactionBarProps) => {
  if (!reactions || reactions.length === 0) return null;

  const handleClick = (emoji: string) => {
    onToggle(emoji as AtelierEmoji);
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          onClick={() => handleClick(r.emoji)}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${
            r.hasReacted
              ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
              : 'border-border text-weak hover:border-brand-primary'
          }`}
          aria-label={`${r.emoji} ${r.count}개 반응`}
        >
          <span className="text-sm leading-none">{r.emoji}</span>
          <span className="tabular-nums">{r.count}</span>
        </button>
      ))}
    </div>
  );
};

export default ReactionBar;
