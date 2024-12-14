import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';

interface Props {
  content: string;
  loading?: boolean;
}

const PostBody = ({ content, loading }: Props) => {
  return (
    <div className={'post-body px-4 py-16 pb-20 whitespace-pre-wrap'}>
      {loading ? <LoadingIndicator /> : content}
    </div>
  );
};

export default PostBody;
