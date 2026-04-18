interface DividerWithTextProps {
  text: string;
  className?: string;
}

const DividerWithText = ({ text, className = '' }: DividerWithTextProps) => {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      role="separator"
      aria-label={text}
    >
      <div className="h-px flex-1 bg-gray-300" />
      <span className="shrink-0 text-sm text-gray-500">{text}</span>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  );
};

export default DividerWithText;
