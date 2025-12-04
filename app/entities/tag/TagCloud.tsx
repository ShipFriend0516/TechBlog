'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { TagData, TagWithPosition } from '@/app/types/Tag';

interface TagCloudProps {
  tags: TagData[];
}

const TagCloud = ({ tags }: TagCloudProps) => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const isMobile = window.innerWidth < 768;

  const radius = 200;
  // Fibonacci Sphere 알고리즘으로 3D 구형 좌표 계산
  const tagsWithPositions = useMemo(() => {
    const total = tags.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    return tags.map((tag, index) => {
      const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
      const theta = 2 * Math.PI * index * goldenRatio;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return {
        ...tag,
        position: { x, y, z },
      };
    });
  }, [tags, radius]);

  // Z축 기반 스타일 계산
  const getTagStyle = (tagWithPos: TagWithPosition, isHovered: boolean) => {
    const { position, count } = tagWithPos;
    const { x, y, z } = position;

    // z값 정규화 (-radius ~ radius → 0 ~ 1)
    const normalized = (z + radius) / (radius * 2);

    // 태그 빈도에 따른 기본 크기 조정
    const countFactor = Math.log(count + 1) / Math.log(tags[0].count + 1);
    const baseSize = 0.7 + countFactor * 0.6; // 0.7 ~ 1.3

    const scale = (0.5 + normalized * 1.5) * baseSize;
    const opacity = 0.3 + normalized * 0.7;
    const blur = (1 - normalized) * 2;

    // 모바일에서 폰트 크기 조정
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
      zIndex: Math.round(normalized * 100),
    };
  };

  // 주변 태그 밀어내기 효과 계산
  const calculatePushEffect = (
    targetPos: TagWithPosition,
    hoveredPos: TagWithPosition
  ) => {
    // 모바일에서는 밀어내기 효과 비활성화
    if (isMobile || !hoveredTag || hoveredTag !== hoveredPos.tag) {
      return { x: 0, y: 0 };
    }

    const dx = targetPos.position.x - hoveredPos.position.x;
    const dy = targetPos.position.y - hoveredPos.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const threshold = 100;
    if (distance > threshold || distance === 0) return { x: 0, y: 0 };

    const force = (1 - distance / threshold) * 30;
    const angle = Math.atan2(dy, dx);

    return {
      x: Math.cos(angle) * force,
      y: Math.sin(angle) * force,
    };
  };

  const hoveredTagData = tagsWithPositions.find((t) => t.tag === hoveredTag);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-caribbean/10 via-transparent to-transparent dark:from-primary-mountain/10" />

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
