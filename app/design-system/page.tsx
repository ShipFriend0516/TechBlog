import type { Metadata } from 'next';
import DesignSystemPreview from './DesignSystemPreview';

export const metadata: Metadata = {
  title: 'Design System | ShipFriend TechBlog',
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return <DesignSystemPreview />;
}
