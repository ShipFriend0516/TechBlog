import { AxiosError } from 'axios';

interface ErrorBoxProps {
  error: AxiosError | Error | null;
}

const ErrorBox = ({ error }: ErrorBoxProps) => {
  if (!error) return null;

  return (
    <div className="text-red-300 text-sm mx-auto max-w-5xl">
      ⚠️ 데이터 로드 중 오류가 발생했습니다.
    </div>
  );
};

export default ErrorBox;
