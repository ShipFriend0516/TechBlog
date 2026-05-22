// Usage: DB_URI=<your-mongodb-uri> node scripts/list-slugs.mjs
import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI) {
  console.error('Error: DB_URI environment variable is required');
  console.error('Usage: DB_URI=<mongodb-uri> node scripts/list-slugs.mjs');
  process.exit(1);
}

const postSchema = new mongoose.Schema({
  slug: String,
  title: String,
  isPrivate: Boolean,
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

async function listSlugs() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const posts = await Post.find({}, { slug: 1, title: 1, isPrivate: 1, _id: 0 })
    .sort({ createdAt: 1 })
    .lean();

  console.log(`Total posts: ${posts.length}\n`);
  console.log('='.repeat(80));

  posts.forEach((post, i) => {
    const privacy = post.isPrivate ? '[비공개]' : '[공개]  ';
    console.log(`${String(i + 1).padStart(3)}. ${privacy} slug: ${post.slug}`);
    console.log(`       title: ${post.title}`);
  });

  console.log('='.repeat(80));
  console.log('\nSlug list only:');
  posts.forEach((post) => console.log(post.slug));

  await mongoose.connection.close();
}

listSlugs().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
