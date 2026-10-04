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
      <div className="h-px flex-1 bg-fg/10" />
      <span className="shrink-0 text-sm text-fg-muted">{text}</span>
      <div className="h-px flex-1 bg-fg/10" />
    </div>
  );
};

export default DividerWithText;
