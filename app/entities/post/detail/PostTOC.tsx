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

  const renderEmoji = (type: number) => {
    switch (type) {
      case 1:
        return '🌲';
      case 2:
        return '🪓';
      case 3:
        return '🪵';
      default:
        return '🪵';
    }
  };

  return (
    <div className="fixed post-toc hidden 2xl:block w-[300px] top-40 right-20 ml-16  transition-all  text-sm bg-gray-100/80 rounded-md p-4 text-black z-[2]">
      <h4 className={'text-xl font-bold mb-2'}>📌 Table of Contents</h4>
      <ul className={'list-none'}>
        {parseHeadings(postContent).map((heading) => {
          const href =
            `#${heading.id
              .toLowerCase()
              .replaceAll('.', '')
              .replaceAll(/[^a-zA-Z0-9가-힣]/g, '-')
              .replaceAll(/-+/g, '-')
              .replaceAll(/^-|-$/g, '')}` || '';
          return (
            <li
              key={heading.id}
              style={{ marginLeft: `${(heading.type - 1) * 16}px` }}
              className={`${heading.type === 1 ? 'font-bold mb-1' : ''} `}
            >
              <Link
                scroll={true}
                className={
                  'p-1  transition-all hover:bg-green-50 rounded-md  overflow-x-hidden scroll-smooth '
                }
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(href)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }}
                href={`#${heading.id
                  .toLowerCase()
                  .replaceAll('.', '')
                  .replaceAll(/[^a-zA-Z0-9가-힣]/g, '-')
                  .replaceAll(/-+/g, '-')
                  .replaceAll(/^-|-$/g, '')}`}
              >
                {renderEmoji(heading.type) + ' ' + heading.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PostTOC;
