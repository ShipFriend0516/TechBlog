'use client';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import MDEditor from '@uiw/react-md-editor';

interface Props {
  content: string;
  loading?: boolean;
}

const PostBody = ({ content, loading }: Props) => {
  return (
    <div className={'w-full post-body px-4 py-16 min-h-[500px]'}>
      {loading ? (
        <div className={'w-1/3 mx-auto'}>
          <LoadingIndicator />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default PostBody;
