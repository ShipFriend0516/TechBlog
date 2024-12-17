import { APIResponse } from '@/app/types/API';

export const createResponse = <T>(
  data?: T,
  error?: string | string[],
  status: number = 200
): Response => {
  const body: APIResponse<T> = {
    success: !error,
    ...(data && { data }),
    ...(error && { error }),
  };

  return Response.json(body, { status });
};
