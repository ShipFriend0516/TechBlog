'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { FaChartBar } from 'react-icons/fa';
import { FaBuffer } from 'react-icons/fa6';
import { FiLogOut } from 'react-icons/fi';
import { HiBookOpen } from 'react-icons/hi';
import { IoSettingsSharp } from 'react-icons/io5';
import { RiFileTextLine } from 'react-icons/ri';
import QuickStats from '@/app/entities/admin/dashboard/QuickStats';
import RecentActivity from '@/app/entities/admin/dashboard/RecentActivity';
import useToast from '@/app/hooks/useToast';
import DecryptedText from '../entities/bits/DecryptedText';

interface DashboardItem {
  title: string;
  icon: ReactNode;
  description: string;
  accent: string;
  link: string;
}

// 렌더링마다 새로 만들 필요가 없는 정적 메뉴 정의
const DASHBOARD_ITEMS: DashboardItem[] = [
  {
    title: '블로그 포스트 작성',
    icon: <RiFileTextLine />,
    description: '새로운 글을 작성합니다.',
    accent: 'border-l-accent',
    link: '/admin/write',
  },
  {
    title: '게시글 수정/삭제',
    icon: <HiBookOpen />,
    description: '기존 게시글을 관리합니다.',
    accent: 'border-l-info',
    link: '/admin/posts',
  },
  {
    title: '방문자 및 조회수 분석',
    icon: <FaChartBar />,
    description: '블로그 통계를 확인합니다.',
    accent: 'border-l-warning',
    link: '/admin/analytics',
  },
  {
    title: '시리즈 관리',
    icon: <FaBuffer />,
    description: '블로그 시리즈를 관리합니다.',
    accent: 'border-l-nebula',
    link: '/admin/series',
  },
  {
    title: '댓글 확인 및 관리',
    icon: <BiCommentDetail />,
    description: '댓글을 관리합니다.',
    accent: 'border-l-danger',
    link: '/admin/comments',
  },
  {
    title: '블로그 설정 관리',
    icon: <IoSettingsSharp />,
    description: '블로그 설정을 변경합니다.',
    accent: 'border-l-fg-muted',
    link: '/admin/settings',
  },
];

const WELCOME_TOAST_KEY = 'admin:welcomed';

// 같은 브라우저 세션에서는 환영 토스트를 한 번만 노출
const useWelcomeToastOnce = () => {
  const toast = useToast();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(WELCOME_TOAST_KEY)) return;
      sessionStorage.setItem(WELCOME_TOAST_KEY, '1');
    } catch {
      // 스토리지 접근 불가 환경에서는 매번 노출
    }
    toast.success('관리자 페이지에 오신 것을 환영합니다.');
  }, [toast]);
};

// ProtectedRoute 가 관리자 세션을 보장하므로 이 페이지는 항상 로그인 상태로 렌더링된다
const AdminDashboard = () => {
  const { data: session } = useSession();
  useWelcomeToastOnce();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <DecryptedText
              text="관리자 대시보드"
              speed={60}
              revealDirection="start"
              animateOn="view"
            />
          </h1>
          <p className="text-fg">
            <DecryptedText
              text={`${session?.user?.name ?? '관리자'}님, 환영합니다`}
              speed={120}
              revealDirection="start"
              animateOn="view"
            />
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-danger text-white rounded-lg shadow-sm hover:bg-danger/90 transition-colors"
          onClick={() => signOut()}
        >
          <FiLogOut size={14} />
          로그아웃
        </button>
      </header>

      <nav
        aria-label="관리자 메뉴"
        className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {DASHBOARD_ITEMS.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            prefetch={false}
            className={`border border-hairline border-l-4 ${item.accent} rounded-lg p-5 hover:bg-surface transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
          >
            <div className="flex items-center mb-2">
              <div className="p-2 text-fg-soft rounded-lg" aria-hidden>
                {item.icon}
              </div>
              <h2 className="text-lg font-semibold ml-1">{item.title}</h2>
            </div>
            <p className="text-sm text-fg-muted">{item.description}</p>
          </Link>
        ))}
      </nav>

      <div className="mb-8">
        <QuickStats />
      </div>

      <RecentActivity />
    </div>
  );
};

export default AdminDashboard;
