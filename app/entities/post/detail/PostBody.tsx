'use client';
import type { Element as HastElement, Root, RootContent } from 'hast';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import ImageZoomViewer from '@/app/entities/common/Overlay/Image/ImageZoomViewer';
import Callout from '@/app/entities/post/detail/Callout';
import OgLinkCard from '@/app/entities/post/detail/OgLinkCard';
import TagBox from '@/app/entities/post/tags/TagBox';
import useTheme from '@/app/hooks/useTheme';
import MDEditor from '@uiw/react-md-editor';
import {
  asideToCallout,
  addDescriptionUnderImage,
  renderYoutubeEmbed,
  renderOpenGraph,
  createImageClickHandler,
  createLazyLoadHandler,
} from '../../../lib/utils/rehypeUtils';

const PostTOC = dynamic(() => import('@/app/entities/post/detail/PostTOC'), {
  ssr: false,
});

interface Props {
  content: string;
  tags?: string[];
  loading?: boolean;
}

export interface SelectedImage {
  src: string;
  alt?: string;
  rect: DOMRect;
}

const PostBody = ({ content, tags, loading }: Props) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  const addImageClickHandler = createImageClickHandler(setSelectedImage);
  const addLazyLoad = createLazyLoadHandler();

  return (
    <div
      className={
        'max-w-full post-body px-3 sm:px-4 py-6 sm:py-8 lg:py-16 min-h-[500px] relative'
      }
    >
      {loading ? (
        <div className={'w-1/3 mx-auto'}>
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <ImageZoomViewer
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
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
            components={
              {
                ogcard: ({ href }: { href?: string }) =>
                  href ? <OgLinkCard href={href} /> : null,
                callout: ({
                  emoji,
                  children,
                }: {
                  emoji?: string;
                  children?: React.ReactNode;
                }) => <Callout emoji={emoji}>{children}</Callout>,
              } as any
            }
            rehypeRewrite={(
              node: Root | RootContent,
              index?: number,
              parent?: Root | HastElement
            ) => {
              asideToCallout(node);
              renderOpenGraph(node, index, parent as HastElement | undefined);
              renderYoutubeEmbed(
                node,
                index || 0,
                parent as HastElement | undefined
              );
              addImageClickHandler(node);
              addLazyLoad(node);
              addDescriptionUnderImage(
                node,
                index,
                parent as HastElement | undefined
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
