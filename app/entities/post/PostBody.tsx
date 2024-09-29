interface Props {
  content: string;
}

const PostBody = ({ content }: Props) => {
  return (
    <div className={'post-body py-16 pb-20 whitespace-pre-wrap'}>{content}</div>
  );
};

export default PostBody;
