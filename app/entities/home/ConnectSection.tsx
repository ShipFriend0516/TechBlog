import Image from 'next/image';
import Link from 'next/link';
import NewsletterForm from '@/app/entities/home/NewsletterForm';
import SectionHeader from '@/app/entities/home/SectionHeader';
import { SOCIAL_LINKS } from '@/app/lib/constants/socialLinks';
import { AtelierPreviewMessage } from '@/app/types/Home';

const LINKS = [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.rss];

const ConnectSection = ({ messages }: { messages: AtelierPreviewMessage[] }) => (
  <section>
    <SectionHeader eyebrow="Connect" title="이어지기" />
    <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
      <Link
        href="/atelier"
        className="group card-interactive rounded-card p-6 md:p-8"
      >
        <div className="flex items-baseline justify-between">
          <p className="font-semibold">Atelier</p>
          <span className="text-sm text-fg-muted transition-colors group-hover:text-accent">
            대화에 참여하기 →
          </span>
        </div>
        <p className="mt-1 text-sm text-fg-muted">방문자들이 남긴 이야기</p>
        {messages.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-4">
            {messages.map((message) => (
              <li key={message.id} className="flex gap-3">
                {message.avatarUrl ? (
                  <Image
                    src={message.avatarUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-nebula to-accent opacity-70" />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-fg-muted">
                    {message.nickname}
                    {message.role === 'owner' && (
                      <span className="ml-1.5 text-accent">· 블로그 주인</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-fg-soft line-clamp-2 break-keep">
                    {message.content}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-fg-muted">첫 메시지를 남겨주세요.</p>
        )}
      </Link>

      <div className="flex flex-col gap-5">
        <div className="rounded-card bg-surface p-6 md:p-8">
          <p className="font-semibold">뉴스레터</p>
          <p className="mt-1 mb-5 text-sm text-fg-muted">
            새 글이 올라오면 메일로 알려드려요.
          </p>
          <NewsletterForm />
        </div>
        <div className="flex gap-2">
          {LINKS.map(({ href, label, Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface py-3 text-sm text-fg-soft transition-colors hover:bg-raised hover:text-accent"
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ConnectSection;
