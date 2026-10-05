import type { Metadata } from 'next';
import LogoLab from './LogoLab';

export const metadata: Metadata = {
  title: 'Logo Lab',
  robots: { index: false, follow: false },
};

export default function LogoPage() {
  return <LogoLab />;
}
