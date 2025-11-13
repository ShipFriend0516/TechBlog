'use client';
import { useEffect, useState } from 'react';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';
import useTheme from '@/app/hooks/useTheme';

// 실제 댓글 렌더링을 담당하는 별도 컴포넌트
const UtterancesComments = ({ theme }: { theme: string }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'ShipFriend0516/TechBlog');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute(
      'theme',
      theme === 'dark' ? 'github-dark' : 'github-light'
    );
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    const container = document.getElementById('utterances-comments');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // 클린업 함수는 컴포넌트가 언마운트될 때 자동으로 처리됨
    };
  }, [theme]);

  return <div id="utterances-comments" />;
};

// 메인 컴포넌트
const Comments = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [mount, setMount] = useState(true);

  // 테마가 변경되면 컴포넌트를 언마운트했다가 다시 마운트
  useEffect(() => {
    setLoading(true);
    setMount(false);

    // 약간의 지연 후 다시 마운트
    const timer = setTimeout(() => {
      setMount(true);

      // 추가 지연 후 로딩 상태 해제
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, 100);

    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <>
      {loading && (
        <Skeleton
          className={
            'flex items-center justify-center max-w-3xl w-full h-60 mx-auto'
          }
        ></Skeleton>
      )}

      <div style={{ display: loading ? 'none' : 'block' }}>
        {mount && <UtterancesComments theme={theme} />}
      </div>
    </>
  );
};

export default Comments;
