import type { Metadata } from 'next';
import { TITLE_TEMPLATE } from '@/app/lib/site';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  title: { default: 'Admin', template: TITLE_TEMPLATE },
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
