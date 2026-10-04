// 관리자 분석 API 공용 fetch 헬퍼 — { success: false } 응답을 예외로 통일한다
export const fetchAdminJson = async <T>(
  url: string,
  pick: (data: Record<string, unknown>) => T,
  signal?: AbortSignal
): Promise<T> => {
  const res = await fetch(url, { signal });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || '데이터를 불러오지 못했습니다.');
  }
  return pick(data);
};

export const toPercent = (count: number, total: number) =>
  total > 0 ? (count / total) * 100 : 0;
