'use client';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import MDEditor from '@uiw/react-md-editor';
import PostTOC from '@/app/entities/post/detail/PostTOC';
import useTheme from '@/app/hooks/useTheme';
import TagBox from '@/app/entities/post/tags/TagBox';

interface Props {
  content: string;
  tags?: string[];
  loading?: boolean;
}

const PostBody = ({ content, tags, loading }: Props) => {
  const { theme } = useTheme();

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
            rehypeRewrite={(node) => {
              asideStyleRewrite(node);
            }}
          />
        </>
      )}
      <PostTOC postContent={content || ''} />
    </div>
  );
};

export default PostBody;
