'use client';
import React, { useEffect, useRef } from 'react';

const Comments = () => {
  const ref = useRef<HTMLDivElement>(null);
  const config = {
    src: 'https://utteranc.es/client.js',
    repo: 'ShipFriend0516/TechBlog',
    'issue-term': 'pathname',
    theme: 'github-dark',
    crossOrigin: 'anonymous',
    async: true,
  };
  useEffect(() => {
    const utterances = document.createElement('script');
    Object.entries(config).forEach(([key, value]) => {
      utterances.setAttribute(key, `${value}`);
    });
    ref.current?.appendChild(utterances);
  }, []);

  return <div id="utteranc-comments" ref={ref}></div>;
};

export default Comments;
