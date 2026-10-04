'use client';
import { FiAlertTriangle } from 'react-icons/fi';
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
            <FiAlertTriangle className="w-6 h-6 text-red-500" aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-semibold text-fg">{title}</h2>
            <p className="mt-1 text-sm text-fg-soft">{message}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border text-fg-soft hover:bg-fg/50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-danger text-white hover:bg-danger/90 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
