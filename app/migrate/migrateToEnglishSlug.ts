import mongoose from 'mongoose';
import Post from '@/app/models/Post';

const MONGODB_URI = process.env.DB_URI!;

const SLUG_MAP: Record<string, string> = {
  'next-js로-나만의-블로그-만들기': 'building-my-own-blog-with-nextjs',
  '블로그-cls-성능-최적화하기': 'optimizing-blog-cls-performance',
  '내가-만드는-블로그로-알아보는-seo-최적화': 'seo-optimization-with-my-blog',
  'vercel이-말아주는-이미지-cdn-사용해보기': 'using-vercel-image-cdn',
  '1년된-프로젝트-리팩토링하면서-생긴-일': 'refactoring-a-1-year-old-project',
  '네트워크-품질의-성능-지표에-대해서': 'preview-network-dynamic-quality-part-1',
  'webrtc-개념-정리': 'webrtc-concepts',
  '다크모드-fouc-깜빡임-현상-수정하기': 'fixing-dark-mode-fouc-flash',
  '미디어-장치-권한이-없을-때-대응하기': 'handling-media-device-permission-denied',
  '드래그-앤-드롭-기능-예제와-성능-최적화': 'drag-and-drop-example-and-performance-optimization',
  '블로그-api-최적화': 'blog-api-optimization',
  '프리뷰-네트워크-기반-동적-품질-조절-기능-개발-2편': 'preview-network-dynamic-quality-part-2',
  '요청을-캐시해서-돈을-아껴보자': 'save-money-by-caching-requests',
  '리드미용-블로그-최신-글-뱃지-만들기': 'creating-readme-blog-latest-post-badge',
  '프리뷰-네트워크-기반-동적-품질-조절-기능-개발-3편': 'preview-network-dynamic-quality-part-3',
  'fingerprintjs로-조회수와-좋아요-기능-만들기': 'implementing-views-and-likes-with-fingerprintjs',
  '직접-해보면서-깨닫는-ssr과-ssg-차이': 'solving-vercel-cold-start-with-ssg',
  '티스토리-블로그-확장프로그램-storyhelper-개발-회고': 'storyhelper-tistory-extension-development-retrospective',
  "schema-hasn-t-been-registered-for-model-문제-해결하기": 'fixing-schema-hasnt-been-registered-for-model',
  'development-production-환경의-lighthouse-성능-점수-차이-왜-생기는-걸까': 'why-lighthouse-score-differs-between-dev-and-prod',
  'webrtc-datachannel로-실시간-미디어-상태-공유하기': 'sharing-realtime-media-state-with-webrtc-datachannel',
  'access-token-만료시-일관적인-401-에러-응답-처리': 'handling-401-error-on-access-token-expiry',
  '카메라-인디케이터-라이트-항상-표시되는-오류-해결하기': 'fixing-camera-indicator-light-always-on',
  'webrtc-공감-기능-개발하기': 'video-component-rendering-optimization',
  'hoc-패턴으로-보호된-라우트-레이아웃-컴포넌트-구현': 'implementing-protected-route-layout-with-hoc',
  '블로그에-유튜브-임베딩하기': 'embedding-youtube-in-blog',
  '티스토리-생산성-확장프로그램-storyhelper-사용-가이드': 'storyhelper-usage-guide',
  '웹-뷰-web-view-란': 'what-is-web-view',
  'promise-all-이해하기': 'understanding-promise-all',
  '리액트의-render-함수와-component-방식의-차이점을-알아보자': 'react-render-function-vs-component',
  'module-federation에-대해서': 'about-module-federation',
  'vanilla-extract에-대해서-알아봅시다': 'about-vanilla-extract',
  '2025년-회고-글을-작성해요': '2025-year-end-retrospective',
  '레거시와-모던의-차이점과-현대화에-필요한-것': 'legacy-vs-modern-and-modernization',
  'zod로-유효성-검사를-선언적으로-관리하기': 'declarative-validation-with-zod',
  'storyhelper에-리뷰-요청하기와-삭제시-피드백-수집-기능-만들기': 'storyhelper-review-request-and-delete-feedback',
  'storyhelper-v1-6-2-패치노트': 'storyhelper-v1-6-2-patch-notes',
  '장시간-ai-처리-작업의-실시간-진행률-구현-sse': 'realtime-progress-for-long-running-ai-tasks-with-sse',
  'fastapi-동기-비동기-블로킹-이슈-해결하기': 'solving-fastapi-sync-async-blocking-issues',
  'javascript의-map-자료구조에-대해서-자세하게-알아보자': 'deep-dive-into-javascript-map',
  '개인-블로그에-opengraph-카드-ui-만들기': 'creating-opengraph-card-ui-for-blog',
  'fastapi는-왜-사용하는-걸까': 'why-use-fastapi-strengths-and-weaknesses',
  'storyhelper-패치-노트-v1-7-0': 'storyhelper-v1-7-0-patch-notes',
  '내-블로그에-보안-헤더-적용하면서-알아보기': 'learning-security-headers-for-my-blog',
  'storyhelper-v1-7-2-패치노트': 'storyhelper-v1-7-2-patch-notes',
};

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let updated = 0;
  let skipped = 0;

  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const post = await Post.findOne({ slug: oldSlug });
    if (!post) {
      console.warn(`⚠️  Not found: ${oldSlug}`);
      skipped++;
      continue;
    }

    const alreadyHasLegacy = post.legacySlug?.includes(oldSlug);
    await Post.updateOne(
      { _id: post._id },
      {
        $set: { slug: newSlug },
        ...(alreadyHasLegacy ? {} : { $addToSet: { legacySlug: oldSlug } }),
      }
    );

    console.log(`✅ ${oldSlug}\n   → ${newSlug}`);
    updated++;
  }

  console.log(`\nDone. updated: ${updated}, skipped: ${skipped}`);
  await mongoose.connection.close();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
