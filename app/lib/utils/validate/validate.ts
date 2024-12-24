import { PostBody } from '@/app/types/Post';

export const validatePost = (
  post: PostBody
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 필수 필드 검사
  if (!post.title?.trim()) {
    errors.push('제목은 필수입니다');
  }
  if (!post.content?.trim()) {
    errors.push('내용은 필수입니다');
  }

  // 길이 제한 검사
  if (post.title && post.title.length > 100) {
    errors.push('제목은 100자를 초과할 수 없습니다');
  }
  if (post.subTitle && post.subTitle.length > 200) {
    errors.push('부제목은 200자를 초과할 수 없습니다');
  }
  if (post.content && post.content.length > 50000) {
    errors.push('내용은 20000자를 초과할 수 없습니다');
  }

  // 최소 길이 검사
  if (post.title && post.title.length < 2) {
    errors.push('제목은 최소 2자 이상이어야 합니다');
  }

  if (post.content && post.content.length < 10) {
    errors.push('내용은 최소 10자 이상이어야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
