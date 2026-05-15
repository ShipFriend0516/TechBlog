import mongoose, { Mongoose } from 'mongoose';

declare global {
   
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

let isEventListenerRegistered = false;

function registerEventListeners() {
  if (isEventListenerRegistered) return;

  mongoose.connection.on('connected', () => {
    console.log('🎶 MongoDB와 연결 성공');
  });

  mongoose.connection.on('error', (error: Error) => {
    console.error('👻 MongoDB 연결 에러!', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB 연결 끊김');
    cached.conn = null;
  });

  isEventListenerRegistered = true;
}

async function dbConnect(uri?: string, retries = 3): Promise<Mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (mongoose.connection.readyState === 2) {
    console.log('⏳ MongoDB 연결 중...');
  }

  registerEventListeners();

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 5000,
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
      const delay = Math.min(1000 * Math.pow(2, 3 - retries), 5000);
      console.log(
        `🔄 DB 연결 재시도 중... (남은 시도: ${retries}, ${delay}ms 후)`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return dbConnect(uri, retries - 1);
    }

    console.error('❌ DB 연결 최종 실패:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
