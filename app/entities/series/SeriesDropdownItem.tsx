import Link from 'next/link';

interface SeriesDropdownItemProps {
  seriesSlug: string;
  setSeriesOpen: (open: boolean) => void;
  seriesTitle: string;
  seriesCount: number;
}
const SeriesDropdownItem = ({
  seriesSlug,
  seriesTitle,
  seriesCount,
  setSeriesOpen,
}: SeriesDropdownItemProps) => {
  return (
    <Link
      href={`/posts?series=${seriesSlug}`}
      className="block px-4 py-3 hover:bg-raised transition-colors"
      onClick={() => setSeriesOpen(false)}
    >
      <div className="font-medium">{seriesTitle}</div>
      <div className="text-sm text-fg-muted">{seriesCount}개의 포스트</div>
    </Link>
  );
};
export default SeriesDropdownItem;
