import { rand, rgba, TAU } from './engine';

// 우주선은 원점 중심, 기수가 위(-y)를 향하고 높이는 약 92 단위다
export const SHIP_NOSE = 52;
export const SHIP_NOZZLE = 40;

export type ShipStyle = {
  hull: string;
  shade: string;
  accent: string;
  glass: string;
  outline?: string;
};

const paths = () => ({
  body: new Path2D(
    'M0 -52 C16 -40 24 -20 22 6 L20 30 L-20 30 L-22 6 C-24 -20 -16 -40 0 -52 Z'
  ),
  finLeft: new Path2D('M-20 2 L-38 30 L-36 40 L-20 30 Z'),
  finRight: new Path2D('M20 2 L38 30 L36 40 L20 30 Z'),
  nozzle: new Path2D('M-12 30 L12 30 L15 40 L-15 40 Z'),
});
let cached: ReturnType<typeof paths> | null = null;

export function drawShip(ctx: CanvasRenderingContext2D, style: ShipStyle) {
  cached ??= paths();
  const { body, finLeft, finRight, nozzle } = cached;

  if (style.outline) {
    // 뒤에 지나가는 선이 비치지 않도록 배경색(hull)으로 먼저 채운다
    ctx.fillStyle = style.hull;
    [finLeft, finRight, nozzle, body].forEach((path) => ctx.fill(path));
    ctx.strokeStyle = style.outline;
    ctx.lineJoin = 'round';
    [finLeft, finRight, nozzle, body].forEach((path) => ctx.stroke(path));
    ctx.beginPath();
    ctx.moveTo(-22, 12);
    ctx.lineTo(22, 12);
    ctx.moveTo(-21.5, 19);
    ctx.lineTo(21.5, 19);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -14, 9, 0, TAU);
    ctx.stroke();
    return;
  }

  ctx.fillStyle = style.accent;
  ctx.fill(finLeft);
  ctx.fill(finRight);
  ctx.fillStyle = style.shade;
  ctx.fill(nozzle);
  ctx.fillStyle = style.hull;
  ctx.fill(body);

  ctx.save();
  ctx.clip(body);
  ctx.fillStyle = rgba(style.shade, 0.45);
  ctx.fillRect(7, -60, 30, 100);
  ctx.fillStyle = style.accent;
  ctx.fillRect(-30, 12, 60, 7);
  ctx.restore();

  ctx.fillStyle = style.glass;
  ctx.beginPath();
  ctx.arc(0, -14, 9, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = style.shade;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = rgba('#FFFFFF', 0.85);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -14, 5, Math.PI * 1.1, Math.PI * 1.45);
  ctx.stroke();
}

// 두 동강 난 우주선 — 지그재그 단면으로 앞/뒤를 잘라 그린다
const CRACK = 'L40 2 L25 12 L10 3 L-5 13 L-20 4 L-35 12 L-60 6';
const halves = () => ({
  front: new Path2D(`M-60 -70 L60 -70 L60 8 ${CRACK} Z`),
  back: new Path2D(`M60 8 ${CRACK} L-60 60 L60 60 Z`),
  crack: new Path2D(`M60 8 ${CRACK}`),
});
let cachedHalves: ReturnType<typeof halves> | null = null;

export function drawShipHalf(
  ctx: CanvasRenderingContext2D,
  style: ShipStyle,
  half: 'front' | 'back'
) {
  cachedHalves ??= halves();
  ctx.save();
  ctx.clip(cachedHalves[half]);
  drawShip(ctx, style);
  // 단면 선은 선체 안쪽에만 보이도록 한 번 더 자른다
  if (cached) ctx.clip(cached.body);
  ctx.strokeStyle = rgba('#1B1F57', 0.6);
  ctx.lineWidth = 2;
  ctx.stroke(cachedHalves.crack);
  ctx.restore();
}

export function drawAstronaut(ctx: CanvasRenderingContext2D, visor: string) {
  ctx.fillStyle = '#C9CFF5';
  ctx.beginPath();
  ctx.roundRect(-11, -4, 22, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#F4F7FF';
  ctx.beginPath();
  ctx.roundRect(-9, -2, 18, 26, 8);
  ctx.fill();
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#F4F7FF';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-8, 4);
  ctx.lineTo(-17, 13);
  ctx.moveTo(8, 4);
  ctx.lineTo(16, -4);
  ctx.moveTo(-4, 22);
  ctx.lineTo(-6, 33);
  ctx.moveTo(4, 22);
  ctx.lineTo(7, 32);
  ctx.stroke();
  ctx.fillStyle = '#F4F7FF';
  ctx.beginPath();
  ctx.arc(0, -12, 11, 0, TAU);
  ctx.fill();
  ctx.fillStyle = visor;
  ctx.beginPath();
  ctx.ellipse(1.5, -12, 7, 5.5, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = rgba('#FFFFFF', 0.8);
  ctx.beginPath();
  ctx.ellipse(-1, -14, 2, 1.3, -0.5, 0, TAU);
  ctx.fill();
}

// 울퉁불퉁한 소행성 외곽선 — 반지름 배율 목록을 미리 만들어 둔다
export const makeRock = (points = 11) =>
  Array.from({ length: points }, () => rand(0.78, 1.08));

export function drawRock(
  ctx: CanvasRenderingContext2D,
  shape: number[],
  r: number,
  light: string,
  dark: string
) {
  const g = ctx.createRadialGradient(-r * 0.4, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
  g.addColorStop(0, light);
  g.addColorStop(1, dark);
  ctx.fillStyle = g;
  ctx.beginPath();
  shape.forEach((k, i) => {
    const a = (i / shape.length) * TAU;
    const x = Math.cos(a) * r * k;
    const y = Math.sin(a) * r * k;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = rgba(dark, 0.55);
  ctx.beginPath();
  ctx.arc(r * 0.25, r * 0.2, r * 0.18, 0, TAU);
  ctx.moveTo(-r * 0.2, r * 0.35);
  ctx.arc(-r * 0.3, r * 0.35, r * 0.1, 0, TAU);
  ctx.fill();
}
