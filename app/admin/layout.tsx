'use client';
import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import ProtectedRoute from '@/app/entities/common/Layout/ProtectedRoute';
import SVGLoadingSpinner from '@/app/entities/common/Loading/SVGLoadingSpinner';

interface AdminPageLayoutProps {
  children: React.ReactNode;
}

const AdminPageLayout = ({ children }: AdminPageLayoutProps) => {
  return (
    <SessionProvider>
      <ProtectedRoute>
        <Suspense fallback={<SVGLoadingSpinner />}>{children}</Suspense>
      </ProtectedRoute>
    </SessionProvider>
  );
};

export default AdminPageLayout;
