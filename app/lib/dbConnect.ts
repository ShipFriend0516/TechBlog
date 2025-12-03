import mongoose, { Mongoose } from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI) {
  throw new Error(
    `MongoDB URI가 없습니다. 환경변수를 설정해주세요. NODE_ENV: ${process.env.NODE_ENV}`
  );
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

async function dbConnect(uri?: string, retries = 3): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  mongoose.connection.on('connected', () => {
    console.log('🎶 MongoDB와 연결 성공');
  });

  mongoose.connection.on('error', (error: Error) => {
    console.error('👻 MongoDB 연결 실패!', error);
  });

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 15,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(uri ?? MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;

    if (retries > 0) {
      console.log(`🔄 DB 연결 재시도 중... (남은 시도: ${retries})`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return dbConnect(uri, retries - 1);
    }

    throw e;
  }

  return cached.conn;
}

export default dbConnect;
