import { Suspense } from 'react';
import Loading from './[slug]/loading';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default Layout;
