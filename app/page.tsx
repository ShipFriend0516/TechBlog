'use client';
import Image from 'next/image';
import profileBackground from '@/app/public/plane2.jpg';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';
import PortfolioPreview from '@/app/entities/portfolio/PortfolioPreview';
import {
  githubLink,
  linkedinLink,
  projects,
} from '@/app/lib/constants/landingPageData';
import useFingerprint from '@/app/hooks/useFingerprint';
import useToast from '@/app/hooks/useToast';
import useDataFetch from '@/app/hooks/common/useDataFetch';
import { Post } from '@/app/types/Post';
import ErrorBox from '@/app/entities/common/Error/ErrorBox';
import { useRouter } from 'next/navigation';
import useShortcut from '@/app/hooks/common/useShortcut';
import DecryptedText from './entities/bits/DecryptedText';

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
      {/* Hero Section */}
      <section className="grid gap-4">
        <div className="relative h-80 md:h-96 w-full overflow-hidden rounded-2xl shadow-2xl group">
          <Image
            src={profileBackground}
            priority={true}
            width={'1024'}
            height={'720'}
            alt="Hero image"
            className="object-cover bg-gray-100 w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
          <div className="absolute top-0 left-0 p-8 md:p-12 w-full h-full flex flex-col gap-3 text-white">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <DecryptedText
                  text="Frontend Developer"
                  speed={60}
                  animateOn="view"
                  revealDirection="start"
                  sequential
                  encryptedClassName="text-neutral-200/90"
                />
              </h1>
              <p className="text-xl md:text-2xl font-light opacity-90">
                Jeongwoo Seo
              </p>
            </div>
            <div className="flex flex-col justify-end flex-grow">
              <div className="flex flex-wrap gap-3 text-sm md:text-base font-medium">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  React
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  NextJS
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  TypeScript
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg md:text-xl text-default max-w-3xl mx-auto text-center mt-4">
          안녕하세요, 서정우입니다.
        </p>
        <p className="text-lg md:text-xl text-default max-w-3xl mx-auto text-center mb-4">
          깔끔한 코드 작성에 중점을 두고, 확장성에 대해 고민하며 멈추지 않는
          기술의 변화를 즐깁니다.
        </p>
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 md:p-12">
        <div className="grid md:grid-cols-[1fr,2fr] gap-8 md:gap-12 items-center">
          <div className="relative mx-auto md:mx-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative h-56 w-56 overflow-hidden rounded-full ring-4 ring-white dark:ring-gray-700 shadow-xl">
              <Image
                width={500}
                height={400}
                priority={true}
                src={'/images/profile/profile.jpg'}
                alt="About image"
                className="hover:scale-110 transition duration-700 object-cover w-full h-full bg-gray-500"
              />
            </div>
          </div>
          <div className="grid gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                About Me
              </h2>
              <div className="h-1 w-20 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
            </div>
            <p className="text-default text-lg leading-relaxed">
              프론트엔드 개발자로서 React, Next.js, TypeScript를 주로
              사용합니다. 항상 사용자 입장에서 생각하고, 성능 최적화에 관심이
              많으며, 지속적인 학습과 성장을 추구합니다.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href={githubLink}
                target={'_blank'}
                className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
              >
                <FaGithub className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href={linkedinLink}
                target={'_blank'}
                className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
              >
                <FaLinkedin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Featured Projects
          </h2>
          <div className="h-1 w-24 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
        </div>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
          {projects.map((project) => {
            return <PortfolioPreview key={project.title} project={project} />;
          })}
        </div>
      </section>

      <section className="grid gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Latest Articles
          </h2>
          <div className="h-1 w-24 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <>
              <div
                className={
                  'flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700'
                }
              >
                <Skeleton className={'w-full h-52 rounded-none'} />
                <div className="p-6 space-y-3">
                  <Skeleton className={'w-full h-7'} />
                  <Skeleton className={'w-3/4 h-5'} />
                </div>
              </div>
              <div
                className={
                  'flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700'
                }
              >
                <Skeleton className={'w-full h-52 rounded-none'} />
                <div className="p-6 space-y-3">
                  <Skeleton className={'w-full h-7'} />
                  <Skeleton className={'w-3/4 h-5'} />
                </div>
              </div>
              <div
                className={
                  'flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700'
                }
              >
                <Skeleton className={'w-full h-52 rounded-none'} />
                <div className="p-6 space-y-3">
                  <Skeleton className={'w-full h-7'} />
                  <Skeleton className={'w-3/4 h-5'} />
                </div>
              </div>
            </>
          ) : (
            posts &&
            posts.slice(0, 3).map((post) => (
              <Link
                href={`/posts/${post.slug}`}
                key={post._id}
                className="group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-[1.02]"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    width={500}
                    height={400}
                    src={
                      post.thumbnailImage ||
                      '/images/placeholder/thumbnail_example2.webp'
                    }
                    alt={`Article ${post.title}`}
                    className="object-cover bg-[position:50%_20%] bg-cover bg-no-repeat w-full h-full transition-transform duration-500 group-hover:scale-110 bg-gray-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {post.subTitle && post.subTitle.slice(0, 80)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
        <ErrorBox error={error} />
      </section>
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
