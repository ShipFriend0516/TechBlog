import { Types } from 'mongoose';
import dbConnect from '@/app/lib/dbConnect';
import {
  decodeSeriesCursor,
  encodeSeriesCursor,
  seriesCursorFilter,
} from '@/app/lib/seriesCursor';
import Series from '@/app/models/Series';
import type { SeriesListItem, SeriesPage } from '@/app/types/Series.d';

export const SERIES_PAGE_SIZE = 12;

interface SeriesListDocument {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  description?: string;
  date: number;
  thumbnailImage?: string;
  postCount: number;
  sortOrder?: number | null;
}

export async function getPublicSeriesPage(
  rawCursor?: string
): Promise<SeriesPage> {
  const cursor = rawCursor ? decodeSeriesCursor(rawCursor) : null;
  if (rawCursor && !cursor) throw new Error('Invalid series cursor');

  await dbConnect();
  const documents = await Series.aggregate<SeriesListDocument>([
    ...(cursor ? [{ $match: seriesCursorFilter(cursor) }] : []),
    { $sort: { sortOrder: 1 as const, date: -1 as const, _id: 1 as const } },
    { $limit: SERIES_PAGE_SIZE + 1 },
    {
      $project: {
        slug: 1,
        title: 1,
        description: 1,
        date: 1,
        thumbnailImage: 1,
        sortOrder: 1,
        postCount: { $size: { $ifNull: ['$posts', []] } },
      },
    },
  ]);

  const hasMore = documents.length > SERIES_PAGE_SIZE;
  const pageDocuments = documents.slice(0, SERIES_PAGE_SIZE);
  const items: SeriesListItem[] = pageDocuments.map((document) => ({
    _id: document._id.toString(),
    slug: document.slug,
    title: document.title,
    description: document.description || '',
    date: document.date,
    thumbnailImage: document.thumbnailImage || '',
    postCount: document.postCount,
  }));
  const last = pageDocuments.at(-1);

  return {
    items,
    nextCursor:
      hasMore && last
        ? encodeSeriesCursor({
            sortOrder: last.sortOrder ?? null,
            date: last.date,
            id: last._id,
          })
        : null,
  };
}
