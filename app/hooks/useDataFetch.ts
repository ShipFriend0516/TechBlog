import { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';

interface useDataFetchProps<T = any> {
  url: string;
  method: Method;
  body?: Record<string, any>;
  config?: AxiosRequestConfig;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onLoading?: () => void;
}

const useDataFetch = <T = never>({
  url,
  method,
  body,
  config,
  onLoading,
  onSuccess,
  onError,
}: useDataFetchProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | Error | null>(null);
  const [data, setData] = useState<T | null>();

  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    data: body,
    ...config,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

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
    };
    fetchData();
  }, []);

  return { data, loading, error };
};

export default useDataFetch;
