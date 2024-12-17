export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string | string[];
  message?: string;
}
