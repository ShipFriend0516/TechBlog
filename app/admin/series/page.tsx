'use client';
import { Series } from '@/app/types/Series';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import React from 'react';
import AdminSeriesList from '@/app/entities/series/list/AdminSeriesList';
const AdminSeriesPage = () => {
  const getSeriesListConfig: useDataFetchConfig = {
    url: '/api/series',
    method: 'GET',
    config: {
      params: {
        compact: 'true',
      },
    },
  };

  const { data: seriesList, loading } =
    useDataFetch<Series[]>(getSeriesListConfig);

  return (
    <section className={'max-w-6xl mx-auto'}>
      <h1 className={'text-4xl font-bold mt-4'}>시리즈 관리</h1>
      <p className={'text-lg text-weak mb-4'}>
        시리즈를 관리하는 페이지입니다. 시리즈를 추가, 수정, 삭제할 수 있습니다.
      </p>
      <div>
        <button className={' bg-emerald-500 text-white px-4 py-2 rounded-lg'}>
          시리즈 추가
        </button>
      </div>
      <div>
        <h2 className={'text-xl font-bold my-2'}>
          등록된 시리즈 목록 ({seriesList?.length || 0})
        </h2>
        <hr className={'my-4'} />
        <AdminSeriesList seriesList={seriesList} loading={loading} />
      </div>
    </section>
  );
};

export default AdminSeriesPage;
