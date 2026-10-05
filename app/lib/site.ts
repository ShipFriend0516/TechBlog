export const SITE_NAME = 'ShipFriend TechBlog';
// 탭 제목이 잘리지 않도록 하위 페이지 title 접미사는 짧은 이름을 쓴다
export const SITE_SHORT_NAME = 'ShipFriend';
export const TITLE_TEMPLATE = `%s | ${SITE_SHORT_NAME}`;
export const SITE_DESCRIPTION =
  '문제 해결 경험과 개발 지식을 공유하는 개발 블로그입니다.';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev'
).replace(/\/$/, '');

export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/opengraph-image`;

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, `${SITE_URL}/`).toString();
}
