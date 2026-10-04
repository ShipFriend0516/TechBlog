'use client';

import { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import AdminPageHeader from '@/app/entities/admin/common/AdminPageHeader';
import NowEditor from '@/app/entities/admin/settings/NowEditor';
import useToast from '@/app/hooks/useToast';

const SKELETON_WIDTHS = [72, 88, 65, 91, 78, 83, 69, 95];

// 재생성 직후 최신 내용을 보도록 브라우저 캐시를 우회
const fetchLlmsTxt = () =>
  fetch('/llms.txt', { cache: 'no-store' }).then((res) => (res.ok ? res.text() : null));

const SettingsPage = () => {
  const toast = useToast();
  const [llmsContent, setLlmsContent] = useState<string | null>(null);
  const [llmsLoading, setLlmsLoading] = useState(false);
  const [llmsFetching, setLlmsFetching] = useState(true);

  useEffect(() => {
    fetchLlmsTxt()
      .then((text) => setLlmsContent(text))
      .catch(() => setLlmsContent(null))
      .finally(() => setLlmsFetching(false));
  }, []);

  const handleRegenerateLlms = async () => {
    setLlmsLoading(true);
    try {
      const res = await fetch('/api/admin/settings/llms', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const text = await fetchLlmsTxt();
      setLlmsContent(text);
      toast.success('llms.txt가 재생성되었습니다.');
    } catch {
      toast.error('llms.txt 재생성에 실패했습니다.');
    } finally {
      setLlmsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <AdminPageHeader
        title="블로그 설정 관리"
        description="블로그 운영에 필요한 설정을 관리합니다."
      />

      <NowEditor />

      {/* llms.txt 섹션 */}
      <section className="bg-surface rounded-xl overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-hairline">
          <div className="flex items-center gap-2 min-w-0">
            <HiOutlineDocumentText size={20} className="text-fg-muted" />
            <div>
              <h2 className="text-base font-semibold">llms.txt</h2>
              <p className="text-xs text-fg-muted">
                AI 크롤러용 블로그 소개 파일 —{' '}
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  /llms.txt
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={handleRegenerateLlms}
            disabled={llmsLoading}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-on-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw size={14} className={llmsLoading ? 'animate-spin' : ''} />
            {llmsLoading ? '재생성 중...' : '재생성'}
          </button>
        </div>

        <div className="px-6 py-4">
          {llmsFetching ? (
            <div className="animate-pulse space-y-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-3.5 bg-raised rounded"
                  style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%` }}
                />
              ))}
            </div>
          ) : llmsContent ? (
            <pre className="text-xs text-fg-soft leading-relaxed whitespace-pre-wrap font-mono bg-raised/40 rounded-lg p-4 max-h-[480px] overflow-auto">
              {llmsContent}
            </pre>
          ) : (
            <p className="text-sm text-fg-muted py-4 text-center">
              llms.txt 파일이 없습니다. 재생성 버튼을 눌러 생성하세요.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
