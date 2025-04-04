'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

interface PortfolioDetailPageProps {
  params: {
    slug: string;
  };
}
const PortfolioDetailPage = ({ params }: PortfolioDetailPageProps) => {
  const getPortfolioDetail = async () => {
    const response = await axios.get(`/api/portfolio/${params.slug}`);
    const data = await response.data;
  };
  return (
    <section>
      <h1></h1>
      {params['slug']}
    </section>
  );
};

export default PortfolioDetailPage;
