// GET /api/admin/comments - 관리자용 GitHub Issues 댓글 조회
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  body?: string;
  pull_request?: {
    url: string;
  };
}

interface GitHubComment {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  body: string;
  html_url: string;
}

export async function GET() {
  try {
    // 인증 확인
    const session = await getServerSession();
    if (!session) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const GITHUB_REPO = 'ShipFriend0516/TechBlog';
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
      console.error(
        'GitHub token 이 설정되지 않았습니다. .env 파일을 확인하세요.'
      );
      return Response.json(
        {
          success: false,
          error: 'GitHub token 이 설정되지 않았습니다. 관리자에게 문의하세요.',
        },
        { status: 500 }
      );
    }

    // GitHub Issues API로 모든 이슈 가져오기 (utterances가 생성한 이슈들)
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/issues?state=all&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!issuesResponse.ok) {
      const errorText = await issuesResponse.text();
      console.error('GitHub API error:', issuesResponse.status, errorText);
      throw new Error(
        `Failed to fetch issues from GitHub: ${issuesResponse.status} ${errorText}`
      );
    }

    const allIssues: GitHubIssue[] = await issuesResponse.json();

    if (!Array.isArray(allIssues)) {
      console.error('Invalid response from GitHub API:', allIssues);
      throw new Error('Invalid response from GitHub API');
    }

    // Pull Request를 제외하고 실제 Issues만 필터링
    const issues = allIssues.filter((issue) => !issue.pull_request);

    // 각 이슈에 대한 댓글 가져오기
    const issuesWithComments = await Promise.all(
      issues.map(async (issue) => {
        if (!issue || issue.comments === 0) {
          return {
            issue,
            comments: [],
          };
        }

        try {
          const commentsResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/issues/${issue.number}/comments`,
            {
              headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
              },
            }
          );

          if (!commentsResponse.ok) {
            console.error(
              `Failed to fetch comments for issue ${issue.number}:`,
              commentsResponse.status
            );
            return {
              issue,
              comments: [],
            };
          }

          const comments: GitHubComment[] = await commentsResponse.json();

          return {
            issue,
            comments: Array.isArray(comments) ? comments : [],
          };
        } catch (error) {
          console.error(
            `Error fetching comments for issue ${issue.number}:`,
            error
          );
          return {
            issue,
            comments: [],
          };
        }
      })
    );

    // 댓글이 있는 이슈만 필터링
    const issuesWithCommentsOnly = issuesWithComments.filter(
      (item) => item.comments.length > 0
    );

    return Response.json(
      {
        success: true,
        data: issuesWithCommentsOnly,
        total: issuesWithCommentsOnly.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    return Response.json(
      { success: false, error: '댓글 불러오기 실패', detail: error },
      { status: 500 }
    );
  }
}
