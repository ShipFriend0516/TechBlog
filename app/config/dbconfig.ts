import mongoose from 'mongoose';
const uri = process.env.DB_URI;

export const connectDB = async () => {
  try {
    if (!uri) {
      throw new Error('DB_URI가 없습니다. 환경변수를 확인해주세요.');
    }

    const connection = await mongoose.connect(uri);
    console.log('MongoDB connected');
    return connection;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
