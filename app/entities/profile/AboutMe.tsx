import Image from 'next/image';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { githubLink, linkedinLink } from '@/app/lib/constants/landingPageData';

const AboutMe = () => {
  return (
    <section className="relative overflow-visible rounded-2xl from-accent to-raised p-6 md:p-10">
      <div className="flex gap-8 md:gap-12 items-center">
        <div className="relative mx-auto md:mx-0 group/duck">
          <div className="absolute -inset-1 bg-gradient-to-r from-raised to-raised rounded-full blur opacity-20 animate-pulse"></div>
          <div className="relative h-44 w-44 overflow-hidden rounded-full ring-4 ring-base shadow-xl">
            <Image
              width={500}
              height={400}
              priority={true}
              src={'/images/profile/darkDuck.png'}
              alt="Background image"
              className="object-cover w-full h-full bg-fg-muted"
            />
            <Image
              width={500}
              height={400}
              priority={true}
              src={'/images/profile/profile.jpg'}
              alt="About image"
              className="absolute inset-0 object-cover w-full h-full bg-fg-muted transition-opacity duration-700 group-hover/duck:opacity-0"
            />
          </div>
          <div className="absolute z-50 -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/duck:opacity-100 transition-all duration-300 pointer-events-none scale-95 group-hover/duck:scale-100">
            <div className="bg-surface text-fg text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap ">
              <p>저는 커피☕와 사진 📸을 좋아하는 개발자입니다~</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-surface border-r border-b border-hairline rotate-45"></div>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-fg">
              About Me
            </h2>
            <div className="h-1 w-20 bg-fg rounded-full"></div>
          </div>
          <p className="text-fg text-base leading-relaxed">
            Software Engineer로서 React, TypeScript를 주로 사용합니다. 항상
            확장성에 대해서 고민하고, 성능 최적화에 관심이 많으며, 지속적인
            학습과 성장을 추구합니다.
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href={githubLink}
              target={'_blank'}
              className="p-3 rounded-full bg-surface shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
              title="Github"
            >
              <FaGithub className="w-6 h-6 text-fg" />
            </a>
            <a
              href={linkedinLink}
              target={'_blank'}
              className="p-3 rounded-full bg-surface shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
              title="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6 text-fg" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
