'use client';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import MDEditor from '@uiw/react-md-editor';
import PostTOC from '@/app/entities/post/detail/PostTOC';
import useTheme from '@/app/hooks/useTheme';

interface Props {
  content: string;
  loading?: boolean;
}

const PostBody = ({ content, loading }: Props) => {
  const { theme } = useTheme();
  return (
    <div
      className={'max-w-full post-body px-4 py-16 min-h-[500px] relative    '}
    >
      {loading ? (
        <div className={'w-1/3 mx-auto'}>
          <LoadingIndicator />
        </div>
      ) : (
        <>
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
            }}
          />
        </>
      )}
      <PostTOC postContent={content || ''} />
    </div>
  );
};

export default PostBody;
