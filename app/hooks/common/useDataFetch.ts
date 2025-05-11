import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';

export interface useDataFetchConfig<T = any> {
  url: string;
  method: Method;
  body?: Record<string, any>;
  config?: AxiosRequestConfig;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  onLoading?: () => void;
  onBeforeFetch?: () => void;
  dependencies?: any[];
}

const useDataFetch = <T = never>({
  url,
  method,
  body,
  config,
  onLoading,
  onSuccess,
  onError,
  onBeforeFetch,
  dependencies = [],
}: useDataFetchConfig<T>) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | Error | null>(null);
  const [data, setData] = useState<T | null>();

  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    data: body,
    ...config,
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (onBeforeFetch) {
        onBeforeFetch();
      }

      const response = await axios(axiosConfig);
      const data = response.data;

      setData(data);
      setLoading(false);
      if (onSuccess) {
        onSuccess(data);
      }
      if (onLoading) {
        onLoading();
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.error('데이터를 Fetch 하는데에 실패했습니다.', e);
        setError(e);
        setLoading(false);
        if (onError) {
          onError(e);
        }
      } else {
        console.error('Unknown Error:', e);
      }
    }
  }, [url, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};

export default useDataFetch;
