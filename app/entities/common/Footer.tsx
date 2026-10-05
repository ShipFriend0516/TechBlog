'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SOCIAL_LINKS } from '@/app/lib/constants/socialLinks';

const HIDDEN_PATHS = ['/atelier'];

const NAV_LINKS = [
  { href: '/posts', label: 'Blog' },
  { href: '/series', label: 'Series' },
  { href: '/tags', label: 'Tags' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
];

const ICON_LINKS = [SOCIAL_LINKS.github, SOCIAL_LINKS.email, SOCIAL_LINKS.rss];

const Footer = () => {
  const pathname = usePathname();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-16 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <p className="font-semibold">ShipFriend TechBlog</p>
          <p className="mt-1 text-sm text-fg-muted">
            문제 해결과 성장의 기록을 만듭니다.
          </p>
        </div>

        <nav aria-label="푸터 메뉴">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-soft hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-1">
          {ICON_LINKS.map(({ href, label, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="block p-2 rounded-lg text-fg-muted hover:text-accent hover:bg-surface transition-colors"
              >
                <Icon size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-xs text-fg-faint">
        © 2024{' '}
        <Link href="/admin" className="hover:text-fg-muted transition-colors">
          Seo Jeongwoo
        </Link>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
