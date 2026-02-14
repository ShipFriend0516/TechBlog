import Image from 'next/image';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { githubLink, linkedinLink } from '@/app/lib/constants/landingPageData';

const AboutMe = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl from-primary-caribbean to-gray-100 dark:from-primary-bangladesh dark:to-primary-dark p-6 md:p-10">
      <div className="grid md:grid-cols-[1fr,2fr] gap-8 md:gap-12 items-center">
        <div className="relative mx-auto md:mx-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full blur opacity-20 animate-pulse"></div>
          <div className="relative h-44 w-44 overflow-hidden rounded-full ring-4 ring-white dark:ring-gray-400 shadow-xl group">
            <Image
              width={500}
              height={400}
              priority={true}
              src={'/images/profile/darkDuck.png'}
              alt="Background image"
              className="object-cover w-full h-full bg-gray-500"
            />
            <Image
              width={500}
              height={400}
              priority={true}
              src={'/images/profile/profile.jpg'}
              alt="About image"
              className="absolute inset-0 object-cover w-full h-full bg-gray-500 transition-opacity duration-700 group-hover:opacity-0"
            />
          </div>
        </div>
        <div className="grid gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              About Me
            </h2>
            <div className="h-1 w-20 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
          </div>
          <p className="text-default text-base leading-relaxed">
            Software Engineer로서 React, TypeScript를 주로 사용합니다. 항상
            확장성에 대해서 고민하고, 성능 최적화에 관심이 많으며, 지속적인
            학습과 성장을 추구합니다.
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href={githubLink}
              target={'_blank'}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
            >
              <FaGithub className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href={linkedinLink}
              target={'_blank'}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
            >
              <FaLinkedin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
