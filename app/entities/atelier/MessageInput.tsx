'use client';
import { KeyboardEvent, useRef, useState } from 'react';

const GUEST_MAX_LENGTH = 200;

interface MessageInputProps {
  onSend: (content: string) => void | boolean | Promise<void | boolean>;
  placeholder?: string;
  disabled?: boolean;
  isAdmin?: boolean;
}

// 하단 입력 바 — IME 조합 중엔 전송 안함, Enter 전송, Shift+Enter 줄바꿈
const MessageInput = ({
  onSend,
  placeholder,
  disabled = false,
  isAdmin = false,
}: MessageInputProps) => {
  const maxLength = isAdmin ? undefined : GUEST_MAX_LENGTH;
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const isComposing = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = () => {
    isComposing.current = false;
  };

  const isOverLimit = maxLength !== undefined && input.length > maxLength;

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || disabled || isSending || isOverLimit) return;
    setIsSending(true);
    try {
      const result = await onSend(trimmed);
      if (result === false) return;
      setInput('');
      textareaRef.current?.focus();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing.current) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClickSend = () => {
    handleSend();
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-stretch">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 resize-none rounded-xl border border-border bg-transparent p-3 text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-50"
          rows={2}
          placeholder={placeholder ?? '생각을 던져보세요... (Enter)'}
        />
        <button
          type="button"
          onClick={handleClickSend}
          disabled={!input.trim() || disabled || isSending || isOverLimit}
          className="px-4 rounded-xl bg-brand-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-opacity"
        >
          {isSending ? (
            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            '전송'
          )}
        </button>
      </div>
      {maxLength !== undefined && input.length > 0 && (
        <p className={`text-xs text-right pr-1 ${isOverLimit ? 'text-red-500' : 'text-weak'}`}>
          {input.length} / {maxLength}
        </p>
      )}
    </div>
  );
};

export default MessageInput;
