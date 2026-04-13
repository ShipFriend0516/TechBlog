'use client';
import { KeyboardEvent, useRef, useState } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

// 하단 입력 바 — IME 조합 중엔 전송 안함, Cmd/Ctrl+Enter 전송
const MessageInput = ({
  onSend,
  placeholder,
  disabled = false,
}: MessageInputProps) => {
  const [input, setInput] = useState('');
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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    await onSend(trimmed);
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isComposing.current) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClickSend = () => {
    handleSend();
  };

  return (
    <div className="flex gap-2 items-end">
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
        placeholder={placeholder ?? '생각을 던져보세요... (⌘+Enter)'}
      />
      <button
        type="button"
        onClick={handleClickSend}
        disabled={!input.trim() || disabled}
        className="px-4 py-3 rounded-xl bg-brand-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-opacity"
      >
        전송
      </button>
    </div>
  );
};

export default MessageInput;
