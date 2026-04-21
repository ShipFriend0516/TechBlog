// 타입 정의
export type AtelierEffect = 'star' | 'flower';

export interface EffectConfig {
  command: string;           // 입력 접두사
  regex: RegExp;             // 파싱용 정규식
  hintText: string;          // MessageInput 힌트 문구
  hintColor: string;         // Tailwind text-xxx 색상
  hintIcon: string;          // 힌트 앞 문자/이모지
  ringClass: string;         // 버블 ring 스타일
  glowAnimation: string;     // Tailwind animate-xxx
}

// 레지스트리
export const EFFECT_REGISTRY: Record<AtelierEffect, EffectConfig> = {
  star: {
    command: '/star',
    regex: /^\/star\s+([\s\S]+)/,
    hintText: '반짝임 메시지로 전송됩니다',
    hintColor: 'text-amber-500',
    hintIcon: '✦',
    ringClass: 'ring-2 ring-amber-400/50',
    glowAnimation: 'animate-starGlow',
  },
  flower: {
    command: '/flower',
    regex: /^\/flower\s+([\s\S]+)/,
    hintText: '꽃잎 메시지로 전송됩니다',
    hintColor: 'text-pink-500',
    hintIcon: '🌸',
    ringClass: 'ring-2 ring-pink-400/50',
    glowAnimation: 'animate-flowerGlow',
  },
};

// 파싱 함수 (서버/클라이언트 공용)
export function parseEffect(content: string): {
  effect: AtelierEffect | null;
  finalContent: string;
} {
  const trimmed = content.trim();
  for (const [key, cfg] of Object.entries(EFFECT_REGISTRY) as [AtelierEffect, EffectConfig][]) {
    const match = cfg.regex.exec(trimmed);
    if (match) {
      return { effect: key, finalContent: match[1].trim() };
    }
  }
  return { effect: null, finalContent: trimmed };
}
