/**
 * MDEditor rehypeRewrite에서 사용하는 유틸리티 함수들
 */

import { Element, Root, RootContent } from 'hast';
import { SelectedImage } from '../../entities/post/detail/PostBody';

/**
 * aside 태그를 callout 커스텀 컴포넌트 노드로 변환
 * 첫 번째 텍스트 노드를 emoji prop으로 추출하고 나머지는 children으로 유지
 */
export const asideToCallout = (node: any) => {
  if (node.type === 'element' && node.tagName === 'aside') {
    const firstChild = node.children[0];
    let emoji = '';

    if (firstChild?.type === 'text') {
      emoji = firstChild.value.trim();
      node.children = node.children.slice(1);
    }

    node.tagName = 'callout';
    node.properties = { ...node.properties, emoji };
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
        type: 'element' as const,
        tagName: 'span',
        properties: {
          className: 'image-description',
        },
        children: [
          {
            type: 'text' as const,
            value: altText as string,
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
    type: 'element' as const,
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
 * 링크를 감지하고 <ogcard> marker 노드로 변환
 * 실제 렌더링은 PostBody의 components prop에서 OgLinkCard 컴포넌트가 담당
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
    if (!href || !(href.startsWith('/') || href.startsWith('http'))) return;

    const ogNode = {
      type: 'element' as const,
      tagName: 'ogcard',
      properties: { href },
      children: [],
    };

    if (
      index !== undefined &&
      parent?.children &&
      Array.isArray(parent.children)
    ) {
      // 링크 텍스트가 URL 자체인 경우(bare URL, [url](url)) → <p> 대체
      // 커스텀 텍스트인 경우([text](url)) → <p> 유지 후 카드 삽입
      const linkText =
        aTag.children?.find((c: any) => c.type === 'text')?.value ?? '';
      const isUrlOnlyLink = linkText === href;
      if (isUrlOnlyLink) {
        parent.children.splice(index, 1, ogNode);
      } else {
        parent.children.splice(index + 1, 0, ogNode);
      }
    }
  }
};

/**
 * 첫 번째 이미지는 eager, 나머지는 lazy loading 적용하는 함수 팩토리
 */
export const createLazyLoadHandler = () => {
  let imageCount = 0;
  return (node: Root | RootContent) => {
    if (node.type === 'element' && node.tagName === 'img') {
      node.properties.loading = imageCount === 0 ? 'eager' : 'lazy';
      imageCount++;
    }
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
