import { useEffect, useState } from 'react';
import { Post } from '@/app/types/Post';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/app/lib/utils/format';

interface PostWithView extends Post {
  view: number;
}
const PopularPosts = ({ limit = 5 }: { limit?: number }) => {
  const [posts, setPosts] = useState<PostWithView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPopularPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/popular`, {
          params: {
            limit: limit,
          },
        });
        const data = await response.data;

        if (data) {
          setPosts(data.posts);
        } else {
          setError(data.error || '인기 게시물을 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        setError('인기 게시물을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getPopularPosts();
  }, [limit]);

  if (loading) {
    return <div className="p-4 text-center">인기 게시물을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="p-4 text-center">인기 게시물이 없습니다.</div>;
  }

  return (
    <div className="popular-posts">
      <h2 className="text-2xl font-bold mb-6 text-black">인기 게시물</h2>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div key={post._id} className="flex items-center gap-4 border-b pb-4">
            <div className="flex-shrink-0 font-bold text-xl text-gray-500">
              {index + 1}
            </div>

            {post.thumbnailImage && (
              <div className="flex-shrink-0 w-20 h-20 relative">
                <Image
                  src={post.thumbnailImage}
                  alt={post.title}
                  fill
                  sizes="80px"
                  className="object-cover rounded"
                />
              </div>
            )}

            <div className="flex-grow">
              <Link href={`/posts/${post.slug}`} className="block">
                <h3 className="text-black text-lg font-semibold hover:text-green-600 transition-colors">
                  {post.title}
                </h3>
              </Link>
              <div className="text-sm text-gray-500 mt-1 flex gap-3">
                <span>{post.author}</span>
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {post.view}
                </span>
                <span>{formatDate(post.date)}</span>
                <span>{post.timeToRead}분 읽기</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
