import { IconType } from 'react-icons';
import { FaGithub, FaLinkedin, FaRss } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { githubLink, linkedinLink } from '@/app/lib/constants/landingPageData';

export interface SocialLink {
  href: string;
  label: string;
  Icon: IconType;
  external: boolean;
}

// 푸터, 홈, About 이 함께 쓰는 외부 링크 — 화면마다 필요한 것만 골라 씀
export const SOCIAL_LINKS = {
  github: { href: githubLink, label: 'GitHub', Icon: FaGithub, external: true },
  linkedin: { href: linkedinLink, label: 'LinkedIn', Icon: FaLinkedin, external: true },
  email: { href: 'mailto:sjw4371@naver.com', label: 'Email', Icon: HiOutlineMail, external: false },
  rss: { href: '/rss.xml', label: 'RSS', Icon: FaRss, external: false },
} satisfies Record<string, SocialLink>;
