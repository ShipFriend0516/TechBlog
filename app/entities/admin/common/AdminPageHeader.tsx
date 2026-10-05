import Link from 'next/link';
import { ReactNode } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

interface AdminPageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  // 대시보드로 돌아가는 링크 노출 여부 (대시보드 자체에서는 숨김)
  showBackLink?: boolean;
  // 제목·설명을 화면에서 숨기고 h1 은 스크린 리더용으로만 남김 (글쓰기처럼 작업 화면)
  hideTitle?: boolean;
}

const AdminPageHeader = ({
  title,
  description,
  actions,
  showBackLink = true,
  hideTitle = false,
}: AdminPageHeaderProps) => {
  if (hideTitle) {
    return (
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="sr-only">{title}</h1>
        {showBackLink ? (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors"
          >
            <FiArrowLeft size={16} />
            대시보드
          </Link>
        ) : (
          <span />
        )}
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
    );
  }

  return (
    <header className="mb-8">
      {showBackLink && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors mb-3"
        >
          <FiArrowLeft size={16} />
          대시보드
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-fg-muted mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export default AdminPageHeader;
