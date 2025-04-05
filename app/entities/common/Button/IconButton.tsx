import { IconType } from 'react-icons';

interface IconButtonProps {
  Icon: IconType;
  text?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
  props?: React.HTMLProps<HTMLButtonElement>;
}

const IconButton = ({
  Icon,
  text,
  size,
  className,
  onClick,
  ...props
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={
        className || 'p-2 fill-current hover:bg-gray-200/50 rounded-md'
      }
      {...props}
    >
      <Icon size={size || 20} />
      {text && <span>{text}</span>}
    </button>
  );
};
export default IconButton;
