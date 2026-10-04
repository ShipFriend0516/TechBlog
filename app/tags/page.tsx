import TagCloud from '@/app/entities/tag/TagCloud';
import { getTagStats } from '@/app/lib/tags';
import { TagData } from '@/app/types/Tag';

export const revalidate = 300;

const TagsPage = async () => {
  let tags: TagData[] = [];
  let failed = false;

  try {
    tags = await getTagStats();
  } catch (error) {
    failed = true;
    console.error('Failed to fetch tags:', error);
  }

  return (
    <section className="w-full p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mt-4 text-center">태그</h1>
      <p className="text-base sm:text-lg text-fg-soft mb-6 sm:mb-8 text-center">
        블로그에서 사용된 태그들을 빠르게 탐색할 수 있습니다.
      </p>

      <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] relative">
        {failed ? (
          <div className="flex flex-col justify-center items-center h-[400px] text-center">
            <p className="text-danger text-lg">
              ⚠️ 태그 목록을 불러오는데 실패했습니다
            </p>
            <p className="text-fg-soft mt-2">잠시 후 새로고침해 주세요.</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="flex justify-center items-center h-[400px] text-fg-soft">
            <p className="text-lg">아직 태그가 없습니다</p>
          </div>
        ) : (
          <TagCloud tags={tags} />
        )}
      </div>
    </section>
  );
};

export default TagsPage;
