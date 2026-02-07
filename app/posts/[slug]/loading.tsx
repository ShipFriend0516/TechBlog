import SVGLoadingSpinner from '@/app/entities/common/Loading/SVGLoadingSpinner';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <SVGLoadingSpinner />
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        글을 불러오는 중...
      </p>
    </div>
  );
}
