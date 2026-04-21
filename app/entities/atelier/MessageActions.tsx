'use client';
import { useState } from 'react';
import { ATELIER_EMOJIS, AtelierEmoji, AtelierMessage } from '@/app/types/Atelier';

interface MessageActionsProps {
  message: AtelierMessage;
  isAdmin: boolean;
  isMine: boolean;
  onReact: (emoji: AtelierEmoji) => void;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublic: () => void;
  onBlock: () => void;
  onPickerChange?: (open: boolean) => void;
}

const MessageActions = ({
  message,
  isAdmin,
  isMine,
  onReact,
  onReply,
  onEdit,
  onDelete,
  onTogglePublic,
  onBlock,
  onPickerChange,
}: MessageActionsProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = () => {
    setIsPickerOpen(true);
    onPickerChange?.(true);
  };

  const closePicker = () => {
    setIsPickerOpen(false);
    onPickerChange?.(false);
  };

  const handleSelectEmoji = (emoji: AtelierEmoji) => {
    onReact(emoji);
    closePicker();
  };

  return (
    <div className="relative inline-flex items-center gap-1 whitespace-nowrap bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-border rounded-full px-2 py-1 shadow-sm">
      {isPickerOpen ? (
        <>
          {ATELIER_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleSelectEmoji(emoji)}
              className="text-lg leading-none px-1.5 py-0.5 rounded-full hover:bg-brand-primary/10 transition-colors"
              aria-label={`${emoji} 반응 추가`}
            >
              {emoji}
            </button>
          ))}
          <button
            type="button"
            onClick={closePicker}
            className="text-xs text-weak hover:text-foreground transition-colors px-1.5 py-0.5 rounded ml-0.5"
            aria-label="닫기"
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={openPicker}
            className="text-xs text-weak hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded"
            aria-label="반응 추가"
          >
            😊
          </button>
          <button
            type="button"
            onClick={onReply}
            className="text-xs text-weak hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded"
          >
            답글
          </button>

          {isMine && (
            <button
              type="button"
              onClick={onEdit}
              className="text-xs text-weak hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded"
            >
              수정
            </button>
          )}

          {(isAdmin || isMine) && (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs text-weak hover:text-red-500 transition-colors px-1.5 py-0.5 rounded"
            >
              삭제
            </button>
          )}

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={onTogglePublic}
                className="text-xs text-weak hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded"
              >
                {message.isPublic ? '비공개' : '공개'}
              </button>
              {(message.author.fingerprint || message.author.githubId) && (
                <button
                  type="button"
                  onClick={onBlock}
                  className="text-xs text-weak hover:text-red-500 transition-colors px-1.5 py-0.5 rounded"
                >
                  차단
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MessageActions;
