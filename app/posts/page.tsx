import PostSearchClient from '@/app/entities/post/list/PostSearchClient';
import { getPostList, getSeriesList } from '@/app/entities/post/list/queries';
import { getTagStats } from '@/app/lib/tags';

const ITEMS_PER_PAGE = 12;
// 필터 바에 노출할 인기 태그 수
const TAG_FILTER_LIMIT = 20;

interface PageProps {
  searchParams: Promise<{
    query?: string;
    series?: string;
    tag?: string;
    page?: string;
  }>;
}

// 서버 컴포넌트: searchParams로 URL 파라미터 수신 후 DB 직접 조회
const BlogList = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const seriesSlug = params.series || '';
  const tag = params.tag || '';
  const initialQuery = params.query || '';

  const [{ posts, totalPosts }, series, tagStats] = await Promise.all([
    getPostList({
      query: initialQuery,
      series: seriesSlug,
      tag,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }),
    getSeriesList(),
    getTagStats(),
  ]);

  return (
    <section>
      <header className={'max-w-6xl mx-auto px-4 mt-8 text-center'}>
        <h1 className={'text-4xl font-bold'}>발행된 글</h1>
        <p className={'mt-3 text-fg-soft'}>
          검색어, 시리즈, 태그를 조합해 원하는 글을 찾아보세요.
        </p>
      </header>
      <PostSearchClient
        key={`${seriesSlug}-${tag}`}
        initialQuery={initialQuery}
        series={series}
        tags={tagStats.slice(0, TAG_FILTER_LIMIT)}
        searchSeries={seriesSlug}
        searchTag={tag}
        initialPosts={posts}
        totalPosts={totalPosts}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </section>
  );
};

export default BlogList;
