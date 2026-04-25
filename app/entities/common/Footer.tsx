'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSubscribe from '@/app/hooks/useSubscribe';

const HIDDEN_PATHS = ['/atelier'];

const Footer = () => {
  const pathname = usePathname();
  const {
    nickname,
    email,
    isLoading,
    isSubmitted,
    setNickname,
    setEmail,
    handleSubmit,
    handleReset: handleResubmit,
  } = useSubscribe();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer
      className={
        'w-screen bg-neutral-100  dark:bg-gray-950  min-h-96 flex flex-col justify-between border-t border-gray-300/50 dark:border-gray-700/50 '
      }
    >
      <section
        className={'footer w-full flex flex-col md:flex-row justify-center'}
      >
        <div className={'footer-col'}>
          <b>BLOG</b>
          <div className={'text-weak'}>
            <p className={'text-left text-sm font-serif whitespace-pre-wrap'}>
              개발과 기술에 대한 이야기를 공유하는 공간입니다. <br />
              문제 해결과 성장의 기록을 만듭니다.
            </p>
            <p className={'text-left font-serif whitespace-pre-wrap'}></p>
          </div>
        </div>
        <div className={'footer-col'}>
          <b>Contact</b>
          <div>
            <a href={'mailto:sjw4371@naver.com'}>Email</a>
          </div>
          <div>
            <a
              target={'_blank'}
              href={'https://github.com/ShipFriend0516'}
              referrerPolicy={'no-referrer'}
            >
              Github
            </a>
          </div>
        </div>
        <div className={'footer-col'}>
          <b>Subscribe</b>
          {isSubmitted ? (
            <div className={'flex flex-col gap-4'}>
              <p className={'text-sm text-green-600 dark:text-green-400'}>
                인증 이메일이 발송되었습니다!
              </p>
              <p className={'text-xs text-gray-600 dark:text-gray-400'}>
                이메일을 확인하여 구독을 완료해주세요.
              </p>
              <button
                onClick={handleResubmit}
                className={'text-sm text-gray-600 dark:text-gray-400 underline'}
              >
                다시 입력하기
              </button>
            </div>
          ) : (
            <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
              <p className={'text-default'}>새 글을 구독해보세요</p>
              <input
                className={
                  'border-b bg-transparent px-4 py-1.5 inset-3 outline-black dark:outline-white'
                }
                placeholder={'닉네임을 입력하세요'}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isLoading}
              />
              <input
                type="email"
                className={
                  'border-b bg-transparent px-4 py-1.5 inset-3 outline-black dark:outline-white'
                }
                placeholder={'구독할 이메일을 입력하세요'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={
                  'rounded-md border bg-transparent py-3 w-1/2 border-black dark:border-white hover:shadow-lg hover:bg-white hover:text-black dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed'
                }
                aria-label={'구독 버튼'}
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
        <div className={'footer-col'}>
          <b>Explore</b>
          <div>
            <Link href={'/posts'}>Blog</Link>
          </div>
          <div>
            <Link href={'/series'}>Series</Link>
          </div>
          <div>
            <Link href={'/portfolio'}>Portfolio</Link>
          </div>
          <div>
            <Link href={'/tags'}>Tags</Link>
          </div>
          <div>
            <Link href={'/admin'}>Admin</Link>
          </div>
        </div>
      </section>
      <p className="text-center text-sm text-gray-600 p-2">
        © 2024
        <a href={'/admin'}> Seo Jeongwoo.</a> All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
