import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';

interface SectionHeadingProps {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  viewAllCount?: number;
}

const SectionHeading = ({
  title,
  viewAllHref,
  viewAllLabel = '전체 보기',
  viewAllCount,
}: SectionHeadingProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-fg">
          {title}
        </h2>
        <div className="h-1 w-24 bg-fg rounded-full" />
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="relative flex items-center gap-2 px-4 py-1 rounded-t-xl text-sm font-medium text-fg hover:bg-raised transition-colors before:absolute before:inset-0 before:border-b-2 before:border-hairline before:origin-center before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300"
        >
          <FaArrowRight size={12} />
          {viewAllLabel}
          {viewAllCount !== undefined && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-fg-muted text-base text-xs font-bold">
              {viewAllCount}
            </span>
          )}
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
