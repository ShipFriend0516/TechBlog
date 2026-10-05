import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/app/lib/site';
import { getOgAssets } from './assets';
import { OG_SIZE, OgVariantId, getOgVariant } from './variants';

type RenderOgImageOptions = {
  variant: OgVariantId;
  title?: string;
  description?: string;
};

export const renderOgImage = async ({
  variant,
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
}: RenderOgImageOptions) => {
  const { fonts, logoSrc } = await getOgAssets();
  const { render } = getOgVariant(variant)!;

  return new ImageResponse(
    render({
      title,
      description,
      siteName: SITE_NAME,
      host: new URL(SITE_URL).host,
      logoSrc,
    }),
    { ...OG_SIZE, fonts },
  );
};
