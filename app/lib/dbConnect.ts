import mongoose, { Mongoose } from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI && process.env.NODE_ENV !== 'production') {
  throw new Error('MongoDB URI가 없습니다. 환경변수를 설정해주세요.');
}

interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached = global.mongoose as CachedConnection;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  mongoose.connection.on('connected', () => {
    console.log('🎶 Success to connect with database');
  });

  mongoose.connection.on('error', (error: Error) => {
    console.error('👻 MongoDB Connect Fail!', error);
  });

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
