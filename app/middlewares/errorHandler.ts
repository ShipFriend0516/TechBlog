// middleware/errorHandler.ts
import { createResponse } from '@/app/lib/api';
import { NextRequest } from 'next/server';

export const withErrorHandler =
  (handler: (req: NextRequest) => void) => async (req: NextRequest) => {
    try {
      return handler(req);
    } catch (error) {
      console.error('API Error:', error);

      return createResponse(null, '서버 오류가 발생했습니다', 500);
    }
  };
