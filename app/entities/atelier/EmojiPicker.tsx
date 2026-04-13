'use client';
import { ATELIER_EMOJIS, AtelierEmoji } from '@/app/types/Atelier';

interface EmojiPickerProps {
  onSelect: (emoji: AtelierEmoji) => void;
  onClose?: () => void;
}

// 6개 이모지 팝오버 — 선택 시 onSelect 호출하고 스스로 닫힌다
const EmojiPicker = ({ onSelect, onClose }: EmojiPickerProps) => {
  const handleSelect = (emoji: AtelierEmoji) => {
    onSelect(emoji);
    onClose?.();
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-2 py-1 shadow-md">
      {ATELIER_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => handleSelect(emoji)}
          className="text-lg leading-none px-1.5 py-0.5 rounded-full hover:bg-brand-primary/10 transition-colors"
          aria-label={`${emoji} 반응 추가`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
