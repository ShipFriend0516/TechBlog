import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import SectionHeader from '@/app/entities/home/SectionHeader';
import { githubLink, linkedinLink } from '@/app/lib/constants/landingPageData';
import { formatDate } from '@/app/lib/utils/format';
import { NowData } from '@/app/types/Home';

const MeSection = ({ now }: { now: NowData }) => (
  <section>
    <SectionHeader eyebrow="About" title="이 글을 쓰는 사람" />
    <div className="grid md:grid-cols-2 gap-5">
      <div className="rounded-[20px] bg-surface p-6 md:p-8 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Image
            src="/images/profile/profile.jpg"
            alt="서정우 프로필 사진"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-bold">서정우</p>
            <p className="text-sm text-fg-muted">
              Software Engineer · CJ올리브영 AI플랫폼
            </p>
          </div>
        </div>
        <p className="text-fg-soft leading-7">
          문제의 레이어를 가리지 않는 사람이 되려 합니다. 확장성과 성능 최적화를
          고민하고, 배운 것을 기록으로 남깁니다.
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2">
            <a
              href={githubLink}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="p-2.5 rounded-xl bg-raised text-fg-soft hover:text-accent transition-colors"
            >
              <FaGithub size={18} />
            </a>
            <a
              href={linkedinLink}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-xl bg-raised text-fg-soft hover:text-accent transition-colors"
            >
              <FaLinkedin size={18} />
            </a>
          </div>
          <Link
            href="/about"
            className="text-sm font-medium text-accent hover:text-accent-strong transition-colors"
          >
            자세히 보기 →
          </Link>
        </div>
      </div>

      <div className="rounded-[20px] p-6 md:p-8 bg-surface bg-gradient-to-br from-nebula-subtle to-transparent">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-nebula-soft">Now</p>
          {now.updatedAt && (
            <p className="text-xs text-fg-muted">
              {formatDate(new Date(now.updatedAt).getTime())} 업데이트
            </p>
          )}
        </div>
        {now.items.length > 0 ? (
          <dl className="mt-5 flex flex-col gap-4">
            {now.items.map((item) => (
              <div key={item.label} className="grid grid-cols-[72px_1fr] gap-3">
                <dt className="text-sm text-fg-muted">{item.label}</dt>
                <dd className="text-fg leading-6 break-keep">{item.text}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-5 text-fg-muted">요즘 하는 일을 정리하고 있어요.</p>
        )}
      </div>
    </div>
  </section>
);

export default MeSection;
