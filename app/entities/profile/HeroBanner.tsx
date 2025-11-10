import Image from 'next/image';
import DecryptedText from '../bits/DecryptedText';

const HeroBanner = () => {
  return (
    <section className="grid gap-4">
      <div className="relative h-80 md:h-96 w-full overflow-hidden rounded-2xl shadow-2xl group">
        <Image
          src={'/images/profile/sky.JPG'}
          priority={true}
          width={'1024'}
          height={'720'}
          alt="Hero image"
          loading={'eager'}
          className="object-cover bg-gray-100 w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
        <div className="absolute top-0 left-0 p-8 md:p-12 w-full h-full flex flex-col gap-3 text-white">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <DecryptedText
                text="Frontend Developer"
                speed={60}
                animateOn="view"
                revealDirection="start"
                sequential
                encryptedClassName="text-neutral-200/90"
              />
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90">
              Jeongwoo Seo
            </p>
          </div>
          <div className="flex flex-col justify-end flex-grow">
            <div className="flex flex-wrap gap-3 text-sm md:text-base font-medium">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                React
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                NextJS
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                TypeScript
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-lg md:text-xl text-default max-w-3xl mx-auto text-center mt-4">
        안녕하세요, 서정우입니다.
      </p>
      <p className="text-lg md:text-xl text-default max-w-3xl mx-auto text-center mb-4">
        깔끔한 코드 작성에 중점을 두고, 확장성에 대해 고민하며 멈추지 않는
        기술의 변화를 즐깁니다.
      </p>
    </section>
  );
};

export default HeroBanner;
