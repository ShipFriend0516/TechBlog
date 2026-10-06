import type { Metadata } from 'next';
import NotFoundLab from './NotFoundLab';

export const metadata: Metadata = {
  title: '404 Lab',
  robots: { index: false, follow: false },
};

export default function NotFoundLabPage() {
  return <NotFoundLab />;
}
