'use client';
import { SessionProvider } from 'next-auth/react';

interface AdminPageLayoutProps {
  children: React.ReactNode;
}

const AdminPageLayout = ({ children }: AdminPageLayoutProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AdminPageLayout;
