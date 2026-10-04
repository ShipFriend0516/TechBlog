import { memo } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { formatDate } from '@/app/lib/utils/format';
import { GitHubComment } from '@/app/types/Admin';

interface CommentItemProps {
  comment: GitHubComment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="bg-raised/40 p-4 rounded-lg">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- GitHub 아바타 외부 URL */}
        <img
          src={comment.user.avatar_url}
          alt={comment.user.login}
          loading="lazy"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="font-semibold text-fg">{comment.user.login}</span>
            <time
              dateTime={comment.created_at}
              className="text-sm text-fg-muted"
            >
              {formatDate(new Date(comment.created_at).getTime())}
            </time>
          </div>
          <div className="mt-2 text-fg whitespace-pre-wrap break-words">
            {comment.body}
          </div>
          <a
            href={comment.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-sm text-info hover:underline"
          >
            GitHub에서 보기
            <FiExternalLink size={12} aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
};

export default memo(CommentItem);
