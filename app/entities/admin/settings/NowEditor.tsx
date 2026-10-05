'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import useToast from '@/app/hooks/useToast';
import { NowItem } from '@/app/types/Home';

const MAX_ITEMS = 6;

// 행 삭제 시 입력 포커스/상태가 다른 행으로 밀리지 않도록 안정적인 key 를 부여
interface EditableNowItem extends NowItem {
  id: number;
}

let nextItemId = 0;
const createItem = (item: NowItem = { label: '', text: '' }): EditableNowItem => ({
  ...item,
  id: nextItemId++,
});

const serialize = (items: NowItem[]) =>
  JSON.stringify(
    items
      .map(({ label, text }) => ({ label: label.trim(), text: text.trim() }))
      .filter(({ label, text }) => label || text)
  );

const NowEditor = () => {
  const toast = useToast();
  const [items, setItems] = useState<EditableNowItem[]>([]);
  const [savedSnapshot, setSavedSnapshot] = useState(serialize([]));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const applyServerItems = (serverItems: NowItem[] | undefined) => {
    const list = serverItems?.length ? serverItems : [];
    setSavedSnapshot(serialize(list));
    setItems(list.length ? list.map((item) => createItem(item)) : [createItem()]);
  };

  useEffect(() => {
    fetch('/api/admin/settings/now')
      .then((res) => res.json())
      .then((data) => applyServerItems(data.now?.items))
      .catch(() => applyServerItems([]))
      .finally(() => setLoading(false));
  }, []);

  const isDirty = !loading && serialize(items) !== savedSnapshot;

  const updateItem = (id: number, key: keyof NowItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length ? next : [createItem()];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/now', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ label, text }) => ({ label, text })),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      applyServerItems(data.now.items);
      toast.success('Now가 저장되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Now 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'input-field min-w-0 rounded-lg px-3 py-2';

  return (
    <section className="bg-surface rounded-xl overflow-hidden mb-6">
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-hairline">
        <div>
          <h2 className="text-base font-semibold">Now</h2>
          <p className="text-xs text-fg-muted">
            홈 화면에 보이는 &lsquo;요즘 하는 것&rsquo; — 최대 {MAX_ITEMS}개
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-warning" aria-live="polite">
              저장되지 않은 변경사항
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || loading || !isDirty}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-on-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col gap-2.5">
        {loading ? (
          <div className="h-10 bg-raised rounded-lg animate-pulse" />
        ) : (
          items.map((item, i) => (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(80px,120px)_1fr_auto] gap-2"
            >
              <input
                value={item.label}
                onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                placeholder="공부 중"
                maxLength={20}
                aria-label={`${i + 1}번째 항목 라벨`}
                className={inputClass}
              />
              <input
                value={item.text}
                onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                placeholder="React Server Components 내부 구조"
                maxLength={120}
                aria-label={`${i + 1}번째 항목 내용`}
                className={inputClass}
              />
              <button
                onClick={() => removeItem(item.id)}
                aria-label={`${i + 1}번째 항목 삭제`}
                className="p-2 rounded-lg text-fg-muted hover:text-danger hover:bg-raised transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))
        )}
        {!loading && items.length < MAX_ITEMS && (
          <button
            onClick={() => setItems((prev) => [...prev, createItem()])}
            className="self-start inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-accent transition-colors"
          >
            <FiPlus size={14} />
            항목 추가
          </button>
        )}
      </div>
    </section>
  );
};

export default NowEditor;
