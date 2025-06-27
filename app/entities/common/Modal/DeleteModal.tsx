const DeleteModal = (props: {
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
}) => {
  const defaultMessage =
    '게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다. 게시글이 영구적으로 삭제됩니다.';
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-black">
        <h2 className="text-xl font-semibold">게시글을 삭제하시겠습니까?</h2>
        <p className="mt-2 text-gray-600">
          {props.message ? props.message : defaultMessage}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={props.onCancel}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={props.onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
