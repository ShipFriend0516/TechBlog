interface TagBoxProps {
  tags: string[];
  className?: string;
}

const TagBox = ({ tags, className }: TagBoxProps) => {
  return (
    tags &&
    tags.length > 0 && (
      <div className={className}>
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-1"
          >
            {tag}
          </span>
        ))}
      </div>
    )
  );
};

export default TagBox;
