'use client';
import { useState } from 'react';
import EmojiPicker from '@/app/entities/atelier/EmojiPicker';
import { AtelierEmoji, AtelierMessage } from '@/app/types/Atelier';

interface MessageActionsProps {
  message: AtelierMessage;
  isAdmin: boolean;
  onReact: (emoji: AtelierEmoji) => void;
  onReply: () => void;
  onDelete: () => void;
  onTogglePublic: () => void;
  onBlock: () => void;
}

// 메시지 버블 호버/롱프레스 시 노출되는 액션 바
const MessageActions = ({
  message,
  isAdmin,
  onReact,
  onReply,
  onDelete,
  onTogglePublic,
  onBlock,
}: MessageActionsProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleToggleReact = () => {
    setIsPickerOpen((prev) => !prev);
  };

  const handleSelectEmoji = (emoji: AtelierEmoji) => {
    onReact(emoji);
  };

  const handleClosePicker = () => {
    setIsPickerOpen(false);
  };

  const handleReply = () => {
    onReply();
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleTogglePublic = () => {
    onTogglePublic();
  };

  const handleBlock = () => {
    onBlock();
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      {isPickerOpen && (
        <div className="absolute bottom-full mb-2 left-0 z-10">
          <EmojiPicker onSelect={handleSelectEmoji} onClose={handleClosePicker} />
        </div>
      )}

      <button
        type="button"
        onClick={handleToggleReact}
        className="text-xs text-weak hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded"
        aria-label="반응 추가"
      >
        😊
      </button>
      <button
        type="button"
        onClick={handleReply}
        className="text-xs text-weak hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded"
      >
        답글
      </button>

      {isAdmin && (
        <>
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-weak hover:text-red-500 transition-colors px-1.5 py-0.5 rounded"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={handleTogglePublic}
            className="text-xs text-weak hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded"
          >
            {message.isPublic ? '비공개' : '공개'}
          </button>
          {message.author.fingerprint && (
            <button
              type="button"
              onClick={handleBlock}
              className="text-xs text-weak hover:text-red-500 transition-colors px-1.5 py-0.5 rounded"
            >
              차단
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MessageActions;
