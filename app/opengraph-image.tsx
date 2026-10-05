import { renderOgImage } from '@/app/lib/og/renderOgImage';
import { OG_SIZE, SELECTED_OG_VARIANT } from '@/app/lib/og/variants';
import { SITE_NAME } from '@/app/lib/site';

export const alt = `${SITE_NAME} Open Graph Image`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OpengraphImage() {
  return renderOgImage({ variant: SELECTED_OG_VARIANT });
}
