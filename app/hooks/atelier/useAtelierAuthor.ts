'use client';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';
import useFingerprint from '@/app/hooks/useFingerprint';
import useNicknameStore from '@/app/stores/atelier/useNicknameStore';

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
  const storedNickname = useNicknameStore((s) => s.nickname);
  const setStoredNickname = useNicknameStore((s) => s.setNickname);

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
    setStoredNickname(next);
  }, [setStoredNickname]);

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
