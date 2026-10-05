'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiOutlineBars3BottomRight } from 'react-icons/hi2';
import { IoMoonSharp, IoSunnySharp } from 'react-icons/io5';
import IconButton from '@/app/entities/common/Button/IconButton';
import NavSidebar from '@/app/entities/common/NavSidebar';
import useTheme from '@/app/hooks/useTheme';
import { isActivePath, NAV_LINKS } from '@/app/lib/constants/navigation';

const TRANSPARENT_PATHS = ['/atelier'];

const NavBar = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [sidebarOpenedAt, setSidebarOpenedAt] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isTransparent = TRANSPARENT_PATHS.some((p) => pathname.startsWith(p));
  const isSidebarOpen = sidebarOpenedAt === pathname;

  useEffect(() => {
    // 콘텐츠가 투명한 내비 밑으로 들어가기 시작하면 바로 배경을 깖
    const handleScroll = () => {
      setIsFixed(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleSidebarOpen = () => setSidebarOpenedAt(pathname);
  const handleSidebarClose = () => setSidebarOpenedAt(null);

  // 맨 위에서는 투명하게 두어 body 배경(성운 안개)이 히어로와 이어지도록 하고,
  // 스크롤 후에만 콘텐츠 위에 유리 배경을 깖
  const fixedStyle =
    isTransparent || !isFixed
      ? 'bg-transparent'
      : 'bg-base/70 backdrop-blur-md';

  return (
    <nav>
      <div className={'h-16 w-full'} />
      <div
        className={`${fixedStyle} fixed h-16 top-0 px-4 w-screen inline-flex items-center justify-center z-40 transition-colors duration-300`}
      >
        <div>
          <Link href={'/'} aria-label="ShipFriend TechBlog 홈" className="flex items-center gap-2 mr-2">
            <Image src="/images/logo/contour.png" alt="" width={40} height={40} priority className="h-10 w-10 object-contain" />
            <span className="font-bold">Jeongwoo Seo</span>
          </Link>
        </div>
        <ul
          className={
            'inline-flex max-w-5xl flex-grow justify-end gap-1.5 sm:gap-3 items-center'
          }
        >
          {NAV_LINKS.map((link) => {
            const isActive = isActivePath(pathname, link.href);
            return (
              <li key={link.href} className={'hidden sm:block'}>
                <Link
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2 py-1 text-sm transition-colors ${
                    isActive
                      ? 'text-accent font-medium'
                      : 'text-fg-soft hover:text-fg'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <IconButton
              onClick={toggleTheme}
              Icon={theme === 'light' ? IoSunnySharp : IoMoonSharp}
              size={20}
              aria-label="테마 변경 버튼"
            />
          </li>
          <li className={'sm:hidden'}>
            <IconButton
              onClick={handleSidebarOpen}
              Icon={HiOutlineBars3BottomRight}
              size={20}
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
