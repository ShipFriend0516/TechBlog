'use client';
import { useEffect, useState } from 'react';
import useTheme from '@/app/hooks/useTheme';
import Giscus from '@giscus/react';

const Comments = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <Giscus
        id="comments"
        repo="ShipFriend0516/TechBlog"
        repoId="R_kgDOM4b8wQ="
        category="Comments"
        categoryId="DIC_kwDOM4b8wc4C7M4Y-hVS"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === 'dark' ? 'noborder_dark' : 'noborder_light'}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
};

export default Comments;
