import { IconType } from 'react-icons';

interface IconButtonProps {
  Icon: IconType;
  text?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const IconButton = ({
  Icon,
  text,
  size,
  className,
  onClick,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={
        className || 'p-4 fill-current hover:bg-gray-200/50 rounded-md'
      }
    >
      <Icon size={size || 20} />
      {text && <span>{text}</span>}
    </button>
  );
};
export default IconButton;
