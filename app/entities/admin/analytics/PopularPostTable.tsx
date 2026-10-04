import { memo } from 'react';
import { PopularPostItem } from '@/app/types/Admin';
import PostListItem, { PopularPostMode } from './PostListItem';

interface PopularPostTableProps {
  posts: PopularPostItem[];
  mode: PopularPostMode;
}

const PopularPostTable = ({ posts, mode }: PopularPostTableProps) => {
  return (
    <div className="bg-surface rounded-xl overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-fg-muted border-b border-hairline">
          <span className="w-4 shrink-0" />
          <span className="flex-1">제목</span>
          <span className="w-24 shrink-0 text-center">시리즈</span>
          <span className="w-24 shrink-0 text-center">작성일</span>
          <span className="w-12 shrink-0 text-center">좋아요</span>
          <span className="w-20 shrink-0 text-right">
            {mode === 'all' ? '조회수(오늘)' : '오늘 조회수'}
          </span>
          <span className="w-[18px] shrink-0" />
        </div>
        <ul>
          {posts.map((post, i) => (
            <PostListItem key={post.postId} post={post} rank={i + 1} mode={mode} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(PopularPostTable);
