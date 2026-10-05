'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useRef, useState, useSyncExternalStore } from 'react';
import styles from './logo.module.css';

const variants = [
  {
    id: 'original',
    name: 'Original',
    label: '현재 버전',
    description: '민트 행성과 라벤더 링. 제공한 이미지 그대로의 기준 시안.',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    label: '그라데이션',
    description: '민트에서 청록으로 흐르는 행성, 빛을 머금은 보랏빛 궤도.',
  },
  {
    id: 'outline',
    name: 'Contour',
    label: '아웃라인',
    description: '여백을 살린 선과 작은 위성. 가볍고 정교한 인상.',
  },
  {
    id: 'dual',
    name: 'Double orbit',
    label: '듀얼 오빗',
    description: '서로 다른 각도의 두 궤도. 연결과 확장을 표현한 심볼.',
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    label: '이클립스',
    description: '초승달처럼 남은 빛과 끊어진 궤도. 가장 차분한 우주.',
  },
  {
    id: 'star',
    name: 'North star',
    label: '스타 오빗',
    description: '위성을 길잡이 별로 바꾸고 링 끝에 속도감을 더한 시안.',
  },
  {
    id: 'monogram',
    name: 'Orbit S',
    label: '모노그램',
    description: '행성 안에 새긴 S와 비대칭 궤도. ShipFriend만의 서명.',
  },
] as const;
type Variant = (typeof variants)[number]['id'];
const storageKey = 'shipfriend-logo-lab-selection';
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('logo-selection', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('logo-selection', callback);
  };
};
function readSelection(): Variant {
  try {
    const value = localStorage.getItem(storageKey);
    return variants.find((variant) => variant.id === value)?.id ?? 'aurora';
  } catch {
    return 'aurora';
  }
}

function Logo({ variant, size = 240 }: { variant: Variant; size?: number }) {
  const id = useId().replace(/:/g, '');
  if (variant === 'original')
    return (
      <Image
        src="/images/logo-lab/original.png"
        alt="원본 행성 로고"
        width={size}
        height={size}
        unoptimized
      />
    );
  const outline = variant === 'outline';
  const eclipse = variant === 'eclipse';
  const gradient = variant === 'aurora';
  const ring = 'M 31 190 C 47 219 245 114 229 84';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 260 260"
      fill="none"
      role="img"
      aria-label={`${variants.find((v) => v.id === variant)?.name} 로고`}
    >
      <defs>
        <linearGradient
          id={`${id}-planet`}
          x1="65"
          y1="60"
          x2="192"
          y2="210"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6ef2bc" />
          <stop offset=".48" stopColor="#10b981" />
          <stop offset="1" stopColor="#087e96" />
        </linearGradient>
        <linearGradient
          id={`${id}-ring`}
          x1="35"
          y1="180"
          x2="228"
          y2="78"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7165ec" />
          <stop offset=".5" stopColor="#aaaaff" />
          <stop offset="1" stopColor="#e3dcff" />
        </linearGradient>
        <mask id={`${id}-crescent`}>
          <rect width="260" height="260" fill="white" />
          <circle cx="157" cy="108" r="68" fill="black" />
        </mask>
      </defs>
      <ellipse
        cx="130"
        cy="137"
        rx="112"
        ry="36"
        transform="rotate(-28 130 137)"
        stroke={eclipse ? '#8990d9' : '#a6a6ff'}
        strokeWidth={outline ? 5 : 10}
      />
      {variant === 'dual' && (
        <ellipse
          cx="130"
          cy="137"
          rx="101"
          ry="35"
          transform="rotate(38 130 137)"
          stroke="#57e1c2"
          strokeWidth="4"
        />
      )}
      <circle
        cx="130"
        cy="137"
        r="72"
        fill={
          outline
            ? 'none'
            : gradient
              ? `url(#${id}-planet)`
              : eclipse
                ? '#59dbb4'
                : '#10b981'
        }
        stroke={outline ? '#10b981' : 'none'}
        strokeWidth="5"
        mask={eclipse ? `url(#${id}-crescent)` : undefined}
      />
      {outline ? (
        <path
          d="M 37 154 C 1 209 173 176 224 92"
          stroke="#a6a6ff"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={ring}
          stroke={gradient ? `url(#${id}-ring)` : '#a6a6ff'}
          strokeWidth={eclipse ? 6 : 15}
          strokeLinecap="round"
        />
      )}
      {variant === 'monogram' && (
        <path
          d="M153 100 C115 76 91 121 126 133 C166 145 141 187 105 167"
          stroke="#e7fff5"
          strokeWidth="12"
          strokeLinecap="round"
        />
      )}
      {variant === 'star' ? (
        <path
          d="M211 28 L217 45 L234 51 L217 57 L211 74 L205 57 L188 51 L205 45Z"
          fill="#bdb4ff"
        />
      ) : (
        <circle
          cx={variant === 'dual' ? 47 : 207}
          cy={variant === 'dual' ? 63 : 48}
          r={outline ? 9 : 12}
          fill={outline ? 'none' : '#10b981'}
          stroke={outline ? '#10b981' : 'none'}
          strokeWidth="4"
        />
      )}
      {variant === 'star' && (
        <path
          d="M34 192 L52 190 M26 181 L40 177"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function LogoLab() {
  const selected = useSyncExternalStore(
    subscribe,
    readSelection,
    () => 'aurora' as Variant
  );
  const [background, setBackground] = useState<'dark' | 'light'>('dark');
  const [message, setMessage] = useState('');
  const preview = useRef<HTMLDivElement>(null);
  const current = variants.find((variant) => variant.id === selected)!;
  function select(id: Variant) {
    try {
      localStorage.setItem(storageKey, id);
      window.dispatchEvent(new Event('logo-selection'));
      setMessage('이 브라우저에 선택을 저장했습니다.');
    } catch {
      setMessage('브라우저 저장 공간을 사용할 수 없습니다.');
    }
  }
  function download() {
    const svg = preview.current?.querySelector('svg');
    const url = svg
      ? URL.createObjectURL(
          new Blob([new XMLSerializer().serializeToString(svg)], {
            type: 'image/svg+xml',
          })
        )
      : '/images/logo-lab/original.png';
    const link = document.createElement('a');
    link.href = url;
    link.download = `shipfriend-${selected}.${svg ? 'svg' : 'png'}`;
    link.click();
    if (svg) setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main className={styles.lab}>
      <Link href="/design-system" className={styles.back}>
        ← Design system
      </Link>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>SHIPFRIEND / IDENTITY EXPLORATION</p>
          <h1>같은 우주, 다른 궤도.</h1>
          <p className={styles.intro}>
            민트 행성과 라벤더 링에서 시작한 7개의 로고 시안.
            <br />
            마음에 드는 궤도를 선택하고, 실제 크기로 살펴보세요.
          </p>
        </div>
        <span className={styles.count}>
          01 — 07
          <br />
          <small>LOGO STUDIES</small>
        </span>
      </header>
      <section className={styles.workspace} aria-label="선택한 로고 미리보기">
        <div
          className={`${styles.hero} ${background === 'light' ? styles.light : styles.dark}`}
        >
          <div className={styles.toolbar}>
            <span>PREVIEW / {current.label}</span>
            <div className={styles.toggle}>
              {(['dark', 'light'] as const).map((mode) => (
                <button
                  key={mode}
                  aria-pressed={background === mode}
                  onClick={() => setBackground(mode)}
                >
                  {mode === 'dark' ? 'Dark' : 'Light'}
                </button>
              ))}
            </div>
          </div>
          <div ref={preview} className={styles.largeLogo}>
            <Logo variant={selected} size={300} />
          </div>
          <div className={styles.wordmark}>
            <strong>
              ShipFriend<span>®</span>
            </strong>
            <span>A LITTLE SPACE FOR BIG IDEAS</span>
          </div>
        </div>
        <div className={styles.details}>
          <p className={styles.eyebrow}>SELECTED CONCEPT</p>
          <h2>{current.name}</h2>
          <p>{current.description}</p>
          <div className={styles.sizes}>
            {[24, 40, 64].map((size) => (
              <div key={size}>
                <Logo variant={selected} size={size} />
                <span>{size}px</span>
              </div>
            ))}
          </div>
          <div className={styles.lockup}>
            <Logo variant={selected} size={42} />
            <strong>ShipFriend</strong>
            <span>Tech Blog</span>
          </div>
          <button className={styles.download} onClick={download}>
            선택한 로고 다운로드 ↗
          </button>
          <p className={styles.note}>
            선택은 이 브라우저에 저장됩니다. 실제 사이트 로고에는 자동 적용되지
            않습니다.
          </p>
          <p className={styles.status} role="status">
            {message}
          </p>
        </div>
      </section>
      <div className={styles.sectionHeading}>
        <h2>Explore the collection</h2>
        <span>카드를 눌러 비교해 보세요</span>
      </div>
      <div className={styles.grid}>
        {variants.map((variant, index) => (
          <button
            key={variant.id}
            className={`${styles.card} ${selected === variant.id ? styles.selected : ''}`}
            onClick={() => select(variant.id)}
            aria-pressed={selected === variant.id}
          >
            <div className={styles.cardTop}>
              <span>
                0{index + 1} / {variant.label}
              </span>
              <span>{selected === variant.id ? '● 선택됨' : '↗'}</span>
            </div>
            <div className={styles.cardArt}>
              <Logo variant={variant.id} size={190} />
            </div>
            <h3>{variant.name}</h3>
            <p>{variant.description}</p>
          </button>
        ))}
      </div>
    </main>
  );
}
