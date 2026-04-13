// 아틀리에 피드의 커서 기반 페이지네이션 유틸
// 현재는 단순히 createdAt 을 ISO 문자열로 직렬화해서 사용한다.
// 추후 복합 커서(timestamp + _id) 가 필요해지면 이 모듈만 교체하면 된다.

export const encodeCursor = (date: Date): string => date.toISOString();

// 잘못된 문자열이면 null 반환
export const decodeCursor = (raw: string | null | undefined): Date | null => {
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};
