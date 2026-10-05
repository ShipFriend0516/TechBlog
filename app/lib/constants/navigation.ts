// 상단 내비와 모바일 사이드바가 함께 쓰는 메뉴
// Tags 는 홈 태그 우주와 글 목록 필터로, Portfolio 는 About 페이지로 흡수
export const NAV_LINKS = [
  { href: '/posts', label: 'Blog' },
  { href: '/series', label: 'Series' },
  { href: '/atelier', label: 'Atelier' },
  { href: '/about', label: 'About' },
];

export const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);
