// migration.js
import { generateUniqueSlug } from '@/app/lib/utils/post';
import Post from '@/app/models/Post';
import mongoose from 'mongoose';

// MongoDB URI를 직접 입력하거나 환경변수에서 가져옵니다
const MONGODB_URI = process.env.DB_URI || '여기에_mongodb_uri를_입력하세요';
async function migrateExistingPosts() {
  try {
    // MongoDB 연결
    console.log('MONGODB_URI:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const posts = await Post.find({ slug: { $exists: false } });
    console.log(`Found ${posts.length} posts without slugs`);

    for (const post of posts) {
      post.slug = await generateUniqueSlug(post.title, Post);
      await post.save();
      console.log(`Updated post: ${post.title} with slug: ${post.slug}`);
    }

    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // 연결 종료
    await mongoose.connection.close();
  }
}

migrateExistingPosts();
