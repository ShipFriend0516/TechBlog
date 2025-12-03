'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoMoonSharp, IoSunnySharp } from 'react-icons/io5';
import IconButton from '@/app/entities/common/Button/IconButton';
import Profile from '@/app/entities/common/Profile';
import useTheme from '@/app/hooks/useTheme';
const NavBar = () => {
  const [isFixed, setIsFixed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const fixedStyle = isFixed ? 'bg-white bg-opacity-20' : 'bg-background';

  return (
    <nav>
      <div className={'h-16 w-full'} />
      <div
        className={`${fixedStyle} fixed h-16 top-0 px-4 w-screen  inline-flex items-center justify-center z-40 backdrop-blur-sm`}
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
            'inline-flex max-w-5xl flex-grow justify-end gap-3 items-center'
          }
        >
          <li>
            <Link href="/posts">Blog</Link>
          </li>
          <li>
            <Link href="/series">Series</Link>
          </li>
          <li>
            <Link href="/tags">Tags</Link>
          </li>
          <li>
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
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
