import Carousel from '@/app/entities/portfolio/Carousel';
import PortfolioPreview from '@/app/entities/portfolio/PortfolioPreview';
import { projects } from '@/app/portfolio/data';
import React from 'react';

const PortfolioPage = () => {
  const slides = [
    <PortfolioPreview key={projects[0].title} project={projects[0]} />,
    <PortfolioPreview key={projects[1].title} project={projects[1]} />,
    <PortfolioPreview key={projects[2].title} project={projects[2]} />,
    <PortfolioPreview key={projects[3].title} project={projects[3]} />,
  ];

  return (
    <section
      className={'w-full h-full flex flex-col justify-center items-center'}
    >
      <h1 className={'text-4xl text-center font-bold mt-8 mb-4'}>포트폴리오</h1>
      <p className={'text-sm mb-4'}>참여한 프로젝트 모아보기</p>
      <div className={'max-w-3xl '}>
        <Carousel slides={slides} />
      </div>
    </section>
  );
};

export default PortfolioPage;
