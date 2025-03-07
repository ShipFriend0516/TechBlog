interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={`${className} bg-gray-300/80 animate-pulse rounded-lg duration-100`}
    ></div>
  );
};

export default Skeleton;
