'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import EmojiPicker from '@/app/entities/atelier/EmojiPicker';
import { AtelierEmoji, AtelierMessage } from '@/app/types/Atelier';

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
}

// 메시지 버블 호버/롱프레스 시 노출되는 액션 바
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
}: MessageActionsProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isPickerOpen || !emojiButtonRef.current) return;
    const rect = emojiButtonRef.current.getBoundingClientRect();
    setPickerPos({ top: rect.top - 8, left: rect.left });
  }, [isPickerOpen]);

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

  const handleEdit = () => {
    onEdit();
  };

  return (
    <div className="relative inline-flex items-center gap-1 whitespace-nowrap bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-border rounded-full px-2 py-1 shadow-sm">
      {isPickerOpen && createPortal(
        <div
          className="fixed z-[100]"
          style={{ top: pickerPos.top, left: pickerPos.left, transform: 'translateY(-100%)' }}
        >
          <EmojiPicker onSelect={handleSelectEmoji} onClose={handleClosePicker} />
        </div>,
        document.body
      )}

      <button
        ref={emojiButtonRef}
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

      {isMine && (
        <button
          type="button"
          onClick={handleEdit}
          className="text-xs text-weak hover:text-brand-primary transition-colors px-1.5 py-0.5 rounded"
        >
          수정
        </button>
      )}

      {(isAdmin || isMine) && (
        <button
          type="button"
          onClick={handleDelete}
          className="text-xs text-weak hover:text-red-500 transition-colors px-1.5 py-0.5 rounded"
        >
          삭제
        </button>
      )}

      {isAdmin && (
        <>
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
