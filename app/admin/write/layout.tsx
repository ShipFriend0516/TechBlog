import { Suspense } from 'react';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<LoadingIndicator />}>{children}</Suspense>;
};

export default Layout;
