'use client';
import { useEffect } from 'react';
import useDataFetch from '@/app/hooks/common/useDataFetch';
import useFingerprint from '@/app/hooks/useFingerprint';
import useToast from '@/app/hooks/useToast';
import { projects } from '@/app/lib/constants/landingPageData';
import { Post } from '@/app/types/Post';
import AboutMe from './entities/profile/AboutMe';
import Experience from './entities/profile/Experience';
import FeaturedProjects from './entities/profile/FeaturedProjects';
import HeroBanner from './entities/profile/HeroBanner';
import LatestArticles from './entities/profile/LatestArticles';
import MoreExplore from './entities/profile/MoreExplore';

export default function Home() {
  const { fingerprint } = useFingerprint();
  const toast = useToast();

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

  return (
    <main className="w-full max-w-5xl mx-auto grid gap-12 p-4 md:p-6">
      <HeroBanner />
      <AboutMe />
      <Experience />
      <FeaturedProjects projects={projects} />
      <LatestArticles posts={posts} loading={loading} error={error} />
      <MoreExplore />
    </main>
  );
}
