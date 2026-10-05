import Image from 'next/image';
import { SOCIAL_LINKS } from '@/app/lib/constants/socialLinks';

const PROFILE_LINKS = [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin];

const AboutIntro = () => (
  <section className="grid md:grid-cols-[auto_1fr] items-center gap-8 md:gap-12">
    {/* 호버하면 사진이 오리로 바뀌는 기존 장치 유지 */}
    <div className="group/duck relative h-36 w-36 md:h-44 md:w-44 shrink-0 overflow-hidden rounded-full bg-raised">
      <Image
        src="/images/profile/darkDuck.png"
        alt=""
        fill
        sizes="176px"
        className="object-cover"
      />
      <Image
        src="/images/profile/profile.jpg"
        alt="서정우 프로필 사진"
        fill
        sizes="176px"
        priority
        className="object-cover transition-opacity duration-700 group-hover/duck:opacity-0"
      />
    </div>
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-nebula-soft">
        About
      </p>
      <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight break-keep">
        안녕하세요, <span className="text-accent">서정우</span>입니다.
      </h1>
      <p className="mt-5 max-w-2xl text-fg-soft leading-8 break-keep">
        Software Engineer로서 문제의 레이어를 가리지 않는 사람이 되려 합니다.
        항상 확장성에 대해 고민하고, 성능 최적화에 관심이 많으며, 지속적인
        학습과 성장을 추구합니다.
      </p>
      <div className="mt-6 flex gap-2">
        {PROFILE_LINKS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm text-fg-soft transition-colors hover:bg-raised hover:text-accent"
          >
            <Icon size={16} />
            {label}
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default AboutIntro;
