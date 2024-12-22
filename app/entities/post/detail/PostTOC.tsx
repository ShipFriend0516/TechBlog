import Link from 'next/link';

const PostTOC = ({ postContent }: { postContent: string }) => {
  const parseHeadings = (content: string) => {
    const headings = content.match(/#{1,6} .+/g);

    return (headings ?? []).map((heading: string) => ({
      id: heading.replace(/#/g, '').trim(),
      type: heading.lastIndexOf('#') + 1,
      title: heading.replace(/#/g, '').trim(),
    }));
  };

  // fixed 계산
  // 화면 너비 1000px 기준으로 계산
  // toc 크기 280px
  // post 영역 768px

  return (
    <div className="fixed post-toc hidden lg:block w-[280px] top-1/2 -translate-y-1/2 left-[calc(50%+524px)]  transition-all  text-sm bg-gray-100/80 rounded-md p-4 text-black">
      <h4 className={'text-xl font-bold'}>📌 Table of Contents</h4>
      <ul className={'list-none'}>
        {parseHeadings(postContent).map((heading) => {
          console.log(heading);
          return (
            <li
              key={heading.id}
              style={{ marginLeft: `${(heading.type - 1) * 16}px` }}
              className={`${heading.type === 1 ? 'font-bold' : ''} `}
            >
              <Link
                className={
                  'p-1  transition-all hover:bg-green-50 rounded-md text-nowrap overflow-x-hidden'
                }
                href={`#${heading.id
                  .toLowerCase()
                  .replace(/[^a-zA-Z0-9가-힣]/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '')}`}
              >
                {'∟ ' + heading.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PostTOC;
