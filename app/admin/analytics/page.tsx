'use client';
import PopularPosts from '@/app/entities/post/list/PopularPosts';

const StatsPage = () => (
  <section className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">블로그 통계</h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <PopularPosts limit={10} />
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-black">통계 요약</h2>
          <p className="text-gray-600">
            가장 인기 있는 게시물의 통계 정보입니다. 조회수를 기준으로
            정렬되었습니다.
          </p>
        </div>
      </div>
    </div>
  </section>
);
export default StatsPage;
