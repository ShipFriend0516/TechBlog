// 빌드 타임에 llms.txt를 생성하는 스크립트
// Vercel: 환경변수 자동 주입
// 로컬: node --env-file=.env scripts/generate-llms.mjs 또는 pnpm build 전 .env 로드

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 로컬 환경에서 .env 파일이 있으면 로드
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

const MONGODB_URI = process.env.DB_URI;
if (!MONGODB_URI) {
  console.error('❌ DB_URI 환경변수가 없습니다.');
  process.exit(1);
}

const postSchema = new mongoose.Schema(
  {
    slug: String,
    title: String,
    subTitle: String,
    author: String,
    date: Number,
    content: String,
    timeToRead: Number,
    tags: [String],
    thumbnailImage: String,
    seriesId: mongoose.Schema.Types.ObjectId,
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const viewSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    fingerprint: String,
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
const View = mongoose.models.View || mongoose.model('View', viewSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB 연결 성공');

  const recentPosts = await Post.find({ isPrivate: false })
    .select('title subTitle slug date tags')
    .sort({ date: -1 })
    .limit(3)
    .lean();

  const viewAggregation = await View.aggregate([
    { $group: { _id: '$postId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const popularPosts = (
    await Promise.all(
      viewAggregation.map(async ({ _id, count }) => {
        const post = await Post.findById(_id)
          .select('title subTitle slug date tags isPrivate')
          .lean();
        if (!post || post.isPrivate) return null;
        return { ...post, view: count };
      })
    )
  )
    .filter(Boolean)
    .slice(0, 3);

  const siteUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  const formatDate = (timestamp) =>
    new Date(timestamp).toISOString().split('T')[0];

  const lines = [
    `# ShipFriend TechBlog`,
    ``,
    `> 개발자 서정우의 기술 블로그. 웹 개발, 소프트웨어 엔지니어링 등 개발 관련 글을 작성합니다.`,
    ``,
    `## About`,
    ``,
    `- 블로그: ${siteUrl}`,
    `- 저자: 서정우 (ShipFriend)`,
    `- 언어: 한국어`,
    `- 주제: 웹 개발, 프론트엔드, 백엔드, DevOps, 소프트웨어 엔지니어링`,
    ``,
    `## 최신 글`,
    ``,
    ...recentPosts.map(
      (p) =>
        `- [${p.title}](${siteUrl}/posts/${p.slug}): ${p.subTitle || ''} (${formatDate(p.date)})`
    ),
    ``,
    `## 인기 글`,
    ``,
    ...popularPosts.map(
      (p) =>
        `- [${p.title}](${siteUrl}/posts/${p.slug}): ${p.subTitle || ''} (조회 ${p.view}회)`
    ),
    ``,
    `## Optional`,
    ``,
    `- [전체 포스트 목록](${siteUrl}/posts)`,
    `- [전체 시리즈 목록](${siteUrl}/series)`,
    `- [사이트맵](${siteUrl}/sitemap.xml)`,
    ``,
  ];

  const content = lines.join('\n');
  const outputPath = path.join(__dirname, '..', 'public', 'llms.txt');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf-8');

  console.log(`✅ llms.txt 생성 완료: ${outputPath}`);
  console.log(`   최신 글 ${recentPosts.length}개, 인기 글 ${popularPosts.length}개`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ llms.txt 생성 실패:', err);
  process.exit(1);
});
