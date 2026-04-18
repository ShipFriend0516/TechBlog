'use client';
import Modal from '@/app/entities/common/Modal/Modal';
import useShortcut from '@/app/hooks/common/useShortcut';

interface DeleteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteModal = ({
  onCancel,
  onConfirm,
  title = '정말 삭제하시겠어요?',
  message = '이 작업은 되돌릴 수 없습니다.',
}: DeleteModalProps) => {
  useShortcut(onConfirm, ['Enter'], false);

  return (
    <Modal onClose={onCancel}>
      <div className="p-6 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-default">{title}</h2>
            <p className="mt-1 text-sm text-weak">{message}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-border text-weak hover:bg-foreground/50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
