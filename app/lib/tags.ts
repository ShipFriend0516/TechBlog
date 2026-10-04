import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import { TagData } from '@/app/types/Tag';

// 공개 글 기준 태그별 글 개수 (개수 내림차순)
export const getTagStats = async (): Promise<TagData[]> => {
  await dbConnect();

  return Post.aggregate<TagData>([
    { $match: { isPrivate: { $ne: true } } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $project: { tag: '$_id', count: 1, _id: 0 } },
  ]);
};
