'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import IssueCard from '@/app/entities/admin/comments/IssueCard';

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

interface IssueWithComments {
  issue: GitHubIssue;
  comments: GitHubComment[];
}

const AdminCommentsPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [issuesWithComments, setIssuesWithComments] = useState<
    IssueWithComments[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchComments();
    }
  }, [status]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/comments');
      const data = await response.json();

      if (data.success) {
        setIssuesWithComments(data.data);
      } else {
        setError(data.error || '댓글을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">댓글 관리</h1>
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">댓글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">댓글 관리</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">댓글 관리</h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all"
        >
          대시보드로 돌아가기
        </Link>
      </div>

      {issuesWithComments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">아직 댓글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg mb-4">
            <p className="text-blue-800">
              총 <strong>{issuesWithComments.length}</strong>개의 글에 댓글이
              달려있습니다.
            </p>
          </div>

          {issuesWithComments.map(({ issue, comments }) => (
            <IssueCard key={issue.id} issue={issue} comments={comments} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCommentsPage;
