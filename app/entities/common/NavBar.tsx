'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Profile from '@/app/entities/common/Profile';

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
      className={`${isFixed ? 'fixed' : 'absolute'} top-0 w-screen bg-white bg-opacity-20 inline-flex items-center`}
    >
      <div>
        <Profile profileThumbnail={''} />
      </div>
      <ul className={'inline-flex max-w-5xl w-full justify-between gap-3 '}>
        <li className={'px-4 py-2'}>
          <Link href="/">Home</Link>
        </li>
        <li className={'px-4 py-2'}>
          <Link href="/about">About</Link>
        </li>
        <li className={'px-4 py-2'}>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
