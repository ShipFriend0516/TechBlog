interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  useCustomBackground?: boolean; // 커스텀 배경색 사용 여부
}

const Skeleton = ({
  className,
  children,
  useCustomBackground = false,
}: SkeletonProps) => {
  const bgColorClass = useCustomBackground
    ? ''
    : 'bg-gray-200/80 dark:bg-neutral-700/80';

  return (
    <div
      className={`animate-pulse rounded duration-100 ${bgColorClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Skeleton;
