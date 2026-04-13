'use client';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useFingerprint from '@/app/hooks/useFingerprint';

// sessionStorage 키 — 페이지 리로드 시 익명 닉네임 유지
const NICKNAME_STORAGE_KEY = 'atelier-nickname';

interface GithubUser {
  name: string;
  image: string;
  id: string;
}

interface UseAtelierAuthorReturn {
  isAdmin: boolean;
  isAuthenticated: boolean;
  githubUser: GithubUser | null;
  fingerprint: string | null;
  nickname: string | null;
  setNickname: (nickname: string) => void;
  needsNickname: boolean;
}

const useAtelierAuthor = (): UseAtelierAuthorReturn => {
  const { data: session, status } = useSession();
  const { fingerprint } = useFingerprint();
  const [storedNickname, setStoredNickname] = useState<string | null>(null);

  // 초기 마운트 시 sessionStorage 에서 닉네임 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = sessionStorage.getItem(NICKNAME_STORAGE_KEY);
    if (saved) setStoredNickname(saved);
  }, []);

  // 클라이언트에서는 NEXT_PUBLIC_ADMIN_EMAIL 과 세션 이메일을 비교한다
  // 해당 env 가 설정되지 않았다면 isAdmin 은 항상 false 로 폴백된다
  const isAdmin = useMemo(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!adminEmail) return false;
    return session?.user?.email === adminEmail;
  }, [session]);

  const isAuthenticated = status === 'authenticated';

  // next-auth 세션에 담긴 GitHub 사용자 정보 매핑
  const githubUser = useMemo<GithubUser | null>(() => {
    if (!session?.user) return null;
    const name = session.user.name ?? '';
    const image = session.user.image ?? '';
    // NextAuth 기본 세션에는 id 가 없을 수 있음 — email 을 폴백으로 사용
    const idCandidate =
      (session.user as { id?: string }).id ?? session.user.email ?? '';
    if (!name && !image && !idCandidate) return null;
    return { name, image, id: idCandidate };
  }, [session]);

  // 세션이 있으면 세션 name, 없으면 sessionStorage 저장 값
  const nickname = useMemo(() => {
    if (githubUser?.name) return githubUser.name;
    return storedNickname;
  }, [githubUser, storedNickname]);

  const handleSetNickname = useCallback((next: string) => {
    const trimmed = next.trim();
    if (!trimmed) return;
    sessionStorage.setItem(NICKNAME_STORAGE_KEY, trimmed);
    setStoredNickname(trimmed);
  }, []);

  // 세션도 없고 저장된 닉네임도 없을 때 입력이 필요하다
  const needsNickname = !isAuthenticated && !storedNickname;

  return {
    isAdmin,
    isAuthenticated,
    githubUser,
    fingerprint,
    nickname,
    setNickname: handleSetNickname,
    needsNickname,
  };
};

export default useAtelierAuthor;
