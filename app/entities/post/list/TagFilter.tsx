'use client';

import Link from 'next/link';
import { FiArrowRight, FiHash } from 'react-icons/fi';
import DragScroll from '@/app/entities/common/DragScroll';
import { TagData } from '@/app/types/Tag';

interface TagFilterProps {
  tags: TagData[];
  selected: string;
  onSelect: (tag: string) => void;
}

const TagFilter = ({ tags, selected, onSelect }: TagFilterProps) => {
  // 선택된 태그가 인기 태그 목록 밖이면 맨 앞에 노출
  const visibleTags =
    selected && !tags.some((t) => t.tag === selected)
      ? [{ tag: selected, count: 0 }, ...tags]
      : tags;

  if (visibleTags.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 min-w-0">
        <DragScroll
          aria-label="태그 필터"
          className="flex gap-2 overflow-x-auto py-1 pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)]"
        >
          {visibleTags.map(({ tag, count }) => {
            const active = tag === selected;
            return (
              <li key={tag} className="flex-shrink-0">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(active ? '' : tag)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? 'bg-accent text-on-accent'
                      : 'bg-raised text-fg-soft hover:text-fg hover:bg-accent-subtle'
                  }`}
                >
                  <FiHash size={12} aria-hidden className="opacity-70" />
                  {tag}
                  {count > 0 && (
                    <span className={`text-xs ${active ? 'opacity-80' : 'text-fg-faint'}`}>
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </DragScroll>
      </div>
      <Link
        href="/tags"
        className="hidden sm:inline-flex flex-shrink-0 items-center gap-1 text-sm text-fg-muted hover:text-accent transition-colors"
      >
        모든 태그
        <FiArrowRight size={14} aria-hidden />
      </Link>
    </div>
  );
};

export default TagFilter;
