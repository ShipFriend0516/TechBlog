import Link from 'next/link';

const PostTOC = ({ postContent }: { postContent: string }) => {
  const parseHeadings = (content: string) => {
    // content에는 # 제목이 포함된 문자열이 들어옵니다.
    // 샵의 개수와 제목을 추출해서 배열로 만들어주세요.
    // ex) content = '# 제목1\n## 제목2\n### 제목3'
    // return [{ id: '제목1', title: '제목1' }, { id: '제목2', title: '제목2' }, { id: '제목3', title: '제목3' }]

    const headings = content.match(/#{1,6} .+/g);
    const result = (headings ?? []).map((heading: string) => ({
      id: heading.replace(/#/g, '').trim(),
      type: heading.lastIndexOf('#') + 1,
      title: heading.replace(/#/g, '').trim(),
    }));
    return result;
  };

  return (
    <div className="post-toc hidden lg:block absolute -right-60 text-sm bg-gray-100/80 rounded-md p-4 text-black">
      <h3>Table of Contents</h3>
      <ul className={'list-none'}>
        {parseHeadings(postContent).map((heading) => {
          return (
            <li
              key={heading.id}
              style={{ marginLeft: `${(heading.type - 1) * 10}px` }}
            >
              <Link href={`#${heading.id}`}>
                {'#'.repeat(heading.type) + ' ' + heading.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PostTOC;
