'use client';
import { ReactNode } from 'react';

interface CalloutProps {
  emoji?: string;
  children?: ReactNode;
}

const Callout = ({ emoji, children }: CalloutProps) => {
  return (
    <span className="flex gap-3 rounded-lg bg-raised px-4 py-3 my-4 not-prose">
      {emoji && (
        <span className="shrink-0 text-xl leading-7 select-none">{emoji}</span>
      )}
      <span className="min-w-0 flex-1 text-sm leading-7 text-fg [&>p:last-child]:mb-0 [&>p]:mb-1">
        {children}
      </span>
    </span>
  );
};

export default Callout;
