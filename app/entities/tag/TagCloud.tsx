'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TagData, TagWithPosition } from '@/app/types/Tag';

interface TagCloudProps {
  tags: TagData[];
}

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
}

const RADIUS = 200;
const PARTICLE_COUNT = 80;
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

const TagCloud = ({ tags }: TagCloudProps) => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 입자 생성 — RADIUS, PARTICLE_COUNT가 상수이므로 의존성 없음
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
      const theta = 2 * Math.PI * i * GOLDEN_RATIO;
      const r = RADIUS * (0.8 + Math.random() * 0.4);

      return {
        id: i,
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        size: 2 + Math.random() * 2,
      };
    });
  }, []);

  // 마우스 위치 추적 — RAF로 throttle해 리렌더 횟수 제한
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      };

      if (rafRef.current !== undefined) return;
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ ...mousePosRef.current });
        rafRef.current = undefined;
      });
    },
    []
  );

  // Fibonacci Sphere 알고리즘으로 3D 구형 좌표 계산
  const tagsWithPositions = useMemo(() => {
    const total = tags.length;
    return tags.map((tag, index) => {
      const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
      const theta = 2 * Math.PI * index * GOLDEN_RATIO;

      return {
        ...tag,
        position: {
          x: RADIUS * Math.sin(phi) * Math.cos(theta),
          y: RADIUS * Math.sin(phi) * Math.sin(theta),
          z: RADIUS * Math.cos(phi),
        },
      };
    });
  }, [tags]);

  // Z축 기반 스타일 계산
  const getTagStyle = useCallback(
    (tagWithPos: TagWithPosition, isHovered: boolean) => {
      const { position, count } = tagWithPos;
      const { x, y, z } = position;

      const normalized = (z + RADIUS) / (RADIUS * 2);
      const maxCount = tags[0]?.count ?? 1;
      const countFactor = Math.log(count + 1) / Math.log(maxCount + 1);
      const baseSize = 0.7 + countFactor * 0.6;

      const scale = (1 + normalized * 0.5) * baseSize;
      const opacity = isHovered ? 1 : 0.3 + normalized * 0.7;
      const blur = isHovered ? 0 : (1 - normalized) * 2;

      const baseFontSize = isMobile ? 10 : 12;
      const maxFontSize = isMobile ? 18 : 24;
      const fontSize = (baseFontSize + normalized * maxFontSize) * baseSize * 0.7;

      return {
        x,
        y,
        scale: isHovered ? scale * 1.3 : scale,
        opacity,
        filter: `blur(${blur}px)`,
        fontSize: `${fontSize}px`,
        zIndex: isHovered ? 200 : Math.round(normalized * 100),
      };
    },
    [tags, isMobile]
  );

  // 주변 태그 밀어내기 효과 계산
  const calculatePushEffect = useCallback(
    (targetPos: TagWithPosition, hoveredPos: TagWithPosition) => {
      if (isMobile || !hoveredTag || hoveredTag !== hoveredPos.tag) {
        return { x: 0, y: 0 };
      }

      const dx = targetPos.position.x - hoveredPos.position.x;
      const dy = targetPos.position.y - hoveredPos.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 100 || distance === 0) return { x: 0, y: 0 };

      const force = (1 - distance / 100) * 30;
      const angle = Math.atan2(dy, dx);
      return { x: Math.cos(angle) * force, y: Math.sin(angle) * force };
    },
    [isMobile, hoveredTag]
  );

  // 입자별 마우스 밀림 효과 계산
  const getParticlePushEffect = useCallback(
    (particle: Particle) => {
      if (isMobile) return { x: 0, y: 0 };

      const dx = particle.x - mousePos.x;
      const dy = particle.y - mousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 150 || distance === 0) return { x: 0, y: 0 };

      const force = (1 - distance / 150) * 50;
      const angle = Math.atan2(dy, dx);
      return { x: Math.cos(angle) * force, y: Math.sin(angle) * force };
    },
    [isMobile, mousePos]
  );

  const hoveredTagData = useMemo(
    () => tagsWithPositions.find((t) => t.tag === hoveredTag),
    [tagsWithPositions, hoveredTag]
  );

  return (
    <div
      className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* 그라데이션 배경 */}
      <div className="absolute rounded-full h-[400px] md:h-[600px] mx-auto aspect-square inset-0 bg-gradient-radial from-primary-caribbean/5 via-transparent to-transparent dark:from-primary-mountain/10 dark:via-transparent dark:to-transparent" />

      {/* 입자들 */}
      {!isMobile &&
        particles.map((particle) => {
          const normalized = (particle.z + RADIUS) / (RADIUS * 2);
          const pushEffect = getParticlePushEffect(particle);

          return (
            <motion.div
              key={`particle-${particle.id}`}
              className="absolute rounded-full pointer-events-none bg-slate-500 dark:bg-primary-mountain"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                zIndex: Math.round(normalized * 50),
              }}
              animate={{
                x: particle.x + pushEffect.x,
                y: particle.y + pushEffect.y,
                scale: 0.4 + normalized * 0.6,
                opacity: 0.2 + normalized * 0.3,
              }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
            />
          );
        })}

      {/* 태그들 */}
      {tagsWithPositions.map((tagWithPos) => {
        const style = getTagStyle(tagWithPos, hoveredTag === tagWithPos.tag);
        const pushEffect = hoveredTagData
          ? calculatePushEffect(tagWithPos, hoveredTagData)
          : { x: 0, y: 0 };

        return (
          <motion.div
            key={tagWithPos.tag}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              x: style.x + pushEffect.x,
              y: style.y + pushEffect.y,
              scale: style.scale,
              opacity: style.opacity,
            }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 20,
              opacity: { duration: 0.5 },
            }}
            style={{
              filter: style.filter,
              fontSize: style.fontSize,
              zIndex: style.zIndex,
            }}
            onHoverStart={() => setHoveredTag(tagWithPos.tag)}
            onHoverEnd={() => setHoveredTag(null)}
          >
            <Link
              href={`/posts?page=1&tag=${encodeURIComponent(tagWithPos.tag)}`}
              className="font-bold text-primary-bangladesh hover:text-primary-mountain
                        dark:text-primary-caribbean dark:hover:text-primary-mountain
                        transition-colors duration-300 cursor-pointer
                        whitespace-nowrap select-none"
              aria-label={`${tagWithPos.tag} 태그 (${tagWithPos.count}개 글)`}
            >
              #{tagWithPos.tag}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TagCloud;
