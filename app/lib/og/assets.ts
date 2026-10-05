import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Satori(ImageResponse)는 woff2를 지원하지 않으므로 woff 원본을 사용한다.
const FONT_DIR = join(process.cwd(), 'app/fonts/woff');
const LOGO_PATH = join(process.cwd(), 'public/assets/android-chrome-512x512.png');

const FONT_WEIGHTS = [
  { file: 'Pretendard-Regular.woff', weight: 400 },
  { file: 'Pretendard-SemiBold.woff', weight: 600 },
  { file: 'Pretendard-Bold.woff', weight: 700 },
] as const;

export type OgAssets = {
  fonts: {
    name: string;
    data: Buffer;
    weight: 400 | 600 | 700;
    style: 'normal';
  }[];
  logoSrc: string;
};

let assetsPromise: Promise<OgAssets> | null = null;

const loadAssets = async (): Promise<OgAssets> => {
  const [logo, ...fontBuffers] = await Promise.all([
    readFile(LOGO_PATH),
    ...FONT_WEIGHTS.map(({ file }) => readFile(join(FONT_DIR, file))),
  ]);

  return {
    fonts: FONT_WEIGHTS.map(({ weight }, i) => ({
      name: 'Pretendard',
      data: fontBuffers[i],
      weight,
      style: 'normal' as const,
    })),
    logoSrc: `data:image/png;base64,${logo.toString('base64')}`,
  };
};

export const getOgAssets = () => {
  assetsPromise ??= loadAssets().catch((error) => {
    assetsPromise = null;
    throw error;
  });
  return assetsPromise;
};
