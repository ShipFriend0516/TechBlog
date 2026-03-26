'use client';
import { ReactNode } from 'react';

interface CalloutProps {
  emoji?: string;
  children?: ReactNode;
}

const Callout = ({ emoji, children }: CalloutProps) => {
  return (
    <div className="flex gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/60 px-4 py-3 my-4 not-prose">
      {emoji && (
        <span className="shrink-0 text-xl leading-7 select-none">{emoji}</span>
      )}
      <div className="min-w-0 flex-1 text-sm leading-7 text-neutral-800 dark:text-neutral-200 [&>p:last-child]:mb-0 [&>p]:mb-1">
        {children}
      </div>
    </div>
  );
};

export default Callout;
