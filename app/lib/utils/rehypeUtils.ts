/**
 * MDEditor rehypeRewrite에서 사용하는 유틸리티 함수들
 */

import { SelectedImage } from '../../entities/post/detail/PostBody';

export interface OGData {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
  hostname: string;
}

/**
 * 마크다운에서 OG 카드로 변환할 링크(내부/외부) 추출
 */
export const extractInternalLinks = (markdown: string): string[] => {
  const links: string[] = [];

  // [text](url) 형식 — 내부(/로 시작) 또는 외부(http(s)://) URL
  const mdLinkRegex = /\[([^\]]*)\]\(((?:https?:\/\/|\/)[^)]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(markdown)) !== null) {
    links.push(match[2]);
  }

  // 마크다운 링크 문법 밖의 bare URL (ex. 단독으로 쓴 https://...)
  const bareUrlRegex = /(?<!\]\()https?:\/\/[^\s<>)"]+/g;
  while ((match = bareUrlRegex.exec(markdown)) !== null) {
    links.push(match[0]);
  }

  return Array.from(new Set(links));
};

/**
 * /api/opengraph를 통해 OG 데이터 fetch
 */
export const fetchOGData = async (href: string): Promise<OGData | null> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL || process.env.NEXT_PUBLIC_URL || '';
  const absoluteUrl = href.startsWith('/') ? `${baseUrl}${href}` : href;
  try {
    const res = await fetch(
      `/api/opengraph?url=${encodeURIComponent(absoluteUrl)}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

/**
 * aside 태그의 첫 번째 텍스트 노드를 emoji span으로 래핑
 */
export const asideStyleRewrite = (node: any) => {
  if (node.type === 'element' && node.tagName === 'aside') {
    for (const child of [...node.children]) {
      if (node.children[0] === child && child.type === 'text') {
        node.children[0] = {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'aside-emoji',
          },
          children: [
            {
              type: 'text',
              value: child.value!,
            },
          ],
        };
      }
    }
  }
};

/**
 * 이미지의 alt 속성을 이미지 아래에 설명 텍스트로 추가
 */
export const addDescriptionUnderImage = (
  node: any,
  index?: number,
  parent?: Element
) => {
  if (node.type === 'element' && node.tagName === 'img') {
    const parentEl = parent as any;
    const isInsideOGCard =
      (parentEl?.tagName === 'a' &&
        parentEl?.properties?.className?.includes('rounded-xl')) ||
      (parentEl?.tagName === 'div' &&
        parentEl?.properties?.className?.includes('aspect-video'));
    if (isInsideOGCard) return null;

    const altText = node.properties.alt;
    if (altText) {
      const descriptionNode = {
        type: 'element',
        tagName: 'span',
        properties: {
          className: 'image-description',
        },
        children: [
          {
            type: 'text',
            value: altText,
          },
        ],
      };

      if (
        index !== undefined &&
        parent &&
        parent.children &&
        Array.isArray(parent.children)
      ) {
        parent.children.splice(index + 1, 0, descriptionNode);
      }
    }
  }

  return null;
};

/**
 * YouTube 링크를 감지하고 embed iframe으로 변환
 */
export const renderYoutubeEmbed = (
  node: any,
  index?: number,
  parent?: Element
) => {
  if (node.type === 'element' && node.tagName === 'p' && node.children) {
    const aTag = node.children.find(
      (node: any) => node.type === 'element' && node.tagName === 'a'
    );
    if (!aTag) return;

    const href = aTag.properties?.href;
    const isYoutubeLink =
      href &&
      (href.startsWith('https://www.youtube.com/watch') ||
        href.startsWith('https://youtu.be/'));

    if (isYoutubeLink) {
      const urlType = href.startsWith('https://www.youtube.com/watch')
        ? 'watch'
        : 'be';

      const videoId =
        urlType === 'watch'
          ? new URL(href).searchParams.get('v')
          : href.split('/').pop();

      if (videoId) {
        const youtubeEmbed = createYoutubeIframe(videoId, 736, 414);
        // 부모가 존재하고 children 배열이 있는 경우
        if (
          index &&
          parent &&
          parent.children &&
          Array.isArray(parent.children)
        ) {
          parent.children.splice(index + 1, 0, youtubeEmbed);
        } else return;
      }
    }
  }
};

/**
 * YouTube embed iframe 노드 생성
 */
export const createYoutubeIframe = (
  videoId: string,
  width: number,
  height: number
) => {
  return {
    type: 'element',
    tagName: 'iframe',
    properties: {
      src: `https://www.youtube.com/embed/${videoId}`,
      width: width.toString(),
      height: height.toString(),
      frameBorder: '0',
      allowFullScreen: true,
      className: 'youtube-embed',
    },
    children: [],
  };
};

/**
 * 내부 링크를 Open Graph 카드로 변환
 */
export const renderOpenGraph = (
  node: any,
  index?: number,
  parent?: Element,
  ogDataMap?: Record<string, OGData | null>
) => {
  if (node.type === 'element' && node.tagName === 'p' && node.children) {
    const aTag = node.children.find(
      (node: any) => node.type === 'element' && node.tagName === 'a'
    );
    if (!aTag) return;

    const href = aTag.properties?.href;
    const isOGTarget =
      href && (href.startsWith('/') || href.startsWith('http'));
    if (isOGTarget && ogDataMap && href in ogDataMap) {
      const data = ogDataMap[href];
      if (!data || (!data.title && !data.description)) return;
      const ogCard = createOpenGraph(href, data);
      if (
        index !== undefined &&
        parent &&
        parent.children &&
        Array.isArray(parent.children)
      ) {
        // 링크 텍스트가 URL 자체인 경우(bare URL, [url](url)) → <p> 대체
        // 커스텀 텍스트인 경우([text](url)) → <p> 유지 후 OG 카드 삽입
        const linkText = aTag.children?.find((c: any) => c.type === 'text')?.value ?? '';
        const isUrlOnlyLink = linkText === href;
        if (isUrlOnlyLink) {
          parent.children.splice(index, 1, ogCard);
        } else {
          parent.children.splice(index + 1, 0, ogCard);
        }
      } else return;
    }
  }
};

/**
 * Open Graph 카드 노드 생성
 */
export const createOpenGraph = (href: string, data: OGData) => {
  const { title, description, image, favicon, siteName, hostname } = data;
  const siteLabel = siteName || hostname || '';

  const siteInfoChildren: any[] = [];
  if (favicon) {
    siteInfoChildren.push({
      type: 'element',
      tagName: 'img',
      properties: {
        src: favicon,
        alt: '',
        width: '14',
        height: '14',
        className: 'shrink-0 rounded-sm',
      },
      children: [],
    });
  }
  siteInfoChildren.push({
    type: 'element',
    tagName: 'span',
    properties: { className: 'text-muted-foreground truncate text-xs' },
    children: [{ type: 'text', value: siteLabel }],
  });

  const textChildren: any[] = [
    {
      type: 'element',
      tagName: 'div',
      properties: { className: 'flex items-center gap-1.5 h-4' },
      children: siteInfoChildren,
    },
  ];
  if (title) {
    textChildren.push({
      type: 'element',
      tagName: 'p',
      properties: {
        className:
          'text-foreground line-clamp-1 text-sm font-semibold leading-snug !mb-1',
      },
      children: [{ type: 'text', value: title }],
    });
  }
  if (description) {
    textChildren.push({
      type: 'element',
      tagName: 'p',
      properties: {
        className:
          'text-muted-foreground line-clamp-2 text-xs leading-relaxed !mb-0',
      },
      children: [{ type: 'text', value: description }],
    });
  }

  const cardChildren: any[] = [
    {
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'flex min-w-0 flex-1 flex-col justify-center gap-0 px-4',
      },
      children: textChildren,
    },
  ];
  if (image) {
    cardChildren.push({
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'relative hidden aspect-video shrink-0 sm:block',
        style: 'width: 120px',
      },
      children: [
        {
          type: 'element',
          tagName: 'img',
          properties: {
            src: image,
            alt: title ?? '',
            className: 'h-full !w-full object-cover !m-0 !p-0 !max-w-none',
          },
          children: [],
        },
      ],
    });
  }

  return {
    type: 'element',
    tagName: 'a',
    properties: {
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
      className:
        'border-border bg-card hover:border-primary/40 hover:bg-muted/50  flex overflow-hidden rounded-xl border transition-colors mb-4',
    },
    children: cardChildren,
  };
};

/**
 * 이미지 클릭 핸들러를 추가하는 함수 팩토리
 * @param setSelectedImage - 선택된 이미지 URL을 설정하는 함수
 * @param setOpenImageBox - 이미지 오버레이 열기 상태를 설정하는 함수
 */
export const createImageClickHandler =
  (
    setSelectedImage: (image: SelectedImage | null) => void,
    setOpenImageBox: (open: boolean) => void
  ) =>
  (node: any) => {
    if (node.type === 'element' && node.tagName === 'img') {
      const imageUrl = node.properties.src;
      if (imageUrl) {
        node.properties.onClick = () => {
          setSelectedImage({
            src: imageUrl,
            alt: node.properties.alt || undefined,
          });
          setOpenImageBox(true);
        };
      }
    }
  };
