import React from 'react';
import AdminSeriesListItem from '@/app/entities/series/list/AdminSeriesListItem';
import { Series } from '@/app/types/Series';

interface AdminSeriesListProps {
  seriesList: Series[] | null | undefined;
  loading: boolean;
  handleUpdateSeries: (series: Series) => void;
  handleDeleteClick: (slug: string) => void;
}
const AdminSeriesList = ({
  loading,
  seriesList,
  handleUpdateSeries,
  handleDeleteClick,
}: AdminSeriesListProps) => {
  if (loading) {
    return <p className={'text-lg text-gray-500'}>로딩 중...</p>;
  }
  if (!seriesList || seriesList.length === 0) {
    return <p className={'text-lg text-gray-500'}>등록된 시리즈가 없습니다.</p>;
  }
  return (
    <ul>
      {loading && <p className={'text-lg text-gray-500'}>로딩 중...</p>}
      {seriesList.map((series, index) => (
        <AdminSeriesListItem
          key={index}
          series={series}
          handleUpdateSeries={handleUpdateSeries}
          handleDeleteClick={handleDeleteClick}
        />
      ))}
    </ul>
  );
};

export default AdminSeriesList;
