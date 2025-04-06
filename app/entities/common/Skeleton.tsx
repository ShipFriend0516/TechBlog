interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton = ({ className, children }: SkeletonProps) => {
  return (
    <div
      className={`${className} bg-gray-200/80 animate-pulse rounded-lg duration-100`}
    >
      {children}
    </div>
  );
};

export default Skeleton;
