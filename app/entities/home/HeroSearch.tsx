'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const HeroSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/posts?query=${encodeURIComponent(trimmed)}` : '/posts'
    );
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full max-w-md">
      <FiSearch
        aria-hidden
        className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted"
        size={18}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="어떤 글을 찾고 있나요?"
        aria-label="글 검색"
        className="input-field w-full pl-11 pr-4 py-3.5"
      />
    </form>
  );
};

export default HeroSearch;
