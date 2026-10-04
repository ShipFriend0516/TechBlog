// Giscus 이슈 제목(예: 'posts/my-post-slug/')을 다루는 유틸

const stripPostsPrefix = (title: string) =>
  title.startsWith('posts/') ? title.slice(6).trim() : title;

// 이슈 제목에서 slug 추출
export const extractSlugFromTitle = (title: string): string => {
  try {
    let titleString = stripPostsPrefix(title);
    // 마지막 슬래시 제거
    if (titleString.endsWith('/')) {
      titleString = titleString.slice(0, -1);
    }
    return decodeURIComponent(titleString);
  } catch {
    return title;
  }
};

// 이슈 제목을 읽기 쉬운 형태로 변환
export const extractPostTitle = (title: string): string => {
  try {
    const decodedSlug = decodeURIComponent(stripPostsPrefix(title));

    const readableTitle = decodedSlug
      .split(/[-_]/)
      .map((word) => {
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');

    return readableTitle || decodedSlug || title;
  } catch {
    return title;
  }
};
