import mongoose from 'mongoose';

declare global {
  var mongoose: any; // MongoDB 인스턴스를 전역으로 사용하기 위한 타입 선언
}

const MONGODB_URI = process.env.DB_URI!;

if (!MONGODB_URI) {
  throw new Error('MongoDB URI가 없습니다. 환경변수를 설정해주세요.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  mongoose.connection.on('connected', () => {
    console.log('🎶 Success to connect with database');
  });

  mongoose.connection.on('error', (error) => {
    console.error('👻 MongoDB Connect Fail!', error);
  });

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
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
