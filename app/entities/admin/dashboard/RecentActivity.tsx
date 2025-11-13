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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">최근 활동</h3>
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">최근 활동</h3>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">최근 활동</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">최근 게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post._id}
              className="border-b border-gray-200 pb-3 last:border-0"
            >
              <Link
                href={`/posts/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium block"
              >
                {post.title}
              </Link>
              <span className="text-sm text-gray-500">
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
