import Link from 'next/link';
import DecryptedText from '@/app/entities/bits/DecryptedText';
import HeroSearch from '@/app/entities/home/HeroSearch';
import TagCloud from '@/app/entities/tag/TagCloud';
import { TagData } from '@/app/types/Tag';

const QUICK_LINKS = [
  { href: '/posts', label: '전체 글' },
  { href: '/series', label: '시리즈' },
  { href: '/tags', label: '태그' },
];

interface HomeHeroProps {
  tags: TagData[];
}

const HomeHero = ({ tags }: HomeHeroProps) => (
  <section className="grid md:grid-cols-[1fr_1.1fr] items-center gap-4 md:gap-8 pt-8 md:pt-16">
    <div className="flex flex-col gap-6">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-nebula-soft">
        ShipFriend TechBlog
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] break-keep">
        <DecryptedText
          text="문제의 레이어를"
          speed={50}
          animateOn="view"
          revealDirection="start"
          sequential
          encryptedClassName="text-fg-faint"
        />
        <br />
        <span className="text-accent">
          <DecryptedText
            text="가리지 않는"
            speed={50}
            animateOn="view"
            revealDirection="start"
            sequential
            encryptedClassName="text-fg-faint"
          />
        </span>{' '}
        개발자
      </h1>
      <p className="text-fg-soft leading-7 max-w-md">
        서정우, Software Engineer. 깔끔한 코드와 확장성을 고민하고, 그 과정을
        이곳에 기록합니다.
      </p>
      <HeroSearch />
      <div className="flex gap-4 text-sm">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-fg-muted hover:text-accent transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
    {tags.length > 0 && (
      <TagCloud tags={tags} className="h-[320px] md:h-[520px]" />
    )}
  </section>
);

export default HomeHero;
