export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// 'YYYY-MM-DD' → 'M/D' (타임존 영향 없이 문자열 기준으로 변환)
export const formatShortDate = (date: string): string =>
  `${parseInt(date.slice(5, 7), 10)}/${parseInt(date.slice(8, 10), 10)}`;

// 'YYYY-MM-DD' → 'M월 D일'
export const formatKoreanMonthDay = (date: string): string =>
  `${parseInt(date.slice(5, 7), 10)}월 ${parseInt(date.slice(8, 10), 10)}일`;

// 목록용 점 구분 날짜 — 2026.04.25
export const formatDotDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
};
