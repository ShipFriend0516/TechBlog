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
import {
  asideStyleRewrite,
  addDescriptionUnderImage,
  renderYoutubeEmbed,
  createImageClickHandler,
} from '../../../lib/utils/rehypeUtils';

interface Props {
  content: string;
  tags?: string[];
  loading?: boolean;
}

export interface SelectedImage {
  src: string;
  alt?: string;
}

const PostBody = ({ content, tags, loading }: Props) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  const { isOpen: openImageBox, setIsOpen: setOpenImageBox } = useOverlay();

  // 이미지 클릭 핸들러 생성
  const addImageClickHandler = createImageClickHandler(
    setSelectedImage,
    setOpenImageBox
  );

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
            animate={false}
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
