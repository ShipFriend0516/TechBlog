// middleware/errorHandler.ts
import { NextRequest } from 'next/server';
import { createResponse } from '@/app/lib/api';

export const withErrorHandler =
  (handler: (req: NextRequest) => void) => async (req: NextRequest) => {
    try {
      return handler(req);
    } catch (error) {
      console.error('API Error:', error);

      return createResponse(null, '서버 오류가 발생했습니다', 500);
    }
  };
