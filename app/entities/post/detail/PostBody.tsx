'use client';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import MDEditor from '@uiw/react-md-editor';
import PostTOC from '@/app/entities/post/detail/PostTOC';

interface Props {
  content: string;
  loading?: boolean;
}

const PostBody = ({ content, loading }: Props) => {
  return (
    <div className={'max-w-3xl post-body px-4 py-16 min-h-[500px] relative'}>
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
              'data-color-mode': 'dark',
            }}
          />
          <PostTOC postContent={content || ''} />
        </>
      )}
    </div>
  );
};

export default PostBody;
