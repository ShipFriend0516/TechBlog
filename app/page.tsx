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
      <section className="grid gap-8">
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
        <p className="text-lg md:text-xl text-default max-w-3xl mx-auto text-center leading-relaxed">
          안녕하세요, 서정우입니다. 사용자 경험과 깔끔한 코드 작성에 중점을 두고
          있으며, 멈추지 않는 기술의 변화를 즐깁니다.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-64 overflow-hidden rounded-lg">
          <Image
            width={500}
            height={400}
            priority={true}
            src={'/images/profile/profile.jpg'}
            alt="About image"
            className="hover:rotate-180 transition duration-[60000ms] object-cover w-full h-full bg-gray-500"
          />
        </div>
        <div className="grid gap-4">
          <h2 className="text-2xl font-semibold">About Me</h2>
          <p className="text-default">
            프론트엔드 개발자로서 React, Next.js, TypeScript를 주로 사용합니다.
            항상 사용자 입장에서 생각하고, 성능 최적화에 관심이 많으며, 지속적인
            학습과 성장을 추구합니다.
          </p>
          <div className="flex gap-4">
            <a href={githubLink} target={'_blank'}>
              <FaGithub className="w-5 h-5 text-default hover:scale-125 transition cursor-pointer" />
            </a>
            <a href={linkedinLink} target={'_blank'}>
              <FaLinkedin className="w-5 h-5 text-default hover:scale-125 transition cursor-pointer" />
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <h2 className="text-2xl font-semibold">Featured Projects</h2>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-6'}>
          {projects.map((project) => {
            return <PortfolioPreview key={project.title} project={project} />;
          })}
        </div>
      </section>

      <section className="grid gap-6">
        <h2 className="text-2xl font-semibold">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <>
              <div className={'flex flex-col gap-2'}>
                <Skeleton className={'w-full h-48'} />
                <Skeleton className={'w-full h-6'} />
                <Skeleton className={'w-3/4 h-4'} />
              </div>
              <div className={'flex flex-col gap-2'}>
                <Skeleton className={'w-full h-48'} />
                <Skeleton className={'w-full h-6'} />
                <Skeleton className={'w-3/4 h-4'} />
              </div>
              <div className={'flex flex-col gap-2'}>
                <Skeleton className={'w-full h-48'} />
                <Skeleton className={'w-full h-6'} />
                <Skeleton className={'w-3/4 h-4'} />
              </div>
            </>
          ) : (
            posts &&
            posts.slice(0, 3).map((post) => (
              <Link
                href={`/posts/${post.slug}`}
                key={post._id}
                className="group cursor-pointer"
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg hover:shadow-lg">
                  <Image
                    width={500}
                    height={400}
                    src={
                      post.thumbnailImage ||
                      '/images/placeholder/thumbnail_example2.webp'
                    }
                    alt={`Article ${post.title}`}
                    className="object-cover bg-[position:50%_20%] bg-cover bg-no-repeat w-full h-full transition-transform group-hover:scale-105 bg-gray-500 "
                  />
                </div>
                <h3 className="font-medium mb-2">{post.title}</h3>
                <p className="text-sm text-default">
                  {post.subTitle && post.subTitle.slice(0, 80)}
                </p>
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
