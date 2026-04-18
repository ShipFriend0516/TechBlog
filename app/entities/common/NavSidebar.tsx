'use client';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import IconButton from '@/app/entities/common/Button/IconButton';
import DividerWithText from '@/app/entities/common/DividerWithText';
import useSubscribe from '@/app/hooks/useSubscribe';

interface NavSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavSidebar = ({ isOpen, onClose }: NavSidebarProps) => {
  const {
    nickname,
    email,
    isLoading,
    isSubmitted,
    setNickname,
    setEmail,
    handleSubmit,
    handleReset,
  } = useSubscribe();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className={'fixed inset-0 z-50 bg-black bg-opacity-40'}
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-64 flex-col bg-background shadow-xl transition-transform duration-300 sm:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 닫기 버튼 */}
        <div className={'flex h-16 items-center justify-end px-4'}>
          <IconButton
            onClick={onClose}
            Icon={IoCloseOutline}
            size={20}
            aria-label="메뉴 닫기"
          />
        </div>

        {/* 네비게이션 링크 */}
        <DividerWithText text="Routes" className="text-xs mx-6" />

        <ul className={'flex flex-col gap-6 px-6 py-4 text-lg text-right'}>
          <li>
            <Link href="/posts">Blog</Link>
          </li>
          <li>
            <Link href="/series">Series</Link>
          </li>
          <li>
            <Link href="/atelier">Atelier</Link>
          </li>
          <li>
            <Link href="/tags">Tags</Link>
          </li>
          <li>
            <Link href="/portfolio">Portfolio</Link>
          </li>
        </ul>

        {/* 구독 폼 */}
        <DividerWithText text="Subscription" className="text-xs mx-6 mt-12" />
        <div className={'px-6 py-6 dark:border-gray-700'}>
          {isSubmitted ? (
            <div className={'flex flex-col gap-2'}>
              <p className={'text-xs text-green-600 dark:text-green-400'}>
                인증 이메일이 발송되었습니다!
              </p>
              <button
                onClick={handleReset}
                className={'text-xs text-gray-500 underline'}
              >
                다시 입력하기
              </button>
            </div>
          ) : (
            <form className={'flex flex-col gap-3'} onSubmit={handleSubmit}>
              <input
                className={
                  'border-b bg-transparent px-2 py-1 text-sm outline-none focus:border-gray-500'
                }
                placeholder={'닉네임'}
                value={nickname}
                onChange={handleNicknameChange}
                disabled={isLoading}
              />
              <input
                type="email"
                className={
                  'border-b bg-transparent px-2 py-1 text-sm outline-none focus:border-gray-500'
                }
                placeholder={'이메일'}
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={
                  'mt-1 rounded-md border border-current py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50'
                }
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default NavSidebar;
