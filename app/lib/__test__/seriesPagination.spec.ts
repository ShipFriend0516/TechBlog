/** @jest-environment node */

import { Types } from 'mongoose';
import {
  getPublicSeriesPage,
  SERIES_PAGE_SIZE,
} from '@/app/lib/getPublicSeriesPage';
import {
  decodeSeriesCursor,
  encodeSeriesCursor,
  seriesCursorFilter,
} from '@/app/lib/seriesCursor';
import Series from '@/app/models/Series';

jest.mock('../dbConnect', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../models/Series', () => ({
  __esModule: true,
  default: { aggregate: jest.fn() },
}));

const aggregate = Series.aggregate as jest.Mock;

describe('series cursor', () => {
  it('round-trips a tied sort position and rejects malformed input', () => {
    const cursor = {
      sortOrder: 2,
      date: 1710000000000,
      id: new Types.ObjectId('665000000000000000000001'),
    };

    expect(decodeSeriesCursor(encodeSeriesCursor(cursor))).toEqual(cursor);
    expect(decodeSeriesCursor('invalid')).toBeNull();
    expect(
      decodeSeriesCursor(
        Buffer.from(JSON.stringify([2, 123, 'bad'])).toString('base64url')
      )
    ).toBeNull();
  });

  it('advances through missing sort orders before numbered sort orders', () => {
    const id = new Types.ObjectId('665000000000000000000001');
    expect(seriesCursorFilter({ sortOrder: null, date: 100, id })).toEqual({
      $or: [
        { sortOrder: { $ne: null } },
        { sortOrder: null, date: { $lt: 100 } },
        { sortOrder: null, date: 100, _id: { $gt: id } },
      ],
    });
  });
});

describe('public series page', () => {
  beforeEach(() => aggregate.mockReset());

  it('returns one page, a next cursor, and only card fields', async () => {
    aggregate.mockResolvedValue(
      Array.from({ length: SERIES_PAGE_SIZE + 1 }, (_, index) => ({
        _id: new Types.ObjectId(
          `6650000000000000000000${index.toString(16).padStart(2, '0')}`
        ),
        slug: `series-${index}`,
        title: `Series ${index}`,
        description: '',
        date: 100 - index,
        thumbnailImage: '',
        sortOrder: 0,
        postCount: index,
      }))
    );

    const page = await getPublicSeriesPage();

    expect(page.items).toHaveLength(SERIES_PAGE_SIZE);
    expect(page.items[0]).toEqual({
      _id: '665000000000000000000000',
      slug: 'series-0',
      title: 'Series 0',
      description: '',
      date: 100,
      thumbnailImage: '',
      postCount: 0,
    });
    expect(decodeSeriesCursor(page.nextCursor!)).toEqual({
      sortOrder: 0,
      date: 100 - (SERIES_PAGE_SIZE - 1),
      id: new Types.ObjectId('66500000000000000000000b'),
    });
  });

  it('ends pagination when fewer than one page remains', async () => {
    aggregate.mockResolvedValue([]);
    await expect(getPublicSeriesPage()).resolves.toEqual({
      items: [],
      nextCursor: null,
    });
    await expect(getPublicSeriesPage('bad-cursor')).rejects.toThrow(
      'Invalid series cursor'
    );
  });
});
