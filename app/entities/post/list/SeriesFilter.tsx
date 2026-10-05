'use client';

import { useEffect, useRef, useState } from 'react';
import { FiBookOpen, FiCheck, FiChevronDown, FiSearch } from 'react-icons/fi';
import { Series } from '@/app/types/Series';

interface SeriesFilterProps {
  series: Series[];
  selected: string;
  onSelect: (slug: string) => void;
}

// 시리즈가 이 개수를 넘으면 목록 내 검색창 노출
const SEARCHABLE_THRESHOLD = 6;

const SeriesFilter = ({ series, selected, onSelect }: SeriesFilterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  const selectedSeries = series.find((s) => s.slug === selected);
  const filtered = keyword
    ? series.filter((s) =>
        s.title.toLowerCase().includes(keyword.trim().toLowerCase())
      )
    : series;

  // 바깥 클릭 · ESC로 닫기
  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const toggle = () => {
    setOpen((prev) => !prev);
    setKeyword('');
  };

  const select = (slug: string) => {
    setOpen(false);
    if (slug !== selected) onSelect(slug);
  };

  const itemClass = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
      active ? 'bg-accent-subtle text-accent-strong' : 'text-fg-soft hover:bg-raised hover:text-fg'
    }`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-12 w-full sm:w-56 items-center gap-2 rounded-xl px-4 text-sm transition-colors ${
          selectedSeries
            ? 'bg-accent-subtle text-accent-strong'
            : 'bg-raised text-fg-soft hover:text-fg'
        }`}
      >
        <FiBookOpen size={16} className="flex-shrink-0" />
        <span className="flex-1 truncate text-left">
          {selectedSeries ? selectedSeries.title : '모든 시리즈'}
        </span>
        <FiChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-30 w-full sm:w-80 rounded-xl border border-hairline bg-overlay p-2 shadow-xl animate-popUp">
          {series.length > SEARCHABLE_THRESHOLD && (
            <div className="relative mb-2">
              <FiSearch
                aria-hidden
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none"
              />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="시리즈 찾기"
                aria-label="시리즈 찾기"
                autoFocus
                className="w-full h-9 rounded-lg bg-raised pl-8 pr-3 text-sm text-fg placeholder:text-fg-faint outline-none focus:ring-2 focus:ring-accent-strong"
              />
            </div>
          )}

          <ul role="listbox" aria-label="시리즈 선택" className="max-h-80 overflow-y-auto">
            {!keyword && (
              <li role="option" aria-selected={!selected}>
                <button type="button" onClick={() => select('')} className={itemClass(!selected)}>
                  <span className="flex-1 text-sm font-medium">모든 시리즈</span>
                  {!selected && <FiCheck size={16} className="flex-shrink-0" />}
                </button>
              </li>
            )}
            {filtered.map((s) => {
              const active = s.slug === selected;
              return (
                <li key={s.slug} role="option" aria-selected={active}>
                  <button type="button" onClick={() => select(s.slug)} className={itemClass(active)}>
                    <span className="flex-1 min-w-0">
                      <span className="block truncate text-sm font-medium">{s.title}</span>
                      <span className={`block text-xs ${active ? 'text-accent-strong/80' : 'text-fg-muted'}`}>
                        {s.posts.length}개의 글
                      </span>
                    </span>
                    {active && <FiCheck size={16} className="flex-shrink-0" />}
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-fg-muted">
                {series.length === 0 ? '시리즈가 없습니다.' : '일치하는 시리즈가 없습니다.'}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SeriesFilter;
