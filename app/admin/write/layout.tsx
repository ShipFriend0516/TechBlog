import { Suspense } from 'react';
import BlogFormSkeleton from '@/app/entities/common/Skeleton/BlogFormSkeleton';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<BlogFormSkeleton />}>{children}</Suspense>;
};

export default Layout;
