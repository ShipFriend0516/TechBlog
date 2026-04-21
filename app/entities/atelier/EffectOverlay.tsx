'use client';

import { AtelierEffect } from '@/app/lib/atelierEffects';
import FlowerOverlay from './FlowerOverlay';
import SparkleOverlay from './SparkleOverlay';

interface EffectOverlayProps {
  effect: AtelierEffect | null | undefined;
  children: React.ReactNode;
}

const OVERLAY_MAP: Record<AtelierEffect, React.ComponentType<{ children: React.ReactNode }>> = {
  star: SparkleOverlay,
  flower: FlowerOverlay,
};

export default function EffectOverlay({ effect, children }: EffectOverlayProps) {
  if (!effect) return <>{children}</>;

  const Overlay = OVERLAY_MAP[effect];
  if (!Overlay) return <>{children}</>;

  return <Overlay>{children}</Overlay>;
}
