import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

interface PostsGridSkeletonProps {
  gridCount: number;
}

const PostsGridSkeleton = ({ gridCount }: PostsGridSkeletonProps) => {
  return Array.from({ length: gridCount }, (_, index) => (
    <li className="block" key={index}>
      <PostPreviewSkeleton />
    </li>
  ));
};

const PostPreviewSkeleton = () => {
  const lightStyle = `bg-surface text-fg `;
  const darkStyle = `    `;

  return (
    <div className="block mx-auto">
      <div
        className={`w-full h-full post-preview p-px rounded-2xl transition-all duration-500 shadow-lg overflow-hidden ${lightStyle} ${darkStyle}`}
      >
        <div className="image-container rounded-t-2xl overflow-hidden h-1/2 flex justify-center relative">
          <Skeleton
            useCustomBackground
            className="w-full h-full !rounded-none bg-raised"
          />
        </div>
        <div className="h-1/2 flex flex-col justify-between gap-4 p-4">
          <div>
            <Skeleton
              useCustomBackground
              className="h-6 w-3/4 mb-2 bg-raised"
            />
            <Skeleton
              useCustomBackground
              className="h-4 w-full bg-raised"
            />
          </div>
          <div className="inline-flex items-center justify-between w-full text-sm">
            <div className="flex items-center space-x-2">
              <Skeleton
                useCustomBackground
                className="w-8 h-8 rounded-full bg-raised"
              />
              <Skeleton
                useCustomBackground
                className="h-3 w-16 bg-raised"
              />
            </div>
            <Skeleton
              useCustomBackground
              className="h-3 w-20 bg-raised"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsGridSkeleton;
