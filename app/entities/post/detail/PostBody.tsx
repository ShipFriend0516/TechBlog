import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import MDEditor from '@uiw/react-md-editor';

interface Props {
  content: string;
  loading?: boolean;
}

const PostBody = ({ content, loading }: Props) => {
  return (
    <div className={'w-full'}>
      {loading ? (
        <div className={'w-1/2'}>
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
          rehypeRewrite={(node, index, parent) => {
            if (
              node.tagName === 'a' &&
              parent &&
              /^h(1|2|3|4|5|6)/.test(parent.tagName)
            ) {
              parent.children = parent.children.slice(1);
            }
          }}
        />
      )}
    </div>
  );
};

export default PostBody;
