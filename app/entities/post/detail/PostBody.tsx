'use client';
import { useState } from 'react';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import ImageZoomOverlayContainer from '@/app/entities/common/Overlay/Image/ImageZoomOverlayContainer';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import PostTOC from '@/app/entities/post/detail/PostTOC';
import TagBox from '@/app/entities/post/tags/TagBox';
import useOverlay from '@/app/hooks/common/useOverlay';
import useTheme from '@/app/hooks/useTheme';
import MDEditor from '@uiw/react-md-editor';

interface Props {
  content: string;
  tags?: string[];
  loading?: boolean;
}

const PostBody = ({ content, tags, loading }: Props) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { isOpen: openImageBox, setIsOpen: setOpenImageBox } = useOverlay();

  const asideStyleRewrite = (node: any) => {
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

  const addDescriptionUnderImage = (
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

  const renderOpenGraph = (node: any, index?: number, parent?: Element) => {
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
          // 현재 a 태그 다음 위치에 div 삽입 s
          parent.children.splice(index + 1, 0, opengraph);
        } else return;
      }
    }
  };

  const renderYoutubeEmbed = (node: any, index?: number, parent?: Element) => {
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

  const createYoutubeIframe = (
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

  const createOpenGraph = (href: string) => {
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
              children: [
                // {
                //   type: 'text',
                //   value: decodeURIComponent(href.split('/').pop()!).replaceAll(
                //     '-',
                //     ' '
                //   ),
                // },
              ],
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

  const addImageClickHandler = (node: any) => {
    if (node.type === 'element' && node.tagName === 'img') {
      const imageUrl = node.properties.src;
      if (imageUrl) {
        node.properties.onClick = () => {
          setSelectedImage(imageUrl);
          setOpenImageBox(true);
        };
      }
    }
  };

  return (
    <div
      className={
        'max-w-full post-body px-4 py-8 lg:py-16 min-h-[500px] relative    '
      }
    >
      {loading ? (
        <div className={'w-1/3 mx-auto'}>
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <Overlay
            overlayOpen={openImageBox}
            setOverlayOpen={setOpenImageBox}
            maxWidth={'5xl'}
          >
            <ImageZoomOverlayContainer
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              setOpenImageBox={setOpenImageBox}
            />
          </Overlay>
          <TagBox className={'-mt-4 mb-4'} tags={tags || []} />
          <MDEditor.Markdown
            style={{
              backgroundColor: 'var(--background)',
              color: 'var(--text-primary)',
            }}
            className={''}
            source={content}
            wrapperElement={{
              'data-color-mode': theme,
            }}
            rehypeRewrite={(node, index?, parent?) => {
              asideStyleRewrite(node);
              // renderOpenGraph(node, index || 0, parent as Element | undefined);
              renderYoutubeEmbed(
                node,
                index || 0,
                parent as Element | undefined
              );
              addImageClickHandler(node);
              addDescriptionUnderImage(
                node,
                index,
                parent as Element | undefined
              );
            }}
          />
        </>
      )}
      <PostTOC postContent={content || ''} />
    </div>
  );
};

export default PostBody;
