import { IconType } from 'react-icons';
import { FiCheck, FiInfo, FiX } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  title?: string;
  type: ToastType;
  removeToast: () => void;
}

// 아이콘 배지는 디자인 시스템 상태 배지 규칙(bg-<token>/10 text-<token>)을 따른다
const iconMap: Record<ToastType, { Icon: IconType; className: string }> = {
  success: { Icon: FiCheck, className: 'bg-accent-subtle text-accent' },
  error: { Icon: FiX, className: 'bg-danger/10 text-danger' },
  info: { Icon: FiInfo, className: 'bg-info/10 text-info' },
};

const Toast = ({ message, title, type, removeToast }: ToastProps) => {
  const { Icon, className: iconClassName } = iconMap[type];

  return (
    <div role={type === 'error' ? 'alert' : 'status'}>
      <button
        type="button"
        onClick={() => removeToast()}
        title="클릭하면 닫힘"
        className="animate-slideUp flex w-full max-w-md items-center gap-3 rounded-2xl bg-overlay px-4 py-3 text-left text-fg shadow-xl transition-colors duration-300 ease-out-expo hover:bg-raised"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          <Icon size={16} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          {title && (
            <span className="block text-sm font-semibold">{title}</span>
          )}
          <span
            className={`block whitespace-pre-line text-sm ${title ? 'mt-0.5 text-fg-soft' : 'line-clamp-1'}`}
          >
            {message}
          </span>
        </span>
      </button>
    </div>
  );
};

export default Toast;
