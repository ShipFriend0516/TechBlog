import type { Metadata } from 'next';
import AboutMe from '@/app/entities/profile/AboutMe';
import Experience from '@/app/entities/profile/Experience';
import { SITE_NAME, SITE_URL } from '@/app/lib/site';

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description: 'ShipFriend TechBlog를 운영하는 개발자 서정우를 소개합니다.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const AboutPage = () => (
  <div className="w-full max-w-4xl mx-auto grid gap-16 px-4 md:px-8 pt-12 pb-12">
    <AboutMe />
    <Experience />
  </div>
);

export default AboutPage;
