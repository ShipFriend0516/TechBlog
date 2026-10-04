import Link from 'next/link';
import { ReactNode } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

interface AdminPageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  // 대시보드로 돌아가는 링크 노출 여부 (대시보드 자체에서는 숨김)
  showBackLink?: boolean;
}

const AdminPageHeader = ({
  title,
  description,
  actions,
  showBackLink = true,
}: AdminPageHeaderProps) => {
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
