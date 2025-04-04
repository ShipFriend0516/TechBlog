'use client';
import { useEffect, useState } from 'react';
import { FaBook, FaSearch } from 'react-icons/fa';
import { BiChevronDown } from 'react-icons/bi';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import SeriesDropdownItem from '@/app/entities/series/SeriesDropdownItem';
import SearchOverlayContainer from '@/app/entities/common/Overlay/Search/SearchOverlayContainer';
import useSearchQueryStore from '@/app/stores/useSearchQueryStore';
import { getAllSeriesData } from '@/app/entities/series/api/series';
import { Series } from '@/app/types/Series';
import { RiRestartLine } from 'react-icons/ri';

interface SearchSectionProps {
  query: string;
  setQuery: (query: string) => void;
  resetSearchCondition: () => void;
  searchSeries: string;
}

const SearchSection = ({
  query,
  setQuery,
  resetSearchCondition,
  searchSeries,
}: SearchSectionProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);
  const latest = useSearchQueryStore((state) => state.latestSearchQueries);
  const [series, setSeries] = useState<Series[] | null>([]);

  const getSeries = async () => {
    const data = await getAllSeriesData();
    setSeries(data);
  };

  useEffect(() => {
    getSeries();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {seriesOpen && (
        <div
          className={
            'fixed top-0 left-0 w-screen h-screen z-40 bg-neutral-800/10'
          }
          onClick={() => setSeriesOpen(false)}
        ></div>
      )}
      <nav className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-6">
          {/* 시리즈 드롭다운 */}
          <div className="relative ">
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
                  {series?.map((s) => (
                    <SeriesDropdownItem
                      key={s.slug}
                      setSeriesOpen={setSeriesOpen}
                      seriesSlug={s.slug}
                      seriesTitle={s.title}
                      seriesCount={s.posts.length || 0}
                    />
                  ))}
                  {series?.length === 0 && (
                    <div className={'p-2'}>시리즈가 없습니다.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 검색 버튼 및 검색창 */}
        <div className={'flex items-center'}>
          {(query || searchSeries) && (
            <div
              className={
                'bg-neutral-600  rounded-lg px-2 text-sm py-0.5 text-white'
              }
            >
              {searchSeries && (
                <span>
                  <b>{searchSeries} </b> 시리즈에서{' '}
                </span>
              )}
              <span>
                <b>{query ? query : '전체'}</b>로 검색 중...
              </span>
            </div>
          )}
          <button
            onClick={resetSearchCondition}
            className="p-2 hover:bg-gray-100 hover:text-black rounded-full transition-colors"
            aria-label="검색 초기화"
          >
            <RiRestartLine size={20} />
          </button>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-gray-100 hover:text-black rounded-full transition-colors"
            aria-label="검색 오버레이 열기 버튼"
          >
            <FaSearch size={20} />
          </button>

          {/* 검색 오버레이 */}
          <Overlay overlayOpen={searchOpen} setOverlayOpen={setSearchOpen}>
            <SearchOverlayContainer
              setQuery={setQuery}
              value={query}
              onCancel={() => setSearchOpen(false)}
              tags={latest || []}
            />
          </Overlay>
        </div>
      </nav>
    </div>
  );
};
export default SearchSection;
