import { StaticImageData } from 'next/image';

export interface Project {
  title: string;
  description: string;
  image: string | StaticImageData;
  tags?: string[];
  demoUrl?: string;
  githubUrl?: string;
  slug?: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  technologies: string[];
  mainImage: string;
  images: string[];
  year: string;
  category: string;
  features?: string[];
  challenges?: Challenge[];
  duration?: string;
  links?: {
    githubUrl?: string; // GitHub 저장소 URL (선택적)
    deployUrl?: string; // 배포 URL (선택적)
  };
}

export interface Challenge {
  title: string;
  description: string;
  url?: string;
}
