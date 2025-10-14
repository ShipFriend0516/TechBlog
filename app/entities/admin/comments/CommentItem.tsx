import { formatDate } from '@/app/lib/utils/format';

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

interface CommentItemProps {
  comment: GitHubComment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={comment.user.avatar_url}
          alt={comment.user.login}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">
              {comment.user.login}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(new Date(comment.created_at).getTime())}
            </span>
          </div>
          <div className="mt-2 text-gray-700 whitespace-pre-wrap">
            {comment.body}
          </div>
          <a
            href={comment.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            GitHub에서 보기 →
          </a>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
