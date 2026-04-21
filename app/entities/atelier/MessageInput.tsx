'use client';
import { KeyboardEvent, useRef, useState } from 'react';
import { EFFECT_REGISTRY, AtelierEffect } from '@/app/lib/atelierEffects';
import MarkdownPreview from '@uiw/react-markdown-preview';

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
  const [isPreviewing, setIsPreviewing] = useState(false);
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
  const detectedEffect: AtelierEffect | null = (() => {
    const trimmed = input.trimStart();
    for (const [key, cfg] of Object.entries(EFFECT_REGISTRY) as [AtelierEffect, typeof EFFECT_REGISTRY[AtelierEffect]][]) {
      if (trimmed.startsWith(cfg.command + ' ') && trimmed.length > cfg.command.length + 1) {
        return key;
      }
    }
    return null;
  })();

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || disabled || isSending || isOverLimit) return;
    setIsSending(true);
    try {
      const result = await onSend(trimmed);
      if (result === false) return;
      setInput('');
      setIsPreviewing(false);
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

  const handleTabClick = (preview: boolean) => {
    setIsPreviewing(preview);
    if (!preview) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {/* 탭 */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => handleTabClick(false)}
          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
            !isPreviewing
              ? 'bg-brand-primary text-white'
              : 'text-weak hover:text-foreground'
          }`}
        >
          작성
        </button>
        <button
          type="button"
          onClick={() => handleTabClick(true)}
          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
            isPreviewing
              ? 'bg-brand-primary text-white'
              : 'text-weak hover:text-foreground'
          }`}
        >
          미리보기
        </button>
      </div>

      {/* 이펙트 커맨드 힌트 */}
      <div className="h-5 flex items-center">
        {detectedEffect && (
          <p className={`text-xs ${EFFECT_REGISTRY[detectedEffect].hintColor} px-1 flex items-center gap-1`}>
            <span>{EFFECT_REGISTRY[detectedEffect].hintIcon}</span>
            {EFFECT_REGISTRY[detectedEffect].hintText}
          </p>
        )}
      </div>

      {/* 입력 영역 + 전송 버튼 */}
      <div className="flex gap-2 items-stretch">
        {isPreviewing ? (
          <div className="flex-1 min-h-[4.75rem] rounded-xl border border-border p-3 text-sm overflow-y-auto">
            {input.trim() ? (
              <MarkdownPreview
                source={input}
                style={{ background: 'transparent', color: 'inherit', fontSize: 'inherit' }}
                wrapperElement={{ 'data-color-mode': isAdmin ? 'dark' : 'light' }}
              />
            ) : (
              <span className="text-weak">내용이 없어요</span>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`flex-1 resize-none rounded-xl border bg-transparent p-3 text-sm outline-none focus:ring-1 transition-all disabled:opacity-50 ${
              isOverLimit
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border focus:ring-brand-primary'
            }`}
            rows={2}
            placeholder={placeholder ?? '생각을 던져보세요... (Enter)'}
          />
        )}
        <button
          type="button"
          onClick={handleSend}
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
    </div>
  );
};

export default MessageInput;
