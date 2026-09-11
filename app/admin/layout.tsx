import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  title: '관리자 | ShipFriend TechBlog',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

interface AdminPageLayoutProps {
  children: React.ReactNode;
}

const AdminPageLayout = ({ children }: AdminPageLayoutProps) => {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
};

export default AdminPageLayout;
