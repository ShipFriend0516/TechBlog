interface TagBoxProps {
  tags: string[];
  className?: string;
  tagCloudClassName?: string;
}

const TagBox = ({
  tags,
  className,
  tagCloudClassName = 'bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold',
}: TagBoxProps) => {
  return (
    tags &&
    tags.length > 0 && (
      <div className={`flex items-center` + className}>
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-block  ${tagCloudClassName} mr-1`}
          >
            {tag}
          </span>
        ))}
      </div>
    )
  );
};

export default TagBox;
