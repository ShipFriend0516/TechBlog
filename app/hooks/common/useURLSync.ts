import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface useURLSyncConfig {
  baseURL: string;
  params: Record<string, any> | Record<string, any[]>;
}

/**
 * 서치파라미터를 쉽게 설정할 수 있는 훅을 만들어봅시다.
 * example /posts?page=1&series=seriesSlug&query=query
 * 필요한 파라미터는 baseURL, currentPage, seriesSlugParam, query입니다.
 * @param baseURL
 * @param params
 */

const useURLSync = ({ baseURL, params }: useURLSyncConfig) => {
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const finalUrl = `/${baseURL}?${searchParams.toString()}`;
    router.push(finalUrl);
  }, [...Object.values(params)]);

  return {};
};

export default useURLSync;
