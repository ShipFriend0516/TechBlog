import type { Metadata } from 'next';
import Link from 'next/link';
import SceneCanvas from '@/app/entities/common/Animation/space/SceneCanvas';

export const metadata: Metadata = {
  title: 'Not Found',
  robots: { index: false, follow: false },
};

const NotFound = () => {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-24">
      {/* 장면이 항상 밤하늘이므로 dark 토큰으로 고정. 배경색은 adrift 씬 캔버스 BG 와 맞춘 일러스트 색 */}
      <div className="dark relative h-[70vh] min-h-[480px] overflow-hidden rounded-card bg-[#1A1F55]">
        <SceneCanvas scene="adrift" className="absolute inset-0 h-full w-full" />
        <div className="absolute left-0 top-0 flex max-w-sm flex-col gap-3 p-6 md:p-10">
          <p className="bg-gradient-to-b from-accent-strong to-nebula-soft bg-clip-text text-6xl font-extrabold leading-none tracking-tight text-transparent md:text-7xl">
            404
          </p>
          <h1 className="text-xl font-bold text-fg break-keep md:text-2xl">
            궤도를 벗어난 페이지예요
          </h1>
          <p className="text-sm leading-6 text-fg-soft break-keep">
            찾으시는 페이지가 이 우주 어딘가로 사라졌어요.
          </p>
          <Link
            href="/"
            className="mt-1 w-fit rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong"
          >
            홈으로 귀환
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
