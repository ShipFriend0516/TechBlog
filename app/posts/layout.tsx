import { Suspense } from 'react';
import SVGLoadingSpinner from '@/app/entities/common/Loading/SVGLoadingSpinner';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<SVGLoadingSpinner />}>{children}</Suspense>;
};

export default Layout;
