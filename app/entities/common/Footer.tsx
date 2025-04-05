'use client';
import Link from 'next/link';
import useToast from '@/app/hooks/useToast';

const Footer = () => {
  const toast = useToast();

  return (
    <footer
      className={
        'w-screen bg-neutral-100  dark:bg-gray-950  min-h-96 flex flex-col justify-between shadow-top'
      }
    >
      <section
        className={'footer w-full flex flex-col md:flex-row justify-center'}
      >
        <div className={'footer-col'}>
          <b>BLOG</b>
          <div className={'text-weak'}>
            <p className={'text-left font-serif whitespace-pre-wrap'}>
              a developer who never stops growing.
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
          <form className={'flex flex-col gap-4'}>
            <p className={'text-default'}>새 글을 구독해보세요</p>
            <input
              className={
                'border-b bg-transparent px-4 py-1.5 inset-3 outline-black'
              }
              placeholder={'닉네임을 입력하세요'}
            />
            <input
              className={
                'border-b bg-transparent px-4 py-1.5 inset-3 outline-black'
              }
              placeholder={'구독할 이메일을 입력하세요'}
            />
            <button
              className={
                'rounded-md border bg-transparent py-3 w-1/2 border-black hover:shadow-lg hover:bg-white hover:text-black transition'
              }
              aria-label={'구독 버튼'}
              onClick={(e) => {
                e.preventDefault();
                toast.error('새 글 구독은 아직 지원하지 않는 기능입니다.');
              }}
            >
              Subscribe
            </button>
          </form>
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
