'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { projects } from '@/app/lib/constants/landingPageData';
import useFingerprint from '@/app/hooks/useFingerprint';
import useToast from '@/app/hooks/useToast';
import useDataFetch from '@/app/hooks/common/useDataFetch';
import { Post } from '@/app/types/Post';
import { useRouter } from 'next/navigation';
import useShortcut from '@/app/hooks/common/useShortcut';
import AboutMe from './entities/profile/AboutMe';
import FeaturedProjects from './entities/profile/FeaturedProjects';
import LatestArticles from './entities/profile/LatestArticles';
import HeroBanner from './entities/profile/HeroBanner';

export default function Home() {
  const { fingerprint } = useFingerprint();
  const toast = useToast();
  const router = useRouter();

  const fetchConfig = {
    method: 'GET' as const,
    url: '/api/posts',
    config: {
      params: {
        compact: 'true',
        limit: 3,
      },
    },
  };

  const { data, loading, error } = useDataFetch<{ posts: Post[] }>(fetchConfig);
  const posts = data?.posts || [];

  useEffect(() => {
    if (fingerprint) {
      toast.success('다시 오신 것을 환영합니다!');
    }
  }, [fingerprint]);

  const goToWritePage = () => {
    toast.success('글쓰기 페이지로 이동합니다...');
    router.push('/admin/write');
  };

  const goToPostsPage = () => {
    toast.success('모든 글 목록 페이지로 이동합니다...');
    router.push('/posts');
  };

  useShortcut(goToWritePage, ['Alt', 'N'], true);
  useShortcut(goToPostsPage, ['Ctrl', ';'], true);

  return (
    <main className="w-full max-w-6xl mx-auto grid gap-16 p-4 md:p-8">
      <HeroBanner />
      <AboutMe />
      <FeaturedProjects projects={projects} />
      <LatestArticles posts={posts} loading={loading} error={error} />
      <section className={'w-full flex justify-center'}>
        <Link
          href={'/posts'}
          className={
            'px-4 py-1 bg-overlay text-overlay rounded-md hover:bg-opacity-70 hover:shadow-lg transition '
          }
        >
          더 많은 글 보러가기
        </Link>
      </section>
    </main>
  );
}
