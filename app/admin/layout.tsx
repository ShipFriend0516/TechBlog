'use client';
import { SessionProvider } from 'next-auth/react';
import ProtectedRoute from '@/app/entities/common/Layout/ProtectedRoute';

interface AdminPageLayoutProps {
  children: React.ReactNode;
}

const AdminPageLayout = ({ children }: AdminPageLayoutProps) => {
  return (
    <SessionProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </SessionProvider>
  );
};

export default AdminPageLayout;
