import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { useEffect, useState } from 'react';

export interface useDataFetchConfig<T = unknown> {
  url: string;
  method: Method;
  body?: Record<string, unknown>;
  config?: AxiosRequestConfig;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  onLoading?: () => void;
  onBeforeFetch?: () => void;
  dependencies?: unknown[];
}

type FetchResult<T> = {
  key: string;
  data: T | null;
  error: AxiosError | Error | null;
};

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
  const [result, setResult] = useState<FetchResult<T>>({ key: '', data: null, error: null });

  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    data: body,
    ...config,
  };

  const depsKey = JSON.stringify(dependencies);
  const currentKey = url + depsKey;
  const loading = result.key !== currentKey;

  useEffect(() => {
    let ignore = false;
    onBeforeFetch?.();

    axios(axiosConfig)
      .then((response) => {
        if (ignore) return;
        const data = response.data as T;
        setResult({ key: currentKey, data, error: null });
        onSuccess?.(data);
        onLoading?.();
      })
      .catch((e) => {
        if (ignore) return;
        if (axios.isAxiosError(e)) {
          console.error('데이터를 Fetch 하는데에 실패했습니다.', e);
          setResult({ key: currentKey, data: null, error: e });
          onError?.(e);
        } else {
          console.error('Unknown Error:', e);
        }
      });

    return () => {
      ignore = true;
    };
  }, [url, depsKey]);

  return { data: result.data, loading, error: loading ? null : result.error };
};

export default useDataFetch;
