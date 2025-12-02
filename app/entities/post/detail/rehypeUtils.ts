/**
 * MDEditor rehypeRewrite에서 사용하는 유틸리티 함수들
 */

import { SelectedImage } from "./PostBody";

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
 * 내부 링크를 Open Graph 카드로 변환 (현재 비활성화)
 */
export const renderOpenGraph = (
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
    if (href && href.startsWith('/')) {
      // 부모가 존재하고 children 배열이 있는 경우
      const opengraph = createOpenGraph(href);
      if (
        index !== undefined &&
        parent &&
        parent.children &&
        Array.isArray(parent.children)
      ) {
        // 현재 a 태그 다음 위치에 div 삽입
        parent.children.splice(index + 1, 0, opengraph);
      } else return;
    }
  }
};

/**
 * Open Graph 카드 노드 생성
 */
export const createOpenGraph = (href: string) => {
  return {
    type: 'element',
    tagName: 'a',
    properties: {
      className: 'open-graph',
      href: href,
    },
    children: [
      {
        type: 'element',
        tagName: 'img',
        properties: {
          src: `${href}`,
          alt: 'Open Graph Image',
          className: 'og-image',
        },
        children: [],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'og-container',
        },
        children: [
          {
            type: 'element',
            tagName: 'h4',
            properties: {
              className: 'og-title',
            },
            children: [
              {
                type: 'text',
                value: decodeURIComponent(href.split('/').pop()!).replaceAll(
                  '-',
                  ' '
                ),
              },
            ],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'og-content',
            },
            children: [],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'og-domain',
            },
            children: [
              {
                type: 'text',
                value: '',
              },
            ],
          },
        ],
      },
    ],
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
          setSelectedImage({ src: imageUrl, alt: node.properties.alt || undefined });
          setOpenImageBox(true);
        };
      }
    }
  };
