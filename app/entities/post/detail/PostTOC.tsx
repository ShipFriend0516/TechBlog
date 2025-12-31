'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaTree } from 'react-icons/fa';
import { FaBookBible, FaX } from 'react-icons/fa6';
import { GiLog } from 'react-icons/gi';
import { MdPushPin } from 'react-icons/md';
import { PiAxeFill } from 'react-icons/pi';

const PostTOC = ({ postContent }: { postContent: string }) => {
  const [activeId, setActiveId] = useState('');
  const [isTOCVisible, setIsTOCVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [tocPosition, setTocPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  const parseHeadings = (content: string) => {
    const headings = content.match(/#{1,6} .+/g);

    return (headings ?? []).map((heading: string) => {
      const title = heading.replace(/#/g, '').trim();
      const id = title
        .toLowerCase()
        .replaceAll('.', '')
        .replaceAll(/[^a-zA-Z0-9가-힣]/g, '-')
        .replaceAll(/-+/g, '-');

      return {
        id,
        type: heading.lastIndexOf('#') + 1,
        title,
      };
    });
  };

  useEffect(() => {
    const headings = parseHeadings(postContent);

    // 포스트 본문 요소 찾기
    const postBody = document.querySelector('.post-body');

    // 모바일 체크
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      // 스크롤 상태 업데이트
      setIsScrolled(window.scrollY > 150);

      // TOC 위치 계산
      if (postBody) {
        const rect = postBody.getBoundingClientRect();
        // 본문이 뷰포트 내에 있을 때만 TOC 표시
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          // 본문의 오른쪽 가장자리를 기준으로 TOC 위치 설정
          // top 위치는 스크롤 위치에 따라 조정 (최소 40px 유지)
          const newTop = Math.max(40, 150 - rect.top);
          setTocPosition(newTop);
        }
      }

      // 활성 헤딩 찾기
      const scrollPosition = window.scrollY + 150;
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll(); // 초기 로드 시 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, [postContent]);

  const renderEmoji = (type: number) => {
    switch (type) {
      case 1:
        return <FaTree />;
      case 2:
        return <PiAxeFill />;
      case 3:
        return <GiLog />;
      default:
        return <GiLog />;
    }
  };

  const headings = parseHeadings(postContent);

  if (headings.length === 0) return null;

  return (
    <>
      {/* 모바일용 토글 버튼 */}
      <button
        className="fixed bottom-4 right-4 md:hidden bg-primary-dark text-white p-4 rounded-full shadow-lg z-10"
        onClick={() => setIsTOCVisible(!isTOCVisible)}
        aria-label="목차 열기/닫기"
      >
        {isTOCVisible ? <FaX /> : <FaBookBible />}
      </button>

      <div
        className={`
          post-toc text-sm border dark:border-gray-100/30
          transition-all duration-300
          ${isScrolled ? 'bg-gray-100/80 dark:bg-neutral-700/80 md:bg-gray-100/35 md:dark:bg-neutral-700/35 shadow-md' : 'bg-gray-100/80 dark:bg-neutral-700/80'}
          rounded-md p-4 text-black dark:text-white z-[2]
          
          fixed bottom-0 left-0 right-0 max-h-[50vh] md:max-h-none
          overflow-y-auto
          transform ${isTOCVisible ? 'translate-y-0' : 'translate-y-full'}
          md:transform-none
          
          md:hidden 2xl:block
          2xl:absolute 2xl:w-[300px] 2xl:top-[100px] 2xl:left-auto
          2xl:right-[-350px] 2xl:transform-none 2xl:h-fit
        `}
        style={{
          top: !isMobile ? `${tocPosition}px` : 'auto',
        }}
      >
        <h4
          className={`inline-flex items-center gap-1 text-lg font-bold mb-2  `}
        >
          <MdPushPin size={24} color="red" />
          Table of Contents
        </h4>
        <ul
          className={`list-none transition-all duration-300 overflow-hidden  `}
        >
          {headings.map((heading) => {
            const isActive = heading.id === activeId;
            return (
              <li
                key={heading.id}
                style={{ marginLeft: `${(heading.type - 1) * 12}px` }}
                className={`${heading.type === 1 ? 'font-bold mb-1' : ''}`}
              >
                <Link
                  scroll={false}
                  className={`
                    p-1 flex gap-1 transition-all 
                    ${
                      isActive
                        ? 'border-l-4 rounded-none border-primary-bangladesh  text-primary-rich dark:text-primary-caribbean'
                        : ' hover:border-b hover:rounded-none hover:text-green-800   dark:hover:text-white'
                    } 
                    rounded-md overflow-hidden whitespace-nowrap text-ellipsis transition-transform hover:scale-105 duration-300 hover:z-30
                  `}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                    // 모바일에서는 클릭 후 TOC 닫기
                    if (window.innerWidth < 768) {
                      setIsTOCVisible(false);
                    }
                  }}
                  href={`#${heading.id}`}
                >
                  <span className={'text-lg leading-3'}>
                    {renderEmoji(heading.type)}
                  </span>
                  {heading.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default PostTOC;
