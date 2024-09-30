'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Profile from '@/app/entities/common/Profile';

import profile from '@/app/public/profile.jpg';
const NavBar = () => {
  const [isFixed, setIsFixed] = useState(false);

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
  return (
    <nav
      className={`${isFixed ? 'fixed bg-white bg-opacity-20' : 'relative'} h-16 top-0 px-8 w-screen  inline-flex items-center justify-center z-40 backdrop-blur-sm`}
    >
      <div>
        <Link href={'/blogList'}>
          <Profile profileThumbnail={profile} username={'Jeongwoo Seo'} />
        </Link>
      </div>
      <ul className={'inline-flex max-w-5xl w-full justify-end gap-3 '}>
        <li className={'px-4 py-2'}>
          <Link href="/blog">Blog</Link>
        </li>
        <li className={'px-4 py-2'}>
          <Link href="/portfolio">Portfolio</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
