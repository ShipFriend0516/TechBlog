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
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>
        <div className="h-1 w-24 bg-neutral-900 dark:bg-neutral-100 rounded-full" />
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="relative flex items-center gap-2 px-4 py-1 rounded-t-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors before:absolute before:inset-0 before:border-b-2 before:border-neutral-600 dark:before:border-neutral-300 before:origin-center before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300"
        >
          <FaArrowRight size={12} />
          {viewAllLabel}
          {viewAllCount !== undefined && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-500 dark:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-bold">
              {viewAllCount}
            </span>
          )}
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
