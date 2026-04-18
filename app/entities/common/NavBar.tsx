'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiOutlineBars3BottomRight } from 'react-icons/hi2';
import { IoMoonSharp, IoSunnySharp } from 'react-icons/io5';
import IconButton from '@/app/entities/common/Button/IconButton';
import NavSidebar from '@/app/entities/common/NavSidebar';
import Profile from '@/app/entities/common/Profile';
import useTheme from '@/app/hooks/useTheme';

const TRANSPARENT_PATHS = ['/atelier'];

const NavBar = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isTransparent = TRANSPARENT_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleSidebarOpen = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  const fixedStyle = isTransparent
    ? 'bg-transparent'
    : isFixed
      ? 'bg-white bg-opacity-20'
      : 'bg-background';

  return (
    <nav>
      <div className={'h-16 w-full'} />
      <div
        className={`${fixedStyle} fixed h-16 top-0 px-4 w-screen inline-flex items-center justify-center z-40 backdrop-blur-sm`}
      >
        <div>
          <Link href={'/'}>
            <Profile
              profileThumbnail={'/images/profile/profile.jpg'}
              username={'Jeongwoo Seo'}
            />
          </Link>
        </div>
        <ul
          className={
            'inline-flex max-w-5xl flex-grow justify-end gap-1.5 sm:gap-3 items-center'
          }
        >
          <li className={'hidden sm:block'}>
            <Link href="/posts">Blog</Link>
          </li>
          <li className={'hidden sm:block'}>
            <Link href="/series">Series</Link>
          </li>
          <li className={'hidden sm:block'}>
            <Link href="/atelier">Atelier</Link>
          </li>
          <li className={'hidden sm:block'}>
            <Link href="/tags">Tags</Link>
          </li>
          <li className={'hidden sm:block'}>
            <Link href="/portfolio">Portfolio</Link>
          </li>
          <li>
            <IconButton
              onClick={toggleTheme}
              Icon={theme === 'light' ? IoSunnySharp : IoMoonSharp}
              size={16}
              aria-label="테마 변경 버튼"
            />
          </li>
          <li className={'sm:hidden'}>
            <IconButton
              onClick={handleSidebarOpen}
              Icon={HiOutlineBars3BottomRight}
              size={16}
              aria-label="메뉴 열기"
            />
          </li>
        </ul>
      </div>

      <NavSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
    </nav>
  );
};

export default NavBar;
