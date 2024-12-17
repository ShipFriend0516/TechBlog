import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import MDEditor from '@uiw/react-md-editor';

interface Props {
  content: string;
  loading?: boolean;
}

const PostBody = ({ content, loading }: Props) => {
  return (
    <div className={'w-full  '}>
      {loading ? (
        <div className={'w-1/2 mx-auto'}>
          <LoadingIndicator />
        </div>
      ) : (
        <MDEditor.Markdown
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--text-primary)',
          }}
          className={'post-body px-4 py-16 pb-52 whitespace-pre-wrap'}
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
