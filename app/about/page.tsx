import type { Metadata } from 'next';
import AboutBlog from '@/app/entities/about/AboutBlog';
import AboutIntro from '@/app/entities/about/AboutIntro';
import ExperienceList from '@/app/entities/about/ExperienceList';
import ProjectGrid from '@/app/entities/about/ProjectGrid';
import { SITE_URL } from '@/app/lib/site';
import { projects } from '@/app/portfolio/data';

export const metadata: Metadata = {
  title: 'About',
  description:
    'ShipFriend TechBlog를 운영하는 개발자 서정우의 소개, 경력, 프로젝트입니다.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const AboutPage = () => (
  <div className="w-full max-w-6xl mx-auto flex flex-col gap-20 md:gap-28 px-4 md:px-8 pt-10 md:pt-16 pb-12">
    <AboutIntro />
    <ExperienceList />
    <ProjectGrid projects={projects} />
    <AboutBlog />
  </div>
);

export default AboutPage;
