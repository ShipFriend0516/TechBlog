interface PageHeaderProps {
  eyebrow: string;
  title: string;
  className?: string;
}

// 목록 페이지 상단 제목 — 홈 섹션 헤더와 같은 톤, 페이지의 h1 역할
const PageHeader = ({ eyebrow, title, className = '' }: PageHeaderProps) => (
  <header className={className}>
    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
      {eyebrow}
    </p>
    <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
      {title}
    </h1>
  </header>
);

export default PageHeader;
