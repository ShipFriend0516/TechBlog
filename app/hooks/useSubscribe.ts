import axios from 'axios';
import { FormEvent, useState } from 'react';
import useToast from '@/app/hooks/useToast';

interface UseSubscribeReturn {
  nickname: string;
  email: string;
  isLoading: boolean;
  isSubmitted: boolean;
  setNickname: (value: string) => void;
  setEmail: (value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleReset: () => void;
}

const useSubscribe = (): UseSubscribeReturn => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !email.trim()) {
      toast.error('닉네임과 이메일을 모두 입력해주세요.');
      return;
    }
    if (nickname.trim().length < 2) {
      toast.error('닉네임은 최소 2자 이상이어야 합니다.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/subscribe', {
        email: email.trim(),
        nickname: nickname.trim(),
      });
      if (response.data.success) {
        toast.success(response.data.message || '인증 이메일이 발송되었습니다.');
        setIsSubmitted(true);
        setNickname('');
        setEmail('');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || '구독 신청에 실패했습니다.');
      } else {
        toast.error('구독 신청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => setIsSubmitted(false);

  return {
    nickname,
    email,
    isLoading,
    isSubmitted,
    setNickname,
    setEmail,
    handleSubmit,
    handleReset,
  };
};

export default useSubscribe;
