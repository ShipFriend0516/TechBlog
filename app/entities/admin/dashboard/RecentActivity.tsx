'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatDate } from '@/app/lib/utils/format';

interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  date: number;
  createdAt: string;
}

const RecentActivity = () => {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/posts/recent');
        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        } else {
          setError(data.error || '최근 게시글을 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('최근 게시글을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="py-4 animate-pulse">
        <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        <ul className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <li
              key={i}
              className="flex items-center justify-between px-4 py-3 border border-gray-100 dark:border-gray-700 rounded-lg"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1 mr-4" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">최근 활동</h3>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h3 className="text-xl font-semibold mb-6 dark:text-white">최근 활동</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">최근 게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post._id}
              className="flex items-center justify-between px-4 py-3 border border-gray-100 dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Link
                href={`/posts/${post.slug}`}
                className="font-medium dark:text-gray-200 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors truncate mr-4"
              >
                {post.title}
              </Link>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                {formatDate(post.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
