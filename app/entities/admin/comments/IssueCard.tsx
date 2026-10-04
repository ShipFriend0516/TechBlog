'use client';

import Link from 'next/link';
import { memo, useId, useMemo, useState } from 'react';
import { FiChevronDown, FiExternalLink, FiMessageSquare } from 'react-icons/fi';
import { GitHubComment, GitHubIssue } from '@/app/types/Admin';
import CommentItem from './CommentItem';
import { extractPostTitle, extractSlugFromTitle } from './issueTitle';

interface IssueCardProps {
  issue: GitHubIssue;
  comments: GitHubComment[];
}

const IssueCard = ({ issue, comments }: IssueCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();
  const postTitle = useMemo(() => extractPostTitle(issue.title), [issue.title]);
  const slug = useMemo(() => extractSlugFromTitle(issue.title), [issue.title]);

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex-1 min-w-0">
          <h2 className="mb-2 text-lg font-semibold text-fg">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              className="text-left hover:text-accent transition-colors"
            >
              {postTitle}
            </button>
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-soft">
            <span className="inline-flex items-center gap-1">
              <FiMessageSquare size={14} aria-hidden />
              {comments.length}개의 댓글
            </span>
            <Link
              href={`/posts/${slug}`}
              prefetch={false}
              className="text-accent hover:text-accent-strong hover:underline font-medium"
            >
              글 보러가기 →
            </Link>
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-info hover:underline"
            >
              GitHub에서 보기
              <FiExternalLink size={12} aria-hidden />
            </a>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md p-1 text-fg-muted hover:bg-raised hover:text-fg transition-colors"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          aria-label={isExpanded ? '댓글 접기' : '댓글 펼치기'}
        >
          <FiChevronDown
            size={22}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div id={panelId} className="border-t border-hairline p-5 space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(IssueCard);
