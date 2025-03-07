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
