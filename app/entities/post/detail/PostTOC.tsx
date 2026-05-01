'use client';
import { useEffect, useRef, useState } from 'react';

/* ── Types ────────────────────────────────────────────── */
interface Heading {
  id: string;
  type: number; // 1 = h1, 2 = h2, 3 = h3
  title: string;
}

/* ── Helpers ──────────────────────────────────────────── */
function parseHeadings(content: string): Heading[] {
  const matches = content.match(/^#{1,6} .+/gm) ?? [];
  return matches.map((heading) => {
    const level = heading.match(/^#+/)?.[0].length ?? 1;
    const title = heading.replace(/^#+\s+/, '').trim();
    const id = title
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/[^a-zA-Z0-9가-힣]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return { id, type: level, title };
  });
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/* ── Mobile Slide-up Panel ────────────────────────────── */
function MobilePanel({
  headings,
  activeId,
  progressPct,
  isOpen,
  onClose,
}: {
  headings: Heading[];
  activeId: string;
  progressPct: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 md:hidden
          bg-white dark:bg-neutral-900
          border-t border-border dark:border-neutral-800
          rounded-t-2xl shadow-2xl
          transition-transform duration-300 ease-out
          max-h-[60vh] flex flex-col
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </div>

        {/* Progress bar */}
        <div className="h-0.5 mx-4 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden shrink-0">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #03624c, #2cc295)',
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <ForestIcon />
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              목차
            </span>
          </div>
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: '#03624c' }}
          >
            {progressPct}%
          </span>
        </div>

        {/* List */}
        <ul className="overflow-y-auto px-2 pb-6">
          {headings.map((h, idx) => (
            <TOCItem
              key={h.id}
              heading={h}
              isActive={h.id === activeId}
              isPast={isPastItem(headings, activeId, idx)}
              onClick={() => {
                scrollToHeading(h.id);
                onClose();
              }}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

/* ── Icons ────────────────────────────────────────────── */
function ForestIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#03624c"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14l-5-9-5 9h10z" />
      <path d="M20 19l-3-5-3 5h6z" />
      <path d="M7 19l-3-5-3 5h6z" />
      <line x1="12" y1="14" x2="12" y2="22" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── TOC Item ─────────────────────────────────────────── */
function isPastItem(headings: Heading[], activeId: string, idx: number) {
  const activeIdx = headings.findIndex((h) => h.id === activeId);
  return idx < activeIdx;
}

function TOCItem({
  heading,
  isActive,
  isPast,
  onClick,
}: {
  heading: Heading;
  isActive: boolean;
  isPast: boolean;
  onClick: () => void;
}) {
  const indent = (heading.type - 1) * 12;

  return (
    <li style={{ paddingLeft: indent }}>
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-2.5 px-2 py-[5px] rounded-md text-left
          text-[12.5px] leading-snug whitespace-nowrap overflow-hidden text-ellipsis
          transition-all duration-150 group relative 
          ${
            isActive
              ? 'font-semibold'
              : isPast
                ? 'text-neutral-500 dark:text-neutral-400'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }
        `}
        style={isActive ? { color: '#03624c' } : {}}
      >
        {/* Rail dot */}
        <span
          className="shrink-0 rounded-full border-2 border-white dark:border-neutral-900 relative z-10 transition-all duration-200"
          style={{
            width: isActive ? 10 : heading.type === 1 ? 8 : 7,
            height: isActive ? 10 : heading.type === 1 ? 8 : 7,
            background: isActive
              ? '#03624c'
              : isPast
                ? '#03624c'
                : 'var(--rail, #d1d5db)',
            opacity: isPast && !isActive ? 0.45 : 1,
            boxShadow: isActive ? '0 0 0 3px rgba(3,98,76,0.15)' : 'none',
          }}
        />

        {/* Title */}
        <span className="ml-1 truncate">{heading.title}</span>

        {/* Active indicator dot (right side) */}
        {isActive && (
          <span
            className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full"
            style={{ background: '#03624c' }}
          />
        )}
      </button>
    </li>
  );
}

/* ── Main Component ───────────────────────────────────── */
const PostTOC = ({ postContent }: { postContent: string }) => {
  const [activeId, setActiveId] = useState('');
  const [progressPct, setProgressPct] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTocVisible, setIsTocVisible] = useState(false);
  const railFillRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const headings = parseHeadings(postContent);

  /* ── Scroll spy (IntersectionObserver) ─────────────── */
  useEffect(() => {
    if (headings.length === 0) return;

    // Heading elements in the post body
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    // Page reading progress
    const updateProgress = () => {
      const postBody = document.querySelector<HTMLElement>('.post-body');
      if (!postBody) return;
      const { top, height } = postBody.getBoundingClientRect();
      const visible = Math.min(window.innerHeight - top, height);
      const pct = Math.round(
        Math.max(0, Math.min(100, (visible / height) * 100))
      );
      setProgressPct(pct);
    };

    // Active heading — use IntersectionObserver with a sentinel zone
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    els.forEach((el) => observer.observe(el));

    // Fallback scroll for progress + when observer misses bottom sections
    const onScroll = () => {
      updateProgress();
      setIsTocVisible(window.scrollY > 292);
      // If scrolled past all headings, activate last
      const scrollY = window.scrollY + 120;
      for (let i = els.length - 1; i >= 0; i--) {
        if (els[i].offsetTop <= scrollY) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [postContent]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Rail fill height (animate on active change) ────── */
  useEffect(() => {
    if (!railFillRef.current || !listRef.current) return;
    const activeIdx = headings.findIndex((h) => h.id === activeId);
    if (activeIdx < 0) return;
    const items =
      listRef.current.querySelectorAll<HTMLElement>('[data-rail-item]');
    if (!items.length) return;
    let totalHeight = 0;
    for (let i = 0; i < activeIdx; i++) {
      totalHeight += items[i]?.offsetHeight ?? 0;
    }
    railFillRef.current.style.height = `${totalHeight}px`;
  }, [activeId, headings]);

  if (headings.length === 0) return null;

  const activeIdx = headings.findIndex((h) => h.id === activeId);

  return (
    <>
      {/* ── Mobile FAB ─────────────────────────────────── */}
      <button
        className="fixed bottom-5 right-5 md:hidden z-30 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full shadow-xl text-white text-sm font-semibold transition-all duration-200 active:scale-95"
        style={{ background: '#03624c' }}
        onClick={() => setIsMobileOpen(true)}
        aria-label="목차 열기"
      >
        <BookIcon />
        목차
      </button>

      {/* ── Mobile Panel ───────────────────────────────── */}
      <MobilePanel
        headings={headings}
        activeId={activeId}
        progressPct={progressPct}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* ── Desktop Sidebar ────────────────────────────── */}
      <div
        className={`
          post-toc hidden 2xl:block
          fixed top-24 right-8 w-[260px] max-h-[calc(100vh-6rem)]
          overflow-y-auto overflow-x-hidden
          text-sm z-10 select-none
          transition-all duration-300 ease-out
          ${isTocVisible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}
        `}
      >
        <div
          className="
            bg-white/85 dark:bg-neutral-800/85
            backdrop-blur-md
            border border-black/[0.06] dark:border-white/[0.07]
            rounded-xl shadow-sm
            overflow-hidden
          "
        >
          {/* Top progress bar */}
          <div className="h-[3px] bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-r-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg,#03624c,#2cc295)',
              }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-700/60">
            <div className="flex items-center gap-2">
              <ForestIcon />
              <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                목차
              </span>
            </div>
            <span
              className="text-[11px] font-bold tabular-nums transition-all duration-300"
              style={{ color: '#03624c' }}
            >
              {progressPct}%
            </span>
          </div>

          {/* List with vertical rail */}
          <div className="relative py-2">
            {/* Rail background line */}
            <div
              className="absolute left-[26px] top-3 bottom-3 w-[1.5px] rounded-full bg-neutral-200 dark:bg-neutral-700"
              aria-hidden
            />
            {/* Rail fill (done portion) */}
            <div
              ref={railFillRef}
              className="absolute left-[26px] top-3 w-[1.5px] rounded-full transition-all duration-400 ease-out"
              style={{
                background: 'linear-gradient(180deg,#03624c,#2cc295)',
                height: 0,
              }}
              aria-hidden
            />

            <ul ref={listRef} className="relative list-none">
              {headings.map((h, idx) => (
                <li key={h.id} data-rail-item>
                  <TOCItem
                    heading={h}
                    isActive={h.id === activeId}
                    isPast={idx < activeIdx}
                    onClick={() => scrollToHeading(h.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostTOC;
