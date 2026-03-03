'use client';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      accent: 'border-l-brand-primary',
      link: '/admin/write',
    },
    {
      title: '프로젝트 관리',
      icon: <BiFolder />,
      description: '포트폴리오 프로젝트를 관리합니다.',
      accent: 'border-l-semantic-info',
      link: '/admin/portfolio',
    },
    {
      title: '게시글 수정/삭제',
      icon: <HiBookOpen />,
      description: '기존 게시글을 관리합니다.',
      accent: 'border-l-primary-bangladesh',
      link: '/admin/posts',
    },
    {
      title: '방문자 및 조회수 분석',
      icon: <FaChartBar />,
      description: '블로그 통계를 확인합니다.',
      accent: 'border-l-semantic-warning',
      link: '/admin/analytics',
    },
    {
      title: '시리즈 관리',
      icon: <FaBuffer />,
      description: '블로그 시리즈를 관리합니다.',
      accent: 'border-l-brand-secondary',
      link: '/admin/series',
    },
    {
      title: '댓글 확인 및 관리',
      icon: <BiCommentDetail />,
      description: '댓글을 관리합니다.',
      accent: 'border-l-semantic-error',
      link: '/admin/comments',
    },
    {
      title: '블로그 설정 관리',
      icon: <IoSettingsSharp />,
      description: '블로그 설정을 변경합니다.',
      accent: 'border-l-primary-mountain',
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

      <div className="mb-8">
        <QuickStats />
      </div>

      {!mounted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 border-l-4 border-l-gray-300 dark:border-l-gray-600 rounded-lg p-6"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded ml-2" />
              </div>
              <div className="h-4 w-44 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              prefetch={false}
              className={`border border-gray-200 dark:border-gray-700 border-l-4 ${item.accent} rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:-translate-y-1`}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 text-gray-600 dark:text-gray-400 rounded-lg">
                  {item.icon}
                </div>
                <h2 className="text-lg font-semibold ml-2 dark:text-gray-100">{item.title}</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <RecentActivity />
      </div>
    </div>
  );
};

export default AdminDashboard;
