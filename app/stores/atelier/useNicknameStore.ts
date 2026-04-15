import { create } from 'zustand';

const NICKNAME_STORAGE_KEY = 'atelier-nickname';

interface NicknameState {
  nickname: string | null;
  setNickname: (nickname: string) => void;
}

const useNicknameStore = create<NicknameState>((set) => ({
  nickname:
    typeof window !== 'undefined'
      ? sessionStorage.getItem(NICKNAME_STORAGE_KEY)
      : null,
  setNickname: (nickname: string) => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    sessionStorage.setItem(NICKNAME_STORAGE_KEY, trimmed);
    set({ nickname: trimmed });
  },
}));

export default useNicknameStore;
