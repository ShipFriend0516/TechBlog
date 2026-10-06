import {
  burst,
  collideMeteors,
  COLORS,
  drawFlashes,
  drawMeteor,
  drawParticles,
  drawStars,
  flash,
  type Flash,
  glow,
  makeStars,
  type Meteor,
  type Particle,
  pick,
  prune,
  puff,
  rand,
  rgba,
  type Scene,
  spawnMeteor,
  type Star,
  TAU,
  toWorld,
  updateMeteors,
  updateParticles,
} from './engine';
import {
  drawAstronaut,
  drawRock,
  drawShip,
  drawShipHalf,
  makeRock,
  SHIP_NOZZLE,
  type ShipStyle,
} from './sprites';

const { mint, lavender, nebula, peach, pink, cream, white, emerald } = COLORS;

const SHIP: ShipStyle = {
  hull: '#EEF4FF',
  shade: '#9AA4E6',
  accent: emerald,
  glass: nebula,
};

// 화면 크기에 비례하는 기준 배율 (높이 420px 기준)
const scaleOf = (w: number, h: number) => Math.min(h / 420, w / 640);

const fillGradient = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stops: [number, string][],
  diagonal = false
) => {
  const g = ctx.createLinearGradient(0, 0, diagonal ? w : 0, h);
  stops.forEach(([at, color]) => g.addColorStop(at, color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
};

const sparkBurst = (
  list: Particle[],
  x: number,
  y: number,
  s: number,
  count = 22,
  colors: readonly string[] = [white, cream, mint]
) =>
  burst(list, x, y, {
    count,
    colors,
    speed: [60 * s, 220 * s],
    size: [1 * s, 2.6 * s],
    life: [0.5, 1.1],
  });

// 우주선 노즐에서 피어오르는 연기
const emitSmoke = (
  list: Particle[],
  x: number,
  y: number,
  s: number,
  drift: number
) =>
  puff(list, x, y, {
    vx: (drift + rand(-6, 6)) * s,
    vy: rand(-36, -22) * s,
    size: rand(4, 8) * s,
    grow: 9 * s,
    life: rand(2.2, 3.4),
    color: pick(['#C3C8F0', '#9097D8']),
  });

// 표면에 기수를 박은 우주선의 각도 — 기수가 중심(cx, cy)을 향하도록
const noseInto = (phi: number, tilt: number) =>
  Math.atan2(-Math.cos(phi), Math.sin(phi)) + tilt;

/* 1. Crash Site — 달 표면 불시착 */

export function crashSite(): Scene {
  let stars: Star[] = [];
  let craters: { x: number; r: number }[] = [];
  const meteors: Meteor[] = [];
  const sparks: Particle[] = [];
  const smoke: Particle[] = [];
  const flashes: Flash[] = [];
  let spawnIn = 0;
  let smokeIn = 0;
  let zapIn = 2;

  return {
    init(w, h) {
      stars = makeStars(w, h * 0.85);
      craters = Array.from({ length: 5 }, () => ({
        x: rand(0.04, 0.96),
        r: rand(14, 32),
      }));
      meteors.length = 0;
    },
    frame(ctx, { w, h, t, dt }) {
      const s = scaleOf(w, h);
      const ground = (x: number) =>
        h * 0.8 + ((x - w * 0.5) / w) ** 2 * h * 0.35;

      fillGradient(ctx, w, h, [
        [0, '#1E2463'],
        [0.65, '#3A3F9E'],
        [1, '#6B6FD6'],
      ]);
      glow(ctx, w * 0.8, h * 0.18, h * 0.65, lavender, 0.3);
      glow(ctx, w * 0.12, h * 0.4, h * 0.5, mint, 0.14);
      drawStars(ctx, stars, t);

      spawnIn -= dt;
      if (spawnIn <= 0) {
        meteors.push(
          spawnMeteor(w, h, {
            angle: 2.25,
            spread: 0.22,
            speed: [260 * s, 420 * s],
            size: [1.6 * s, 3 * s],
            colors: [mint, lavender, peach, cream],
          })
        );
        spawnIn = rand(0.22, 0.6);
      }
      updateMeteors(meteors, dt);
      for (const m of meteors) {
        if (m.dead || m.y < ground(m.x)) continue;
        m.dead = true;
        const gy = ground(m.x);
        burst(sparks, m.x, gy, {
          count: 14,
          colors: [cream, peach, lavender],
          speed: [40 * s, 150 * s],
          size: [1 * s, 2.2 * s],
          life: [0.4, 0.9],
        });
        flashes.push(flash(m.x, gy, 36 * s, peach, 0.6));
      }
      collideMeteors(meteors, (a, b, x, y) => {
        a.dead = b.dead = true;
        sparkBurst(sparks, x, y, s);
        flashes.push(flash(x, y, 60 * s, white, 0.5));
      });
      prune(meteors);
      meteors.forEach((m) => drawMeteor(ctx, m));

      // 우주선을 먼저 그리고 지면으로 덮어 기수가 묻힌 것처럼 보이게 한다
      const k = s * 1.5;
      const sx = w * 0.66;
      const sy = ground(sx) - 26 * s;
      const angle = 2.75;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.scale(k, k);
      drawShip(ctx, SHIP);
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w + 8; x += 8) ctx.lineTo(x, ground(x));
      ctx.lineTo(w, h);
      ctx.closePath();
      const soil = ctx.createLinearGradient(0, h * 0.78, 0, h);
      soil.addColorStop(0, '#343A92');
      soil.addColorStop(1, '#1D2160');
      ctx.fillStyle = soil;
      ctx.fill();
      ctx.strokeStyle = rgba(lavender, 0.7);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w + 8; x += 8) ctx.lineTo(x, ground(x));
      ctx.stroke();

      for (const c of craters) {
        const x = c.x * w;
        const y = ground(x) + c.r * 0.5 * s;
        ctx.fillStyle = rgba('#12153F', 0.35);
        ctx.beginPath();
        ctx.ellipse(x, y, c.r * s, c.r * 0.28 * s, 0, 0, TAU);
        ctx.fill();
      }
      // 기수가 박힌 자리의 흙더미
      const [nx] = toWorld(sx, sy, angle, k, 0, -52);
      ctx.fillStyle = '#3E44A6';
      ctx.beginPath();
      ctx.ellipse(nx, ground(nx) + 2 * s, 30 * s, 7 * s, 0, Math.PI, TAU);
      ctx.fill();

      drawFlashes(ctx, flashes, dt);
      updateParticles(sparks, dt, { gravity: 160 * s });
      drawParticles(ctx, sparks);

      const [ex, ey] = toWorld(sx, sy, angle, k, 0, SHIP_NOZZLE);
      smokeIn -= dt;
      if (smokeIn <= 0) {
        emitSmoke(smoke, ex, ey, s, 14);
        smokeIn = 0.12;
      }
      zapIn -= dt;
      if (zapIn <= 0) {
        sparkBurst(sparks, ex, ey, s * 0.6, 10, [peach, cream]);
        zapIn = rand(1.6, 3.2);
      }
      updateParticles(smoke, dt, { drag: 0.4 });
      drawParticles(ctx, smoke, 0.45);

      const [bx, by] = toWorld(sx, sy, angle, k, -36, 40);
      if (t % 1.2 < 0.5) glow(ctx, bx, by, 14 * s, peach, 0.9);
    },
  };
}

/* 2. Adrift — 두 동강 난 우주선과 우주비행사 */

type Part = {
  half: 'front' | 'back';
  hx: number;
  hy: number;
  base: number;
  phase: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  tilt: number;
  spin: number;
};

export function adrift(): Scene {
  let stars: Star[] = [];
  let parts: Part[] = [];
  let debris: {
    orbit: number;
    a: number;
    speed: number;
    rot: number;
    size: number;
  }[] = [];
  const meteors: Meteor[] = [];
  const sparks: Particle[] = [];
  const flashes: Flash[] = [];
  let spawnIn = 0;
  let zapIn = 1;

  const part = (
    half: Part['half'],
    hx: number,
    hy: number,
    base: number,
    phase: number
  ): Part => ({
    half,
    hx,
    hy,
    base,
    phase,
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
    tilt: 0,
    spin: 0,
  });

  return {
    init(w, h) {
      stars = makeStars(w, h);
      parts = [part('back', 42, 34, 0.4, 2), part('front', -38, -28, -0.6, 0)];
      debris = Array.from({ length: 9 }, () => ({
        orbit: rand(80, 170),
        a: rand(0, TAU),
        speed: rand(-0.12, 0.12),
        rot: rand(0, TAU),
        size: rand(3, 7),
      }));
      meteors.length = 0;
    },
    frame(ctx, { w, h, t, dt }) {
      const s = scaleOf(w, h);
      const k = s * 1.15;
      const cx = w * 0.64;
      const cy = h * 0.5;

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
      bg.addColorStop(0, '#3D3A9C');
      bg.addColorStop(1, '#171C52');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      glow(ctx, w * 0.15, h * 0.85, h * 0.6, mint, 0.16);
      glow(ctx, w * 0.9, h * 0.1, h * 0.5, pink, 0.14);
      drawStars(ctx, stars, t);

      for (const d of debris) {
        d.a += d.speed * dt;
        d.rot += dt * 0.8;
        const x = cx + Math.cos(d.a) * d.orbit * k;
        const y = cy + Math.sin(d.a) * d.orbit * k * 0.6;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(d.rot);
        ctx.fillStyle = rgba('#C9D1FF', 0.85);
        ctx.beginPath();
        ctx.moveTo(-d.size * s, 0);
        ctx.lineTo(d.size * s, -d.size * 0.6 * s);
        ctx.lineTo(d.size * 0.4 * s, d.size * 0.8 * s);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      spawnIn -= dt;
      if (spawnIn <= 0) {
        meteors.push(
          spawnMeteor(w, h, {
            angle: rand(0, TAU),
            spread: 0,
            speed: [200 * s, 340 * s],
            size: [1.5 * s, 2.8 * s],
            colors: [mint, lavender, peach, pink],
          })
        );
        spawnIn = rand(0.3, 0.75);
      }
      updateMeteors(meteors, dt);
      collideMeteors(meteors, (a, b, x, y) => {
        a.dead = b.dead = true;
        sparkBurst(sparks, x, y, s);
        flashes.push(flash(x, y, 60 * s, white, 0.5));
      });

      // 잔해는 스프링처럼 제자리로 돌아오고, 유성에 맞으면 밀리며 회전한다
      const placed = parts.map((p) => {
        const damp = Math.exp(-0.9 * dt);
        p.vx += (-6 * p.ox - 2.2 * p.vx) * dt;
        p.vy += (-6 * p.oy - 2.2 * p.vy) * dt;
        p.ox += p.vx * dt;
        p.oy += p.vy * dt;
        p.spin = (p.spin - 1.2 * p.tilt * dt) * damp;
        p.tilt += p.spin * dt;
        const x = cx + p.hx * k + p.ox + Math.sin(t * 0.5 + p.phase) * 5 * s;
        const y = cy + p.hy * k + p.oy + Math.cos(t * 0.4 + p.phase) * 6 * s;
        const angle = p.base + Math.sin(t * 0.3 + p.phase) * 0.12 + p.tilt;

        for (const m of meteors) {
          if (m.dead || Math.hypot(m.x - x, m.y - y) > 34 * k) continue;
          m.dead = true;
          sparkBurst(sparks, m.x, m.y, s, 18, [white, peach, cream]);
          flashes.push(flash(m.x, m.y, 50 * s, peach, 0.45));
          p.vx += m.vx * 0.12;
          p.vy += m.vy * 0.12;
          p.spin += Math.sign((m.x - x) * m.vy - (m.y - y) * m.vx) * 1.4;
        }
        return { p, x, y, angle };
      });
      prune(meteors);
      meteors.forEach((m) => drawMeteor(ctx, m));

      const back = placed[0];
      const ax = cx - 150 * k + Math.sin(t * 0.45) * 12 * s;
      const ay = cy + 62 * k + Math.cos(t * 0.35) * 10 * s;
      const [tx, ty] = toWorld(back.x, back.y, back.angle, k, -18, 28);
      ctx.strokeStyle = rgba(white, 0.55);
      ctx.lineWidth = 1.2 * s;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(
        (tx + ax) / 2,
        (ty + ay) / 2 + Math.sin(t * 0.6) * 30 * s,
        ax,
        ay
      );
      ctx.stroke();

      for (const { p, x, y, angle } of placed) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(k, k);
        drawShipHalf(ctx, SHIP, p.half);
        ctx.restore();
      }

      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(Math.sin(t * 0.3) * 0.5 - 0.3);
      ctx.scale(k * 0.9, k * 0.9);
      drawAstronaut(ctx, nebula);
      ctx.restore();

      // 앞쪽 잔해의 단면에서 가끔 전기 스파크가 튄다
      zapIn -= dt;
      if (zapIn <= 0) {
        const front = placed[1];
        const [zx, zy] = toWorld(front.x, front.y, front.angle, k, 0, 8);
        sparkBurst(sparks, zx, zy, s * 0.5, 8, [mint, cream]);
        zapIn = rand(1, 2.5);
      }

      drawFlashes(ctx, flashes, dt);
      updateParticles(sparks, dt);
      drawParticles(ctx, sparks);
    },
  };
}

/* 3. Planet 0 — 404의 0이 고리 행성 */

export function planetZero(): Scene {
  let stars: Star[] = [];
  const meteors: Meteor[] = [];
  const sparks: Particle[] = [];
  const smoke: Particle[] = [];
  const flashes: Flash[] = [];
  let spawnIn = 0;
  let smokeIn = 0;

  return {
    init(w, h) {
      stars = makeStars(w, h);
      meteors.length = 0;
    },
    frame(ctx, { w, h, t, dt, font }) {
      const s = scaleOf(w, h);
      const cx = w / 2;
      const cy = h * 0.42;
      const R = Math.min(h * 0.2, w * 0.13);
      const gap = R * 2.35;
      const ring = { rx: R * 1.8, ry: R * 0.45, rot: -0.3 };

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
      bg.addColorStop(0, '#3B3FA8');
      bg.addColorStop(0.5, '#262A78');
      bg.addColorStop(1, '#171A4D');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      glow(ctx, cx, cy, R * 3.2, lavender, 0.22);
      drawStars(ctx, stars, t);

      spawnIn -= dt;
      if (spawnIn <= 0) {
        meteors.push(
          spawnMeteor(w, h, {
            angle: pick([2.25, 0.9]),
            spread: 0.3,
            speed: [220 * s, 360 * s],
            size: [1.5 * s, 2.8 * s],
            colors: [mint, lavender, peach, cream],
          })
        );
        spawnIn = rand(0.25, 0.65);
      }
      updateMeteors(meteors, dt);

      for (const m of meteors) {
        if (m.dead) continue;
        // 행성에 부딪히면 표면에서 폭발
        const dx = m.x - cx;
        const dy = m.y - cy;
        const d = Math.hypot(dx, dy);
        if (d < R) {
          m.dead = true;
          const px = cx + (dx / d) * R;
          const py = cy + (dy / d) * R;
          sparkBurst(sparks, px, py, s, 16, [cream, peach, mint]);
          flashes.push(flash(px, py, 40 * s, peach, 0.5));
          continue;
        }
        // 숫자 4에 부딪히면 튕겨 나간다
        if (m.bounced) continue;
        for (const ox of [cx - gap, cx + gap]) {
          const bx = m.x - ox;
          const by = m.y - cy;
          const bd = Math.hypot(bx, by);
          if (bd > R * 0.95) continue;
          const nx = bx / bd;
          const ny = by / bd;
          const dot = m.vx * nx + m.vy * ny;
          if (dot >= 0) continue;
          m.vx -= 2 * dot * nx;
          m.vy -= 2 * dot * ny;
          m.bounced = true;
          m.age = 0;
          sparkBurst(sparks, m.x, m.y, s * 0.7, 12);
          flashes.push(flash(m.x, m.y, 30 * s, white, 0.4, { ring: true }));
        }
      }
      collideMeteors(meteors, (a, b, x, y) => {
        a.dead = b.dead = true;
        sparkBurst(sparks, x, y, s);
        flashes.push(flash(x, y, 60 * s, white, 0.5));
      });
      prune(meteors);
      meteors.forEach((m) => drawMeteor(ctx, m));

      const digits = ctx.createLinearGradient(0, cy - R, 0, cy + R);
      digits.addColorStop(0, mint);
      digits.addColorStop(1, lavender);
      ctx.fillStyle = digits;
      ctx.font = `800 ${R * 2.6}px ${font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('4', cx - gap, cy + R * 0.08);
      ctx.fillText('4', cx + gap, cy + R * 0.08);

      const strokeRing = (from: number, to: number, alpha: number) => {
        ctx.strokeStyle = rgba(lavender, alpha);
        ctx.lineWidth = R * 0.09;
        ctx.beginPath();
        ctx.ellipse(cx, cy, ring.rx, ring.ry, ring.rot, from, to);
        ctx.stroke();
      };
      strokeRing(Math.PI, TAU, 0.55);

      const k = R / 75;
      const phi = -1.0;
      const angle = noseInto(phi, 0.3);
      const sx = cx + Math.cos(phi) * (R + 22 * k);
      const sy = cy + Math.sin(phi) * (R + 22 * k);
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.scale(k, k);
      drawShip(ctx, SHIP);
      ctx.restore();

      const planet = ctx.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.35,
        R * 0.05,
        cx,
        cy,
        R
      );
      planet.addColorStop(0, '#C8FCEE');
      planet.addColorStop(0.35, mint);
      planet.addColorStop(0.75, '#10B981');
      planet.addColorStop(1, '#0B6B55');
      ctx.fillStyle = planet;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.fillStyle = rgba('#065F46', 0.35);
      [
        [0.3, 0.25, 0.16],
        [-0.35, 0.4, 0.1],
        [0.05, -0.45, 0.08],
      ].forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(cx + x * R, cy + y * R, r * R, 0, TAU);
        ctx.fill();
      });
      ctx.restore();
      strokeRing(0, Math.PI, 0.9);

      drawFlashes(ctx, flashes, dt);
      updateParticles(sparks, dt);
      drawParticles(ctx, sparks);

      const [ex, ey] = toWorld(sx, sy, angle, k, 0, SHIP_NOZZLE);
      smokeIn -= dt;
      if (smokeIn <= 0) {
        emitSmoke(smoke, ex, ey, s * 0.8, 10);
        smokeIn = 0.14;
      }
      updateParticles(smoke, dt, { drag: 0.4 });
      drawParticles(ctx, smoke, 0.45);
    },
  };
}

/* 4. Contour — 선으로만 그린 HUD 스타일 */

export function contour(): Scene {
  let stars: Star[] = [];
  const meteors: Meteor[] = [];
  const sparks: Particle[] = [];
  const flashes: Flash[] = [];
  let spawnIn = 0;
  let pingIn = 0;
  const BG = '#1A1F55';

  return {
    init(w, h) {
      stars = makeStars(w, h * 0.78, 0.00012);
      meteors.length = 0;
    },
    frame(ctx, { w, h, t, dt }) {
      const s = scaleOf(w, h);
      const horizon = h * 0.76;

      fillGradient(ctx, w, h, [
        [0, BG],
        [1, '#262E74'],
      ]);
      const step = 28 * s;
      ctx.fillStyle = rgba(lavender, 0.14);
      for (let x = step / 2; x < w; x += step) {
        for (let y = step / 2; y < horizon; y += step) {
          ctx.fillRect(x, y, 1.2, 1.2);
        }
      }
      drawStars(ctx, stars, t, lavender);

      ctx.strokeStyle = rgba(mint, 0.8);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(w, horizon);
      ctx.stroke();
      [10, 24, 44].forEach((gap, i) => {
        ctx.strokeStyle = rgba(mint, 0.3 - i * 0.08);
        ctx.beginPath();
        ctx.moveTo(0, horizon + gap * s);
        ctx.lineTo(w, horizon + gap * s);
        ctx.stroke();
      });

      const k = s * 1.25;
      const sx = w * 0.66;
      const sy = horizon - 4 * s;
      const angle = 2.5;

      // 추락 궤적
      ctx.save();
      ctx.setLineDash([4 * s, 8 * s]);
      ctx.lineDashOffset = -t * 30 * s;
      ctx.strokeStyle = rgba(mint, 0.5);
      ctx.beginPath();
      ctx.moveTo(w * 0.04, h * 0.08);
      ctx.quadraticCurveTo(w * 0.45, h * 0.0, sx, sy);
      ctx.stroke();
      ctx.restore();

      spawnIn -= dt;
      if (spawnIn <= 0) {
        meteors.push(
          spawnMeteor(w, h, {
            angle: 2.3,
            spread: 0.25,
            speed: [240 * s, 380 * s],
            size: [1.6 * s, 2.6 * s],
            colors: [mint, lavender, peach],
          })
        );
        spawnIn = rand(0.3, 0.7);
      }
      updateMeteors(meteors, dt);
      for (const m of meteors) {
        if (m.dead || m.y < horizon) continue;
        m.dead = true;
        flashes.push(
          flash(m.x, horizon, 46 * s, mint, 0.9, { ring: true, squash: 0.25 })
        );
      }
      collideMeteors(meteors, (a, b, x, y) => {
        a.dead = b.dead = true;
        flashes.push(flash(x, y, 56 * s, lavender, 0.9, { ring: true }));
        flashes.push(flash(x, y, 28 * s, peach, 0.6, { ring: true }));
        burst(sparks, x, y, {
          count: 12,
          colors: [lavender, mint],
          speed: [50 * s, 160 * s],
          size: [0.8 * s, 1.4 * s],
          life: [0.4, 0.8],
        });
      });
      prune(meteors);
      meteors.forEach((m) => drawMeteor(ctx, m, { line: true, tail: 0.22 }));

      // 지평선 위쪽만 보이도록 잘라 기수가 땅에 박힌 것처럼 그린다
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, horizon);
      ctx.clip();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.scale(k, k);
      ctx.lineWidth = 1.6 / k;
      drawShip(ctx, { ...SHIP, hull: BG, outline: lavender });
      ctx.restore();

      const [bx, by] = toWorld(sx, sy, angle, k, -36, 40);
      pingIn -= dt;
      if (pingIn <= 0) {
        flashes.push(flash(bx, by, 80 * s, peach, 1.6, { ring: true }));
        pingIn = 1.8;
      }
      ctx.fillStyle = t % 1 < 0.5 ? peach : rgba(peach, 0.3);
      ctx.beginPath();
      ctx.arc(bx, by, 2.4 * s, 0, TAU);
      ctx.fill();

      drawFlashes(ctx, flashes, dt);
      updateParticles(sparks, dt);
      drawParticles(ctx, sparks);

      ctx.font = `600 ${11 * s}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = rgba(mint, 0.85);
      const cursor = t % 1 < 0.5 ? '_' : ' ';
      ctx.fillText(`SIGNAL LOST · ERR 404${cursor}`, 20 * s, h - 34 * s);
      ctx.fillStyle = rgba(lavender, 0.7);
      const lat = (-23.4417 + Math.sin(t * 0.7) * 0.0004).toFixed(4);
      const lon = (151.2093 + Math.cos(t * 0.5) * 0.0004).toFixed(4);
      ctx.fillText(`LAT ${lat}  LON ${lon}`, 20 * s, h - 18 * s);
    },
  };
}

/* 5. Asteroid Field — 서로 튕기는 소행성들 */

type Rock = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  spin: number;
  shape: number[];
  fixed: boolean;
};

export function asteroidField(): Scene {
  let stars: Star[] = [];
  let rocks: Rock[] = [];
  const meteors: Meteor[] = [];
  const sparks: Particle[] = [];
  const smoke: Particle[] = [];
  const flashes: Flash[] = [];
  let spawnIn = 0;
  let smokeIn = 0;

  return {
    init(w, h) {
      const s = scaleOf(w, h);
      stars = makeStars(w, h);
      const big: Rock = {
        x: w * 0.64,
        y: h * 0.56,
        vx: 0,
        vy: 0,
        r: Math.min(h * 0.17, w * 0.12),
        rot: 0,
        spin: 0.08,
        shape: makeRock(14),
        fixed: true,
      };
      rocks = [big];
      for (let tries = 0; rocks.length < 7 && tries < 200; tries++) {
        const r = rand(10, 26) * s;
        const x = rand(r, w - r);
        const y = rand(r, h - r);
        const clear = rocks.every(
          (o) => Math.hypot(o.x - x, o.y - y) > o.r + r + 24 * s
        );
        if (!clear) continue;
        const a = rand(0, TAU);
        const v = rand(20, 50) * s;
        rocks.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          r,
          rot: rand(0, TAU),
          spin: rand(-0.8, 0.8),
          shape: makeRock(),
          fixed: false,
        });
      }
      meteors.length = 0;
    },
    frame(ctx, { w, h, t, dt }) {
      const s = scaleOf(w, h);
      const big = rocks[0];

      fillGradient(
        ctx,
        w,
        h,
        [
          [0, '#3E3199'],
          [0.55, '#3150B5'],
          [1, '#1C7C95'],
        ],
        true
      );
      glow(ctx, w * 0.9, h * 0.1, h * 0.6, pink, 0.22);
      glow(ctx, w * 0.1, h * 0.9, h * 0.6, mint, 0.22);
      drawStars(ctx, stars, t);

      for (const r of rocks) {
        r.rot += r.spin * dt;
        if (r.fixed) continue;
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        if (r.x < -r.r) r.x = w + r.r;
        if (r.x > w + r.r) r.x = -r.r;
        if (r.y < -r.r) r.y = h + r.r;
        if (r.y > h + r.r) r.y = -r.r;
      }
      // 질량(반지름²)을 반영한 탄성 충돌, 중앙 소행성은 움직이지 않는다
      for (let i = 0; i < rocks.length; i++) {
        for (let j = i + 1; j < rocks.length; j++) {
          const a = rocks[i];
          const b = rocks[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          const min = (a.r + b.r) * 0.92;
          if (d >= min || d === 0) continue;
          const nx = dx / d;
          const ny = dy / d;
          const ia = a.fixed ? 0 : 1 / (a.r * a.r);
          const ib = b.fixed ? 0 : 1 / (b.r * b.r);
          const overlap = (min - d) / (ia + ib);
          a.x -= nx * overlap * ia;
          a.y -= ny * overlap * ia;
          b.x += nx * overlap * ib;
          b.y += ny * overlap * ib;
          const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rv >= 0) continue;
          const impulse = (-1.9 * rv) / (ia + ib);
          a.vx -= impulse * ia * nx;
          a.vy -= impulse * ia * ny;
          b.vx += impulse * ib * nx;
          b.vy += impulse * ib * ny;
          if (!a.fixed) a.spin += rand(-1, 1);
          if (!b.fixed) b.spin += rand(-1, 1);
          const px = a.x + nx * a.r;
          const py = a.y + ny * a.r;
          sparkBurst(sparks, px, py, s * 0.7, 14, [cream, white, lavender]);
          flashes.push(flash(px, py, 34 * s, white, 0.4));
        }
      }

      spawnIn -= dt;
      if (spawnIn <= 0) {
        meteors.push(
          spawnMeteor(w, h, {
            angle: pick([2.3, 0.85, 3.6]),
            spread: 0.3,
            speed: [240 * s, 380 * s],
            size: [1.6 * s, 3 * s],
            colors: [cream, pink, '#A5F3FC', mint],
          })
        );
        spawnIn = rand(0.25, 0.6);
      }
      updateMeteors(meteors, dt);
      for (const m of meteors) {
        if (m.dead) continue;
        const hit = rocks.find(
          (r) => Math.hypot(m.x - r.x, m.y - r.y) < r.r * 0.95
        );
        if (!hit) continue;
        m.dead = true;
        sparkBurst(sparks, m.x, m.y, s, 18, [white, cream, pink]);
        flashes.push(flash(m.x, m.y, 44 * s, cream, 0.5));
        if (hit.fixed) continue;
        const push = ((m.r * m.r) / (hit.r * hit.r)) * 6;
        hit.vx += m.vx * push;
        hit.vy += m.vy * push;
        hit.spin += rand(-1.5, 1.5);
      }
      collideMeteors(meteors, (a, b, x, y) => {
        a.dead = b.dead = true;
        sparkBurst(sparks, x, y, s);
        flashes.push(flash(x, y, 60 * s, white, 0.5));
      });
      prune(meteors);
      meteors.forEach((m) => drawMeteor(ctx, m));

      for (const r of rocks.slice(1)) {
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rot);
        drawRock(ctx, r.shape, r.r, '#D9DCF7', '#6E76C4');
        ctx.restore();
      }

      // 우주선은 중앙 소행성에 박힌 채 함께 돈다
      const k = big.r / 70;
      const phi = -1.2 + big.rot;
      const angle = noseInto(phi, 0.25);
      const sx = big.x + Math.cos(phi) * (big.r + 18 * k);
      const sy = big.y + Math.sin(phi) * (big.r + 18 * k);
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.scale(k, k);
      drawShip(ctx, SHIP);
      ctx.restore();

      ctx.save();
      ctx.translate(big.x, big.y);
      ctx.rotate(big.rot);
      drawRock(ctx, big.shape, big.r, '#E4E7FF', '#6A70C9');
      ctx.restore();

      drawFlashes(ctx, flashes, dt);
      updateParticles(sparks, dt);
      drawParticles(ctx, sparks);

      const [ex, ey] = toWorld(sx, sy, angle, k, 0, SHIP_NOZZLE);
      smokeIn -= dt;
      if (smokeIn <= 0) {
        emitSmoke(smoke, ex, ey, s * 0.8, 0);
        smokeIn = 0.14;
      }
      updateParticles(smoke, dt, { drag: 0.4 });
      drawParticles(ctx, smoke, 0.4);

      const [bx, by] = toWorld(sx, sy, angle, k, 36, 40);
      if (t % 1 < 0.45) glow(ctx, bx, by, 14 * s, pink, 0.95);
    },
  };
}

export const scenes = {
  crash: crashSite,
  adrift,
  planet: planetZero,
  contour,
  field: asteroidField,
} as const;

export type SceneId = keyof typeof scenes;
