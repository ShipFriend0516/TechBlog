/**
 * 이미지를 서버에 업로드합니다
 * @param file - 업로드할 이미지 파일
 * @returns 업로드된 이미지 URL을 반환하는 Promise
 * @throws 파일이 이미지가 아니거나 업로드 실패, 응답이 유효하지 않은 경우 에러 발생
 */
export async function uploadImageFile(file: File): Promise<string> {
  // 검증
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있습니다.');
  }

  // formData 생성
  const formData = new FormData();
  formData.append('file', file);

  // 이미지 업로드 요청
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  // 응답 검증
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '업로드 실패');
  }

  // 응답 파싱
  const data = await response.json();

  // 응답 데이터 검증
  if (!data.success || !data.url) {
    throw new Error('업로드 URL을 받지 못했습니다.');
  }

  return data.url;
}
