import Link from 'next/link';

interface SeriesDropdownItemProps {
  setSeriesOpen: (open: boolean) => void;
  seriesTitle: string;
  seriesCount: number;
}
const SeriesDropdownItem = ({
  seriesTitle,
  seriesCount,
  setSeriesOpen,
}: SeriesDropdownItemProps) => {
  return (
    <Link
      href="#"
      className="block px-4 py-3 hover:bg-overlay-200 transition-colors"
      onClick={() => setSeriesOpen(false)}
    >
      <div className="font-medium">{seriesTitle}</div>
      <div className="text-sm text-gray-500">{seriesCount}개의 포스트</div>
    </Link>
  );
};
export default SeriesDropdownItem;