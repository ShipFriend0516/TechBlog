// 우주 장면 공용 캔버스 엔진 (404 페이지, 404 Lab) — 별, 유성, 파티클, 충돌 처리

export type SceneEnv = {
  w: number;
  h: number;
  t: number;
  dt: number;
  font: string;
};

export type Scene = {
  init: (w: number, h: number) => void;
  frame: (ctx: CanvasRenderingContext2D, env: SceneEnv) => void;
};

export const TAU = Math.PI * 2;

// 기존 토큰(accent, nebula)보다 한 단계 밝힌 404 전용 팔레트
export const COLORS = {
  mint: '#5EEAD4',
  emerald: '#34D399',
  lavender: '#A3ADFF',
  nebula: '#6D7CFF',
  peach: '#FDBA74',
  pink: '#F9A8D4',
  cream: '#FEF3C7',
  white: '#FFFFFF',
} as const;

type Range = readonly [number, number];

export const rand = (min: number, max: number) =>
  min + Math.random() * (max - min);
const between = ([min, max]: Range) => rand(min, max);
export const pick = <T>(list: readonly T[]): T =>
  list[Math.floor(Math.random() * list.length)];

export function rgba(hex: string, alpha: number) {
  const v = parseInt(hex.slice(1), 16);
  return `rgba(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}, ${alpha})`;
}

export function prune<T extends { dead: boolean }>(list: T[]) {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].dead) list.splice(i, 1);
  }
}

export function glow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, rgba(color, alpha));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

/* 별 */

export type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
};

export function makeStars(w: number, h: number, density = 0.00022): Star[] {
  return Array.from({ length: Math.round(w * h * density) }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: Math.random() < 0.1 ? rand(1.2, 1.8) : rand(0.4, 1.1),
    phase: rand(0, TAU),
    speed: rand(0.6, 2.2),
  }));
}

export function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  t: number,
  color: string = COLORS.white
) {
  ctx.fillStyle = color;
  for (const s of stars) {
    ctx.globalAlpha = 0.3 + 0.35 * (1 + Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* 유성 */

export type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  age: number;
  ttl: number;
  bounced: boolean;
  dead: boolean;
};

export type MeteorOptions = {
  angle: number;
  spread: number;
  speed: Range;
  size: Range;
  colors: readonly string[];
};

// 화면 안의 임의 지점을 지나가도록 진행 방향 반대편 바깥에서 출발시킨다
export function spawnMeteor(w: number, h: number, o: MeteorOptions): Meteor {
  const angle = o.angle + rand(-o.spread, o.spread);
  const speed = between(o.speed);
  const reach = Math.hypot(w, h) * 0.6;
  const tx = rand(0.1 * w, 0.9 * w);
  const ty = rand(0.1 * h, 0.8 * h);
  return {
    x: tx - Math.cos(angle) * reach,
    y: ty - Math.sin(angle) * reach,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: between(o.size),
    color: pick(o.colors),
    age: 0,
    ttl: (reach * 2) / speed,
    bounced: false,
    dead: false,
  };
}

export function updateMeteors(list: Meteor[], dt: number) {
  for (const m of list) {
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    m.age += dt;
    if (m.age > m.ttl) m.dead = true;
  }
}

// 충돌 판정은 꼬리를 고려해 머리 반지름보다 넉넉하게 잡는다
export function collideMeteors(
  list: Meteor[],
  onHit: (a: Meteor, b: Meteor, x: number, y: number) => void
) {
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (a.dead) continue;
    for (let j = i + 1; j < list.length; j++) {
      const b = list[j];
      if (b.dead) continue;
      if (Math.hypot(a.x - b.x, a.y - b.y) < (a.r + b.r) * 2.2) {
        onHit(a, b, (a.x + b.x) / 2, (a.y + b.y) / 2);
        if (a.dead) break;
      }
    }
  }
}

export function drawMeteor(
  ctx: CanvasRenderingContext2D,
  m: Meteor,
  { tail = 0.18, line = false }: { tail?: number; line?: boolean } = {}
) {
  const tx = m.x - m.vx * tail;
  const ty = m.y - m.vy * tail;
  const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
  g.addColorStop(0, rgba(m.color, 0.95));
  g.addColorStop(1, rgba(m.color, 0));
  ctx.strokeStyle = g;
  ctx.lineWidth = line ? Math.max(1, m.r * 0.6) : m.r * 1.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  if (line) {
    ctx.fillStyle = m.color;
    ctx.beginPath();
    ctx.arc(m.x, m.y, Math.max(1.2, m.r * 0.7), 0, TAU);
    ctx.fill();
    return;
  }
  const head = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
  head.addColorStop(0, rgba(COLORS.white, 0.95));
  head.addColorStop(0.3, rgba(m.color, 0.6));
  head.addColorStop(1, rgba(m.color, 0));
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.arc(m.x, m.y, m.r * 4, 0, TAU);
  ctx.fill();
}

/* 파티클 (불꽃, 먼지, 연기) */

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  grow: number;
  color: string;
  dead: boolean;
};

export type BurstOptions = {
  count: number;
  colors: readonly string[];
  speed: Range;
  size: Range;
  life: Range;
};

export function burst(list: Particle[], x: number, y: number, o: BurstOptions) {
  for (let i = 0; i < o.count; i++) {
    const angle = rand(0, TAU);
    const speed = between(o.speed);
    const life = between(o.life);
    list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      max: life,
      size: between(o.size),
      grow: 0,
      color: pick(o.colors),
      dead: false,
    });
  }
}

export function puff(
  list: Particle[],
  x: number,
  y: number,
  o: Pick<Particle, 'vx' | 'vy' | 'size' | 'grow' | 'life' | 'color'>
) {
  list.push({ ...o, x, y, max: o.life, dead: false });
}

export function updateParticles(
  list: Particle[],
  dt: number,
  { gravity = 0, drag = 1.6 }: { gravity?: number; drag?: number } = {}
) {
  const damp = Math.exp(-drag * dt);
  for (const p of list) {
    p.vy += gravity * dt;
    p.vx *= damp;
    p.vy *= damp;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.size += p.grow * dt;
    p.life -= dt;
    if (p.life <= 0) p.dead = true;
  }
  prune(list);
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  list: Particle[],
  opacity = 1
) {
  for (const p of list) {
    ctx.globalAlpha = Math.max(0, p.life / p.max) * opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* 섬광과 충격파 링 */

export type Flash = {
  x: number;
  y: number;
  r: number;
  life: number;
  max: number;
  color: string;
  ring: boolean;
  squash: number;
  dead: boolean;
};

export function flash(
  x: number,
  y: number,
  r: number,
  color: string,
  life: number,
  { ring = false, squash = 1 }: { ring?: boolean; squash?: number } = {}
): Flash {
  return { x, y, r, life, max: life, color, ring, squash, dead: false };
}

export function drawFlashes(
  ctx: CanvasRenderingContext2D,
  list: Flash[],
  dt: number
) {
  for (const f of list) {
    f.life -= dt;
    if (f.life <= 0) {
      f.dead = true;
      continue;
    }
    const k = f.life / f.max;
    if (f.ring) {
      const radius = f.r * (1 - k);
      ctx.strokeStyle = rgba(f.color, k * 0.9);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(f.x, f.y, radius, radius * f.squash, 0, 0, TAU);
      ctx.stroke();
    } else {
      glow(ctx, f.x, f.y, f.r * (1.4 - k * 0.4), f.color, k * 0.7);
    }
  }
  prune(list);
}

// 로컬 좌표(우주선 기준)를 화면 좌표로 바꾼다
export function toWorld(
  ox: number,
  oy: number,
  angle: number,
  scale: number,
  x: number,
  y: number
): [number, number] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [ox + scale * (x * c - y * s), oy + scale * (x * s + y * c)];
}
