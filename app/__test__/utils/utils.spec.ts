import { Model } from 'mongoose';
import { getThumbnailInMarkdown } from '@/app/lib/utils/parse';
import { createPostSlug, generateUniqueSlug } from '@/app/lib/utils/post';
import type { Post } from '@/app/types/Post';
describe('마크다운에서 이미지 경로 추출 함수 테스트', () => {
  it('마크다운에서 이미지 경로 추출', () => {
    const content = `
      # 제목
      ![이미지](https://example.com/image.png)
    `;
    const thumbnail = getThumbnailInMarkdown(content);
    expect(thumbnail).toBe('https://example.com/image.png');
  });

  it('이미지가 없는 경우 null 반환', () => {
    const content = `
      # 제목
      내용
    `;
    const thumbnail = getThumbnailInMarkdown(content);
    expect(thumbnail).toBeNull();
  });
});

describe('블로그 slug 생성 함수 테스트', () => {
  test('한글 제목을 slug로 변환', () => {
    const title = '한글 제목';
    const slug = createPostSlug(title);
    expect(slug).toBe('한글-제목');
  });

  test('영어 제목을 slug로 변환', () => {
    const title = 'English Title';
    const slug = createPostSlug(title);
    expect(slug).toBe('english-title');
  });

  test('특수문자 제목을 slug로 변환', () => {
    const title = '특수문자!@#제목';
    const slug = createPostSlug(title);
    expect(slug).toBe('특수문자-제목');
  });

  test('마지막 문자가 ?로 끝나는 경우 제거', () => {
    const title = '물음표?';
    const slug = createPostSlug(title);
    expect(slug).toBe('물음표');
  });

  test('중복된 slug 생성', async () => {
    const title = '중복된 제목';
    const Post = {
      findOne: jest
        .fn()
        .mockReturnValueOnce({ slug: '중복된-제목' })
        .mockReturnValueOnce(null),
    };
    const slug = await generateUniqueSlug(
      title,
      Post as unknown as Model<Post>
    );
    expect(slug).toBe('중복된-제목-1');
  });
});
