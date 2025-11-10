import Link from 'next/link';

const MoreExplore = () => {
  return (
    <section className={'w-full flex justify-center'}>
      <Link
        href={'/posts'}
        className={
          'px-4 py-1 bg-overlay text-overlay rounded-md hover:bg-opacity-70 hover:shadow-lg transition '
        }
      >
        더 많은 글 보러가기
      </Link>
    </section>
  );
};

export default MoreExplore;
