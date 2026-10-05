'use client';

import { useEffect, useRef, useState } from 'react';
import { FiClock, FiSearch, FiX } from 'react-icons/fi';
import useSearchQueryStore from '@/app/stores/useSearchQueryStore';

interface PostSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

// 입력 중인 요소에서는 단축키를 가로채지 않음
const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
};

const PostSearchInput = ({ value, onChange }: PostSearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const latest = useSearchQueryStore((state) => state.latestSearchQueries);

  // '/' 키로 검색창 포커스
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || isTypingTarget(e.target)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showRecent = focused && !value && latest.length > 0;

  return (
    <div className="relative flex-1 min-w-0">
      <FiSearch
        aria-hidden
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key !== 'Escape') return;
          if (value) onChange('');
          else inputRef.current?.blur();
        }}
        placeholder="제목, 부제목, 본문으로 검색"
        aria-label="글 검색"
        className="w-full h-12 rounded-xl bg-raised pl-11 pr-12 text-sm text-fg placeholder:text-fg-faint outline-none transition-shadow duration-150 ease-out-expo focus:ring-2 focus:ring-accent-strong"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface transition-colors"
          aria-label="검색어 지우기"
        >
          <FiX size={16} />
        </button>
      ) : (
        <kbd
          aria-hidden
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-6 min-w-6 items-center justify-center rounded-md border border-hairline bg-surface px-1.5 text-xs text-fg-muted font-sans"
        >
          /
        </kbd>
      )}

      {showRecent && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl border border-hairline bg-overlay p-2 shadow-xl animate-popUp">
          <p className="px-2 pt-1 pb-2 text-xs text-fg-muted">최근 검색어</p>
          <ul>
            {latest.map((recent) => (
              <li key={recent}>
                <button
                  type="button"
                  // blur보다 먼저 실행되도록 mousedown에서 처리
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(recent);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-fg-soft hover:bg-raised hover:text-fg transition-colors"
                >
                  <FiClock size={14} className="flex-shrink-0 text-fg-faint" />
                  <span className="truncate">{recent}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostSearchInput;
