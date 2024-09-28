interface Props {
  content: string;
}

const PostBody = ({ content }: Props) => {
  return <div className={'post-body py-10 whitespace-pre-wrap'}>{content}</div>;
};

export default PostBody;
