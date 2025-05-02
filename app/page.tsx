'use client';
import Image from 'next/image';
import profileBackground from '@/app/public/plane2.jpg';
import profile from '@/app/public/profile.jpg';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Post } from '@/app/types/Post';
import axios from 'axios';
import Link from 'next/link';
import Skeleton from '@/app/entities/common/Skeleton';
import PortfolioPreview from '@/app/entities/portfolio/PortfolioPreview';
import {
  githubLink,
  linkedinLink,
  projects,
} from '@/app/lib/constants/landingPageData';
import useFingerprint from '@/app/hooks/useFingerprint';
import useToast from '@/app/hooks/useToast';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>();
  const [loading, setLoading] = useState(true);
  const { fingerprint } = useFingerprint();
  const toast = useToast();
  const getPosts = async () => {
    const response = await axios.get('/api/posts', {
      params: {
        compact: 'true',
        limit: 3,
      },
    });
    const data = await response.data;
    setPosts(data.posts);
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (fingerprint) {
      toast.success('다시 오신 것을 환영합니다!');
    }
  }, [fingerprint]);

  return (
    <main className="w-full max-w-4xl mx-auto grid gap-16 p-8">
      {/* Hero Section */}
      <section className="grid gap-6">
        <div className="relative h-64 w-full overflow-hidden rounded-lg">
          <Image
            src={profileBackground}
            width={'1024'}
            height={'720'}
            alt="Hero image"
            className="object-cover bg-gray-100 w-full h-full"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          <div
            className={
              'absolute top-0 left-0 p-8 w-full h-full flex flex-col gap-2 text-white '
            }
          >
            <h1 className="  text-4xl font-bold ">Frontend Developer</h1>
            <p className={'text-xl '}>
              <span className="text-sm font-bold">Jeongwoo Seo</span>
            </p>
            <div className={' flex flex-col justify-end flex-grow'}>
              <div>React · NextJS · TypeScript</div>
            </div>
          </div>
        </div>
        <p className="text-lg text-default max-w-2xl">
          안녕하세요, 서정우입니다. 사용자 경험과 깔끔한 코드 작성에 중점을 두고
          있으며, 멈추지 않는 기술의 변화를 즐깁니다.
        </p>
      </section>

      {/* About Section */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-64 overflow-hidden rounded-lg">
          <Image
            width={500}
            height={400}
            src={profile}
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

      {/* Featured projects */}
      <section className="grid gap-6">
        <h2 className="text-2xl font-semibold">Featured Projects</h2>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-6'}>
          {projects.map((project) => {
            return <PortfolioPreview key={project.title} project={project} />;
          })}
        </div>
      </section>

      {/* Latest Articles */}
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
                    src={post.thumbnailImage || profile}
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
      </section>
      {/* 더보기 버튼*/}
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
