import { QuerySelector } from 'mongoose';
import dbConnect from '@/app/lib/dbConnect';
import PostModel from '@/app/models/Post';
import SeriesModel from '@/app/models/Series';
import { Post } from '@/app/types/Post.d';
import { Series } from '@/app/types/Series.d';

// 공개 포스트 목록 조회 파라미터
interface GetPostListParams {
  query?: string;
  series?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

// 공개 포스트 목록 조회 결과
interface GetPostListResult {
  posts: Post[];
  totalPosts: number;
}

// 공개 포스트 목록 조회 (compact 필드만 select, 비공개 글 제외)
const getPostList = async (params: GetPostListParams): Promise<GetPostListResult> => {
  await dbConnect();

  const { query = '', series: seriesSlug = '', tag: tagParam = '', page = 1, limit = 12 } = params;

  // 공개 목록 페이지 고정값
  const isCanViewPrivate = false;
  const isCompact = true;

  // 유효한 페이지 및 제한 확인
  const validPage = page > 0 ? page : 1;
  const validLimit = limit > 0 && limit <= 50 ? limit : 12;

  // 건너뛸 문서 수 계산
  const skip = (validPage - 1) * validLimit;

  const seriesId = seriesSlug
    ? await SeriesModel.findOne({ slug: seriesSlug }, '_id')
    : null;

  // 검색 조건 구성
  const searchConditions = {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { subTitle: { $regex: query, $options: 'i' } },
    ],
    $and: [
      ...(isCanViewPrivate
        ? []
        : [
            {
              $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
            },
          ]),
    ],
  };

  if (seriesId) {
    (searchConditions.$and as QuerySelector<string>[]).push({
      seriesId: seriesId._id,
    } as QuerySelector<string>);
  }

  // 태그 필터
  if (tagParam) {
    (searchConditions.$and as QuerySelector<string>[]).push({
      tags: tagParam,
    } as QuerySelector<string>);
  }

  // 검색 조건을 만족하는 총 문서 수 계산
  const totalPosts = await PostModel.countDocuments(searchConditions);

  // compact 필드만 select하여 조회
  let q = PostModel.find(searchConditions);

  if (isCompact) {
    q = q.select(
      'slug title _id subTitle author date tags thumbnailImage seriesId timeToRead createdAt updatedAt'
    );
  }

  const posts = await q.sort({ date: -1 }).skip(skip).limit(validLimit);

  // Mongoose ObjectId → plain object 직렬화
  return JSON.parse(JSON.stringify({ posts, totalPosts }));
};

// 시리즈 전체 목록 조회
const getSeriesList = async (): Promise<Series[]> => {
  await dbConnect();

  const series = await SeriesModel.find({}).sort({ sortOrder: 1, date: -1 });

  // Mongoose ObjectId → plain object 직렬화
  return JSON.parse(JSON.stringify(series));
};

export { getPostList, getSeriesList };
