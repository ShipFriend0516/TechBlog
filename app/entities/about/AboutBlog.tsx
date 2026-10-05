import SectionHeader from '@/app/entities/home/SectionHeader';

// 블로그 디자인을 이루는 좋아하는 것들 — 디자인 토큰 색을 그대로 보여줌
const FAVORITES = [
  { label: '우주', swatch: 'bg-base ring-1 ring-inset ring-hairline' },
  { label: '성운', swatch: 'bg-nebula' },
  { label: '초록', swatch: 'bg-accent' },
];

const AboutBlog = () => (
  <section>
    <SectionHeader eyebrow="This Blog" title="좋아하는 것들로 만든 공간" />
    <div className="rounded-card bg-surface bg-gradient-to-br from-nebula-subtle to-transparent p-6 md:p-8">
      <p className="max-w-2xl text-fg-soft leading-8 break-keep">
        저는 우주와 미니멀한 것, 그리고 초록색을 좋아합니다. 그래서 이
        블로그도 좋아하는 것들로 구성해 봤습니다. 깊은 밤하늘 같은 배경 위에
        에메랄드빛 하나, 꼭 필요한 것만 남기려고 했습니다.
      </p>
      <ul className="mt-6 flex flex-wrap gap-5">
        {FAVORITES.map(({ label, swatch }) => (
          <li key={label} className="flex items-center gap-2 text-sm text-fg-muted">
            <span aria-hidden className={`h-3.5 w-3.5 rounded-full ${swatch}`} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default AboutBlog;
