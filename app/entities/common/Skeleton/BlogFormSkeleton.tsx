import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

const BlogFormSkeleton = () => {
  return (
    <div className={'px-16'}>
      <h1 className={'text-2xl text-center mb-4'}>
        <Skeleton className="h-8 w-32 mx-auto" />
      </h1>
      <div className="mb-6">
        <div className="flex mb-4 gap-1 items-center">
          <span className="font-bold text-default flex-shrink-0">
            <Skeleton className="h-8 w-20" />
          </span>
          <Skeleton className="h-8 flex-grow" />
        </div>
        <div className="flex mb-4 gap-1 items-center">
          <span className="font-bold text-default flex-shrink-0">
            <Skeleton className="h-8 w-20" />
          </span>
          <Skeleton className="h-8 flex-grow" />
        </div>
        <div className="flex justify-start items-center">
          <div className="flex flex-wrap mb-4 gap-1 items-center">
            <span className="w-12 font-bold mr-3 flex-shrink text-nowrap flex-nowrap">
              <Skeleton className="h-8 w-16" />
            </span>
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
        <div className="flex items-center w-full gap-2 mb-4">
          <div className="w-1/2 flex justify-start items-center gap-6">
            <div className="inline-flex items-center text-nowrap gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>
      <div className="mb-4">
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
      <div className="mb-4">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
};

export default BlogFormSkeleton;
