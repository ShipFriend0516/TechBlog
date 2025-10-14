'use client';

import { useState } from 'react';
import Link from 'next/link';
import CommentItem from './CommentItem';

interface GitHubUser {
  login: string;
  avatar_url: string;
}

interface GitHubComment {
  id: number;
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  body: string;
  html_url: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  user: GitHubUser;
  body?: string;
}

interface IssueCardProps {
  issue: GitHubIssue;
  comments: GitHubComment[];
}

// 이슈 제목에서 slug 추출
const extractSlugFromTitle = (title: string): string => {
  try {
    let titleString = title;
    if (title.startsWith('posts/')) {
      titleString = title.slice(6).trim();
    }
    // 마지막 슬래시 제거
    if (titleString.endsWith('/')) {
      titleString = titleString.slice(0, -1);
    }
    return decodeURIComponent(titleString);
  } catch {
    return title;
  }
};

// 이슈 제목을 읽기 쉬운 형태로 변환
const extractPostTitle = (title: string): string => {
  try {
    let titleString = title;
    if (title.startsWith('posts/')) {
      titleString = title.slice(6).trim();
    }

    const decodedSlug = decodeURIComponent(titleString);

    const readableTitle = decodedSlug
      .split(/[-_]/)
      .map((word) => {
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');

    return readableTitle || decodedSlug || title;
  } catch {
    return title;
  }
};

const IssueCard = ({ issue, comments }: IssueCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const postTitle = extractPostTitle(issue.title);
  const slug = extractSlugFromTitle(issue.title);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {postTitle}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                {comments.length}개의 댓글
              </span>
              <Link
                href={`/posts/${slug}`}
                className="text-green-600 hover:text-green-800 hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                글 보러가기 →
              </Link>
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub에서 보기 →
              </a>
            </div>
          </div>
          <button
            className="ml-4 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <svg
              className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-6 space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
