'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import ProtectedRoute from '@/app/entities/common/Layout/ProtectedRoute';
import SVGLoadingSpinner from '@/app/entities/common/Loading/SVGLoadingSpinner';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

const AdminLayoutClient = ({ children }: AdminLayoutClientProps) => {
  return (
    <SessionProvider>
      <ProtectedRoute>
        <Suspense fallback={<SVGLoadingSpinner />}>{children}</Suspense>
      </ProtectedRoute>
    </SessionProvider>
  );
};

export default AdminLayoutClient;
