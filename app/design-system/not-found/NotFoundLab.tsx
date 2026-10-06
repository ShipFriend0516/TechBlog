import Link from 'next/link';
import SceneCanvas from '@/app/entities/common/Animation/space/SceneCanvas';
import type { SceneId } from '@/app/entities/common/Animation/space/scenes';

const variants: {
  id: SceneId;
  name: string;
  label: string;
  description: string;
  digits: boolean;
}[] = [
  {
    id: 'crash',
    name: 'Crash Site',
    label: '불시착',
    description:
      '달 표면에 기수를 박은 우주선 위로 유성우가 쏟아집니다. 유성이 땅에 떨어지면 먼지가 튀고, 서로 부딪히면 불꽃이 터집니다.',
    digits: true,
  },
  {
    id: 'adrift',
    name: 'Adrift',
    label: '표류',
    description:
      '두 동강 난 우주선과 줄에 매달린 우주비행사. 유성에 맞은 잔해가 빙글 돌며 밀려났다가 천천히 제자리로 돌아옵니다.',
    digits: true,
  },
  {
    id: 'planet',
    name: 'Planet 0',
    label: '행성 404',
    description:
      '404의 0을 고리 행성으로 바꿨습니다. 우주선은 행성에 불시착했고, 유성은 숫자 4에 튕겨 나가거나 행성에 부딪힙니다.',
    digits: false,
  },
  {
    id: 'contour',
    name: 'Contour',
    label: '라인 아트',
    description:
      'Contour 로고처럼 선만으로 그린 미니멀 시안입니다. 추락 궤적과 구조 신호, 충돌 링이 HUD처럼 표시됩니다.',
    digits: true,
  },
  {
    id: 'field',
    name: 'Asteroid Field',
    label: '소행성대',
    description:
      '가장 밝은 시안입니다. 소행성끼리 실제로 튕기고, 우주선이 박힌 중앙 소행성은 천천히 돌아갑니다.',
    digits: true,
  },
];

const Copy = ({ digits }: { digits: boolean }) => (
  <div
    className={
      digits
        ? 'absolute left-0 top-0 flex max-w-xs flex-col gap-3 p-6 md:p-10'
        : 'absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-6 text-center md:p-8'
    }
  >
    {digits && (
      <p className="text-6xl font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#5EEAD4] to-[#A3ADFF] md:text-7xl">
        404
      </p>
    )}
    <h2 className="text-lg font-bold text-white break-keep md:text-xl">
      궤도를 벗어난 페이지예요
    </h2>
    <p className="text-sm leading-6 text-[#D5DAFF] break-keep">
      찾으시는 페이지가 이 우주 어딘가로 사라졌어요.
    </p>
    <span className="mt-1 w-fit rounded-full bg-[#34D399] px-4 py-2 text-sm font-semibold text-[#04110C]">
      홈으로 귀환
    </span>
  </div>
);

const NotFoundLab = () => (
  <main className="mx-auto max-w-5xl px-4 pb-24 pt-28">
    <Link
      href="/design-system"
      className="text-sm text-fg-muted hover:text-accent transition-colors"
    >
      ← Design System
    </Link>
    <header className="my-10 flex flex-col gap-3">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-nebula-soft">
        404 Lab
      </p>
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        불시착 404 시안
      </h1>
      <p className="max-w-2xl text-sm leading-7 text-fg-muted break-keep">
        Lottie 애니메이션을 대체할 404 장면 시안 5개입니다. 모두 캔버스로 직접
        그렸고, 유성 충돌은 매번 실제로 계산됩니다. 블로그의 우주·성운·초록
        토큰을 한 단계 밝혀 사용했습니다.
      </p>
    </header>

    <div className="flex flex-col gap-12">
      {variants.map((variant, index) => (
        <article key={variant.id} className="flex flex-col gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-[#1A1F55] sm:aspect-[16/9]">
            <SceneCanvas
              scene={variant.id}
              className="absolute inset-0 h-full w-full"
            />
            <Copy digits={variant.digits} />
          </div>
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
            <p className="flex items-baseline gap-2">
              <span className="text-sm tabular-nums text-fg-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-lg font-semibold">{variant.name}</span>
              <span className="text-sm text-accent">{variant.label}</span>
            </p>
            <p className="text-sm leading-6 text-fg-muted break-keep">
              {variant.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  </main>
);

export default NotFoundLab;
