import { DraftListItem } from '@/app/types/Draft';

interface DraftListOverlayProps {
  drafts: DraftListItem[];
  onLoadDraft: (draft: DraftListItem) => void;
  onDeleteDraft?: (draftId: string, source: 'local' | 'cloud') => void;
  mode: 'load' | 'delete';
  currentDraftId?: string | null;
}

const DraftListOverlay = ({
  drafts,
  onLoadDraft,
  onDeleteDraft,
  mode,
  currentDraftId,
}: DraftListOverlayProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleItemClick = (draft: DraftListItem) => {
    if (mode === 'load') {
      onLoadDraft(draft);
    }
  };

  const handleDelete = (draft: DraftListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteDraft) {
      if (confirm(`"${draft.title || '제목 없음'}" 임시저장을 삭제하시겠습니까?`)) {
        onDeleteDraft(draft.id, draft.source);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-default">
        {mode === 'load' ? '임시저장본 불러오기' : '임시저장 삭제'}
      </h2>

      {drafts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          저장된 임시글이 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => {
            const isCurrentDraft =
              draft.source === 'cloud' && draft.id === currentDraftId;

            return (
              <div
                key={draft.id}
                onClick={() => !isCurrentDraft && handleItemClick(draft)}
                className={`
                  border rounded-lg p-4 transition-all
                  ${draft.source === 'local' ? 'border-blue-300' : 'border-green-300'}
                  ${isCurrentDraft
                    ? 'opacity-50 cursor-not-allowed'
                    : mode === 'load'
                      ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
                      : ''
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-default">
                        {draft.title || '제목 없음'}
                      </h3>
                      {isCurrentDraft && (
                        <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 font-semibold">
                          작성 중
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatDate(draft.date)}
                      </span>
                      <span
                        className={`
                          text-xs px-2 py-1 rounded
                          ${
                            draft.source === 'local'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          }
                        `}
                      >
                        {draft.source === 'local' ? '로컬' : '클라우드'}
                      </span>
                    </div>
                  </div>

                  {mode === 'delete' && onDeleteDraft && (
                    <button
                      onClick={(e) => handleDelete(draft, e)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DraftListOverlay;
