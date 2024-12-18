import { getThumbnailInMarkdown } from '@/app/lib/utils/parse';

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
