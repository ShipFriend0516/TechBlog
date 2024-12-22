'use client';
import { useEffect, useRef, useState } from 'react';
import { FaBook, FaSearch } from 'react-icons/fa';
import { BiChevronDown } from 'react-icons/bi';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import SeriesDropdownItem from '@/app/entities/post/series/SeriesDropdownItem';

const SearchSection = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <nav className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-6">
          {/* 시리즈 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setSeriesOpen(!seriesOpen)}
              className="flex items-center space-x-2 hover:text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <FaBook size={20} />
              <span>시리즈</span>
              <BiChevronDown
                size={16}
                className={`transform transition-transform ${seriesOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* 시리즈 드롭다운 메뉴 */}
            {seriesOpen && (
              <div className="bg-overlay absolute left-0 mt-2 w-64 z-50 text-overlay">
                <div className="py-2">
                  <SeriesDropdownItem
                    setSeriesOpen={setSeriesOpen}
                    seriesTitle={'Next.js 최적화'}
                    seriesCount={3}
                  />
                  <SeriesDropdownItem
                    setSeriesOpen={setSeriesOpen}
                    seriesTitle={'블로그 개발기'}
                    seriesCount={5}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 검색 버튼 및 검색창 */}
        <div className="relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaSearch size={20} />
          </button>

          {/* 검색 오버레이 */}
          {searchOpen && (
            <Overlay setOverlayOpen={setSearchOpen}>
              <div className="px-5 p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <FaSearch size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    className="w-full p-2 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    ESC
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-gray-500">최근 검색어</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      Next.js
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      최적화
                    </span>
                  </div>
                </div>
              </div>
            </Overlay>
          )}
        </div>
      </nav>
    </div>
  );
};
export default SearchSection;
