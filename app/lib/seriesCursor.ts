import { Types } from 'mongoose';

export interface SeriesCursor {
  sortOrder: number | null;
  date: number;
  id: Types.ObjectId;
}

export const encodeSeriesCursor = (cursor: SeriesCursor): string =>
  Buffer.from(
    JSON.stringify([cursor.sortOrder, cursor.date, cursor.id.toString()])
  ).toString('base64url');

export const decodeSeriesCursor = (raw: string): SeriesCursor | null => {
  if (!raw || raw.length > 256) return null;

  try {
    const value: unknown = JSON.parse(Buffer.from(raw, 'base64url').toString());
    if (!Array.isArray(value) || value.length !== 3) return null;

    const [sortOrder, date, id] = value;
    if (
      (sortOrder !== null &&
        (typeof sortOrder !== 'number' || !Number.isFinite(sortOrder))) ||
      typeof date !== 'number' ||
      !Number.isFinite(date) ||
      typeof id !== 'string' ||
      !/^[a-f\d]{24}$/i.test(id)
    ) {
      return null;
    }

    return { sortOrder, date, id: new Types.ObjectId(id) };
  } catch {
    return null;
  }
};

export const seriesCursorFilter = (cursor: SeriesCursor) => {
  const sameOrder = cursor.sortOrder === null ? null : cursor.sortOrder;
  const laterOrder =
    cursor.sortOrder === null
      ? { sortOrder: { $ne: null } }
      : { sortOrder: { $gt: cursor.sortOrder } };

  return {
    $or: [
      laterOrder,
      { sortOrder: sameOrder, date: { $lt: cursor.date } },
      { sortOrder: sameOrder, date: cursor.date, _id: { $gt: cursor.id } },
    ],
  };
};
