'use client';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { BiFolder , BiCommentDetail } from 'react-icons/bi';
import { FaChartBar } from 'react-icons/fa';
import { FaBuffer } from 'react-icons/fa6';
import { HiBookOpen } from 'react-icons/hi';
import { IoSettingsSharp } from 'react-icons/io5';
import { RiFileTextLine } from 'react-icons/ri';
import QuickStats from '@/app/entities/admin/dashboard/QuickStats';
import RecentActivity from '@/app/entities/admin/dashboard/RecentActivity';
import BubbleBackground from '@/app/entities/common/Background/BubbleBackground';
import GithubLogin from '@/app/entities/common/Button/GithubLogin';
import useToast from '@/app/hooks/useToast';
import DecryptedText from '../entities/bits/DecryptedText';

const AdminDashboard = () => {
  const { data: session } = useSession();
  const toast = useToast();

  useEffect(() => {
    if (session) {
      toast.success('관리자 페이지에 오신 것을 환영합니다.');
    }
  }, []);

  if (!session) {
    return (
      <>
        <BubbleBackground />
        <header className="mb-8 h-96 flex flex-col gap-4 justify-center items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
            <p className="text-gray-200">로그인이 필요한 기능입니다.</p>
          </div>
          <GithubLogin signIn={signIn} />
        </header>
      </>
    );
  }

  const dashboardItems = [
    {
      title: '블로그 포스트 작성',
      icon: <RiFileTextLine />,
      description: '새로운 글을 작성합니다.',
      bgColor: 'bg-blue-950/20', // 짙은 파란색의 투명도 적용
      link: '/admin/write',
    },
    {
      title: '프로젝트 관리',
      icon: <BiFolder />,
      description: '포트폴리오 프로젝트를 관리합니다.',
      bgColor: 'bg-yellow-950/20', // 짙은 노란색의 투명도 적용
      link: '/admin/portfolio',
    },
    {
      title: '게시글 수정/삭제',
      icon: <HiBookOpen />,
      description: '기존 게시글을 관리합니다.',
      bgColor: 'bg-green-950/20', // 짙은 초록색의 투명도 적용
      link: '/admin/posts',
    },
    {
      title: '방문자 및 조회수 분석',
      icon: <FaChartBar />,
      description: '블로그 통계를 확인합니다.',
      bgColor: 'bg-purple-950/20', // 짙은 보라색의 투명도 적용
      link: '/admin/analytics',
    },
    {
      title: '시리즈 관리',
      icon: <FaBuffer />,
      description: '블로그 시리즈를 관리합니다.',
      bgColor: 'bg-emerald-950/20', // 짙은 보라색의 투명도 적용
      link: '/admin/series',
    },
    {
      title: '댓글 확인 및 관리',
      icon: <BiCommentDetail />,
      description: '댓글을 관리합니다.',
      bgColor: 'bg-pink-950/20', // 짙은 분홍색의 투명도 적용
      link: '/admin/comments',
    },
    {
      title: '블로그 설정 관리',
      icon: <IoSettingsSharp />,
      description: '블로그 설정을 변경합니다.',
      bgColor: 'bg-gray-800/20', // 짙은 회색의 투명도 적용
      link: '/admin/settings',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <DecryptedText
              text="관리자 대시보드"
              speed={60}
              revealDirection="start"
              animateOn="view"
            />
          </h1>
          <p className=" text-default">
            <DecryptedText
              text={`${session.user?.name}님, 환영합니다`}
              speed={120}
              revealDirection="start"
              animateOn="view"
            />
          </p>
        </div>
        <button
          className="right-0 px-4 py-1 bg-red-500 text-white rounded-md shadow-md hover:bg-red-700 transition-all"
          onClick={() => signOut()}
        >
          로그아웃
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {dashboardItems.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            prefetch={false}
            className={`${item.bgColor} p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
          >
            <div className="flex items-center mb-4">
              <div className="p-2  border text-weak  rounded-lg shadow-sm">
                {item.icon}
              </div>
              <h2 className="text-xl font-semibold ml-3">{item.title}</h2>
            </div>
            <p className="text-default">{item.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
        <RecentActivity />
        <QuickStats />
      </div>
    </div>
  );
};

export default AdminDashboard;
