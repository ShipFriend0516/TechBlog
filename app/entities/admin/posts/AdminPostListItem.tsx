import Link from 'next/link';
import { memo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { formatDate } from '@/app/lib/utils/format';
import type { Post } from '@/app/types/Post';

interface AdminPostListItemProps {
  post: Post;
  // 안정적인 참조를 넘겨 받아 memo 가 유효하도록 postId 를 인자로 받는다
  onDelete: (postId: string) => void;
}

const AdminPostListItem = ({ post, onDelete }: AdminPostListItemProps) => {
  return (
    <li className="px-4 py-4 hover:bg-raised/50 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/posts/${post.slug}`}
              prefetch={false}
              className="text-lg font-semibold truncate hover:text-accent transition-colors"
            >
              {post.title}
            </Link>
            {post.isPrivate && (
              <span className="shrink-0 rounded bg-raised px-1.5 py-0.5 text-xs font-medium text-fg-muted">
                비공개
              </span>
            )}
          </div>
          {post.subTitle && (
            <p className="text-sm text-fg-muted mt-1 truncate">{post.subTitle}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-fg-soft">
            <span>{formatDate(post.date)}</span>
            <span>읽는 시간 {post.timeToRead}분</span>
            <span>작성자 {post.author}</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Link
            href={`/admin/write?slug=${encodeURIComponent(post.slug)}`}
            prefetch={false}
            aria-label={`'${post.title}' 수정`}
            title="수정"
            className="p-2 text-info hover:bg-info/10 rounded-full transition-colors"
          >
            <FaPencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(post._id)}
            aria-label={`'${post.title}' 삭제`}
            title="삭제"
            className="p-2 text-danger hover:bg-danger/10 rounded-full transition-colors"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default memo(AdminPostListItem);
