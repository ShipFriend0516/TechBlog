import PageHeader from '@/app/entities/common/PageHeader';
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
      {/* 글 개수와 적용된 필터는 아래 결과 줄에서 보여줌 */}
      <PageHeader
        eyebrow="Blog"
        title="모든 글"
        className="max-w-6xl mx-auto px-4 mt-10"
      />
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
