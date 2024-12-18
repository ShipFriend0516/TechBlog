'use client';
import { SessionProvider } from 'next-auth/react';
import ProtectedRoute from '@/app/entities/common/Layout/ProtectedRoute';
import ToastProvider from '@/app/entities/common/Toast/ToastProvider';

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
