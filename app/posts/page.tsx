import PostSearchClient from '@/app/entities/post/list/PostSearchClient';
import { getPostList, getSeriesList } from '@/app/entities/post/list/queries';

const ITEMS_PER_PAGE = 12;

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

  const [{ posts, totalPosts }, series] = await Promise.all([
    getPostList({
      query: initialQuery,
      series: seriesSlug,
      tag,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }),
    getSeriesList(),
  ]);

  return (
    <section>
      <h1 className={'text-4xl text-center font-bold mt-8'}>발행된 글</h1>
      <PostSearchClient
        key={`${seriesSlug}-${tag}-${currentPage}`}
        initialQuery={initialQuery}
        series={series}
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
