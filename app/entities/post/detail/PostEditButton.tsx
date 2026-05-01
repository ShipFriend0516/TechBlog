'use client';

import { SessionProvider, useSession } from 'next-auth/react';

const EditButton = ({ slug }: { slug: string }) => {
  const { data: session } = useSession();
  const isAdmin =
    (session as (typeof session & { isAdmin?: boolean }) | null)?.isAdmin ===
    true;

  if (!isAdmin) return null;

  const handleClick = () => {
    window.open(`/admin/write?slug=${slug}`, '_blank')?.focus();
  };

  return (
    <button onClick={handleClick}>
      <span className="underline">Edit</span>
    </button>
  );
};

const PostEditButton = ({ slug }: { slug: string }) => (
  <SessionProvider>
    <EditButton slug={slug} />
  </SessionProvider>
);

export default PostEditButton;
