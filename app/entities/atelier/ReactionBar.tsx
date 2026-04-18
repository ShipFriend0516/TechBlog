'use client';
import Image from 'next/image';
import { useState } from 'react';
import { AtelierEmoji, ReactionBucket } from '@/app/types/Atelier';

interface ReactionBarProps {
  reactions: ReactionBucket[];
  onToggle: (emoji: AtelierEmoji) => void;
}

const ReactionBar = ({ reactions, onToggle }: ReactionBarProps) => {
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactions.map((r) => (
        <div
          key={r.emoji}
          className="relative"
          onMouseEnter={() => setHoveredEmoji(r.emoji)}
          onMouseLeave={() => setHoveredEmoji(null)}
        >
          <button
            type="button"
            onClick={() => onToggle(r.emoji as AtelierEmoji)}
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

          {hoveredEmoji === r.emoji && r.reactors && r.reactors.length > 0 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-popUp">
              <div className="bg-background border border-border rounded-xl shadow-lg px-3 py-2 flex flex-col gap-1.5 min-w-max max-w-[200px]">
                {r.reactors.map((reactor, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {reactor.avatarUrl ? (
                      <Image
                        src={reactor.avatarUrl}
                        alt={reactor.displayName}
                        width={16}
                        height={16}
                        className="rounded-full shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-border shrink-0" />
                    )}
                    <span className="text-xs text-default truncate">
                      {reactor.displayName}
                    </span>
                  </div>
                ))}
              </div>
              {/* 말풍선 꼬리 */}
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-background border-r border-b border-border rotate-45 -mt-1" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReactionBar;
