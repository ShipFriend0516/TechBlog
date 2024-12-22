'use client';
import { ChangeEvent, useState } from 'react';
import { FaBook, FaSearch } from 'react-icons/fa';
import { BiChevronDown } from 'react-icons/bi';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import SeriesDropdownItem from '@/app/entities/post/series/SeriesDropdownItem';
import Tag from '@/app/entities/common/Tag';
import SearchOverlayContainer from '@/app/entities/common/Overlay/Search/SearchOverlayContainer';

interface SearchSectionProps {
  query: string;
  setQuery: (query: string) => void;
}

const SearchSection = ({ query, setQuery }: SearchSectionProps) => {
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
              <SearchOverlayContainer
                setQuery={setQuery}
                value={query}
                onCancel={() => setSearchOpen(false)}
                tags={['Next.js', 'React', 'TypeScript', 'Tailwind CSS']}
              />
            </Overlay>
          )}
        </div>
      </nav>
    </div>
  );
};
export default SearchSection;
