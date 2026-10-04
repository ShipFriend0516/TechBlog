'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import useToast from '@/app/hooks/useToast';
import { NowItem } from '@/app/types/Home';

const MAX_ITEMS = 6;
const EMPTY_ITEM: NowItem = { label: '', text: '' };

const NowEditor = () => {
  const toast = useToast();
  const [items, setItems] = useState<NowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings/now')
      .then((res) => res.json())
      .then((data) => setItems(data.now?.items?.length ? data.now.items : [EMPTY_ITEM]))
      .catch(() => setItems([EMPTY_ITEM]))
      .finally(() => setLoading(false));
  }, []);

  const updateItem = (index: number, key: keyof NowItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/now', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setItems(data.now.items.length ? data.now.items : [EMPTY_ITEM]);
      toast.success('Now가 저장되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Now 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'rounded-lg bg-raised px-3 py-2 text-sm text-fg placeholder:text-fg-faint outline-none focus:ring-2 focus:ring-accent-strong';

  return (
    <section className="bg-surface rounded-xl overflow-hidden mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
        <div>
          <h2 className="text-base font-semibold">Now</h2>
          <p className="text-xs text-fg-muted">
            홈 화면에 보이는 &lsquo;요즘 하는 것&rsquo; — 최대 {MAX_ITEMS}개
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-on-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>

      <div className="px-6 py-4 flex flex-col gap-2.5">
        {loading ? (
          <div className="h-10 bg-raised rounded-lg animate-pulse" />
        ) : (
          items.map((item, i) => (
            <div key={i} className="grid grid-cols-[120px_1fr_auto] gap-2">
              <input
                value={item.label}
                onChange={(e) => updateItem(i, 'label', e.target.value)}
                placeholder="공부 중"
                maxLength={20}
                className={inputClass}
              />
              <input
                value={item.text}
                onChange={(e) => updateItem(i, 'text', e.target.value)}
                placeholder="React Server Components 내부 구조"
                maxLength={120}
                className={inputClass}
              />
              <button
                onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                aria-label="항목 삭제"
                className="p-2 rounded-lg text-fg-muted hover:text-danger hover:bg-raised transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))
        )}
        {!loading && items.length < MAX_ITEMS && (
          <button
            onClick={() => setItems((prev) => [...prev, EMPTY_ITEM])}
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
