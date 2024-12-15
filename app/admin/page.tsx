'use client';
import HoverButton from '@/app/entities/common/HoverButton';
import { signIn, useSession } from 'next-auth/react';

const AdminPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        className={
          'px-8 py-2 text-2xl bg-black mx-auto my-20 text-white rounded-md shadow-md'
        }
        onClick={() => signIn('github')}
      >
        GitHub로 로그인
      </button>
    );
  }

  return (
    <section className={'py-6'}>
      <h2 className={'text-3xl text-center'}>관리자 페이지</h2>
      <div className={'w-full inline-flex justify-center'}>
        <HoverButton
          className={
            'w-1/4 h-1/4 m-10 shadow hover:shadow-xl text-black text-2xl aspect-square bg-blue-200 p-10 hover:rounded-3xl transition-slow'
          }
          defaultText={'블로그 업로드'}
          hoverText={'새로운 글을 작성합니다.'}
        />
        <HoverButton
          className={
            'w-1/4 h-1/4 m-10 shadow hover:shadow-xl text-black text-2xl aspect-square bg-amber-200 p-10 hover:rounded-3xl transition-slow'
          }
          defaultText={'포트폴리오 업로드'}
          hoverText={'새로운 포트폴리오 프로젝트를 업로드합니다.'}
        />
      </div>
    </section>
  );
};

export default AdminPage;
