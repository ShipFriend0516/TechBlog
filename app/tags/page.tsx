'use client';

import { useEffect, useState } from 'react';
import SVGLoadingSpinner from '@/app/entities/common/Loading/SVGLoadingSpinner';
import TagCloud from '@/app/entities/tag/TagCloud';
import { TagData } from '@/app/types/Tag';

const TagsPage = () => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) {
          throw new Error('태그 목록을 불러오는데 실패했습니다');
        }
        const data = await response.json();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
        console.error('Failed to fetch tags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <section className="w-full p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mt-4 text-center">태그</h1>
      <p className="text-base sm:text-lg text-weak mb-6 sm:mb-8 text-center">
        블로그에서 사용된 태그들을 빠르게 탐색할 수 있습니다.
      </p>

      <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] relative">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <SVGLoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <p className="text-semantic-error text-lg mb-4">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-primary-mountain transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : tags.length === 0 ? (
          <div className="flex justify-center items-center h-full text-weak">
            <p className="text-lg">아직 태그가 없습니다</p>
          </div>
        ) : (
          <TagCloud tags={tags} />
        )}
      </div>
    </section>
  );
};

export default TagsPage;
