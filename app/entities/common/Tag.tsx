interface TagProps {
  content: string;
  onClick?: () => void;
}
const Tag = ({ content, onClick }: TagProps) => {
  return (
    <span
      onClick={onClick}
      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
    >
      {content}
    </span>
  );
};

export default Tag;
