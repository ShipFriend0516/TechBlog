'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  path?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  path,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 현재 경로 (path가 제공되지 않은 경우 현재 pathname 사용)
  const basePath = path || pathname;

  // 페이지 번호 배열 생성 (최대 5개 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];

    // 시작 페이지와 끝 페이지 계산
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // 페이지 범위 조정 (항상 5개 페이지를 표시하도록)
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    // 페이지 번호 생성
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // 페이지 URL 생성 함수
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${basePath}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null; // 페이지가 1개 이하면 페이지네이션 표시하지 않음
  }

  return (
    <nav className="flex justify-center mt-12 mb-4">
      <ul className="flex items-center gap-1">
        {/* 처음 페이지 버튼 */}
        <li>
          <Link
            href={createPageUrl(1)}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => currentPage === 1 && e.preventDefault()}
          >
            <span className="sr-only">처음 페이지</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M9.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </li>

        {/* 이전 페이지 버튼 */}
        <li>
          <Link
            href={createPageUrl(currentPage - 1)}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => currentPage === 1 && e.preventDefault()}
          >
            <span className="sr-only">이전 페이지</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </li>

        {/* 페이지 번호 */}
        {getPageNumbers().map((pageNumber) => (
          <li key={pageNumber}>
            <Link
              href={createPageUrl(pageNumber)}
              className={`flex items-center justify-center w-10 h-10 rounded-md ${
                pageNumber === currentPage
                  ? 'bg-emerald-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {pageNumber}
            </Link>
          </li>
        ))}

        {/* 다음 페이지 버튼 */}
        <li>
          <Link
            href={createPageUrl(currentPage + 1)}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => currentPage === totalPages && e.preventDefault()}
          >
            <span className="sr-only">다음 페이지</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </li>

        {/* 마지막 페이지 버튼 */}
        <li>
          <Link
            href={createPageUrl(totalPages)}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => currentPage === totalPages && e.preventDefault()}
          >
            <span className="sr-only">마지막 페이지</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
