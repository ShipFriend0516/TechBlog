interface SectionHeadingProps {
  title: string;
}

const SectionHeading = ({ title }: SectionHeadingProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <div className="h-1 w-24 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
    </div>
  );
};

export default SectionHeading;
