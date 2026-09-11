export const SITE_NAME = 'ShipFriend TechBlog';
export const SITE_DESCRIPTION =
  '문제 해결 경험과 개발 지식을 공유하는 개발 블로그입니다.';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev'
).replace(/\/$/, '');

export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/images/profile/profile-banner.png`;

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, `${SITE_URL}/`).toString();
}
