import { ChangeEvent, memo, useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import Select from '@/app/entities/common/Select';
import useTagAutocomplete from '@/app/hooks/post/useTagAutocomplete';
import { Series } from '@/app/types/Series';
import Switch from './Switch';
import TagAutocompleteDropdown from './TagAutocompleteDropdown';

interface PostMetadataFormProps {
  onFieldChange: (field: string, value: string | boolean | string[]) => void;
  seriesLoading: boolean;
  series: Series[];
  onClickNewSeries: () => void;
  isEditMode?: boolean;
  formData: {
    slug: string;
    seriesId?: string;
    tags: string[];
    isPrivate: boolean;
    sendToSubscribers: boolean;
  };
}

const labelStyle = 'mb-1.5 block text-xs font-medium text-fg-muted';

const PostMetadataForm = ({
  onFieldChange,
  seriesLoading,
  series,
  onClickNewSeries,
  isEditMode = false,
  formData,
}: PostMetadataFormProps) => {
  const [tagInput, setTagInput] = useState<string>('');
  const [slugError, setSlugError] = useState<string>('');

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[가-힣]/.test(value)) {
      setSlugError(
        '한글은 입력할 수 없습니다. 영문, 숫자, 하이픈(-)만 사용하세요.'
      );
    } else if (value && !/^[a-zA-Z0-9-]+$/.test(value)) {
      setSlugError('영문, 숫자, 하이픈(-)만 사용할 수 있습니다.');
    } else {
      setSlugError('');
    }
    onFieldChange('slug', value);
  };

  const {
    slug,
    seriesId,
    tags,
    isPrivate,
    sendToSubscribers,
  } = formData;

  const {
    suggestions,
    isOpen,
    highlightedIndex,
    setIsOpen,
    setHighlightedIndex,
  } = useTagAutocomplete({ tagInput, currentTags: tags });
  const selectOptions = series.map((s) => ({
    value: s._id,
    label: s.title,
  }));
  const defaultSeriesId = seriesId
    ? seriesId
    : series.length > 0
      ? series[0]._id
      : '';

  const handleSeriesChange = (value: string) => {
    onFieldChange('seriesId', value);
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputBlur = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleTagRemove = (index: number) => {
    onFieldChange(
      'tags',
      tags.filter((_, i) => i !== index)
    );
  };

  const handleSelectSuggestion = (tag: string) => {
    if (!tags.includes(tag)) {
      onFieldChange('tags', [...(tags || []), tag]);
    }
    setTagInput('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'ArrowDown' && isOpen && suggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }
    if (e.key === 'ArrowUp' && isOpen && suggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
    if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0) {
        handleSelectSuggestion(suggestions[highlightedIndex].tag);
        return;
      }
      if (tagInput.trim() !== '') {
        if (tags.includes(tagInput)) {
          setTagInput('');
          return;
        }
        onFieldChange('tags', [...(tags || []), tagInput]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && tagInput === '') {
      onFieldChange('tags', tags.slice(0, -1));
    }
  };

  const handlePrivateChange = (newIsPrivate: boolean) => {
    onFieldChange('isPrivate', newIsPrivate);
    if (newIsPrivate) {
      onFieldChange('sendToSubscribers', false);
    }
  };

  const handleSendToSubscribersChange = (checked: boolean) => {
    onFieldChange('sendToSubscribers', checked);
  };

  return (
    <div className="rounded-xl border bg-surface p-5 space-y-6">
      <h2 className="text-sm font-semibold text-fg">발행 설정</h2>

      <div>
        <label htmlFor="post-slug" className={labelStyle}>
          슬러그
        </label>
        <div
          className={`flex items-center rounded-lg bg-raised px-3 text-sm focus-within:ring-2 ${
            slugError ? 'ring-2 ring-danger/60' : 'focus-within:ring-accent/40'
          } ${isEditMode ? 'opacity-60' : ''}`}
        >
          <span className="text-fg-faint select-none">/posts/</span>
          <input
            id="post-slug"
            type="text"
            placeholder={isEditMode ? '' : 'my-post-title'}
            className="min-w-0 flex-1 bg-transparent py-2 text-fg outline-none placeholder:text-fg-faint disabled:cursor-not-allowed"
            onChange={handleSlugChange}
            value={slug}
            disabled={isEditMode}
            required
          />
        </div>
        <p className={`mt-1.5 text-xs ${slugError ? 'text-danger' : 'text-fg-muted'}`}>
          {slugError ||
            (isEditMode
              ? '발행된 글의 슬러그는 바꿀 수 없습니다.'
              : '영문, 숫자, 하이픈(-)만 사용할 수 있습니다.')}
        </p>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-fg-muted">시리즈</span>
          <button
            type="button"
            onClick={onClickNewSeries}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-strong"
          >
            <FiPlus size={12} />새 시리즈
          </button>
        </div>
        {seriesLoading ? (
          <div className="h-9 rounded-lg bg-raised animate-pulse" />
        ) : (
          <Select
            options={selectOptions}
            setValue={handleSeriesChange}
            defaultValue={defaultSeriesId}
            className="block w-full rounded-lg bg-raised px-3 py-2 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
          />
        )}
      </div>

      <div>
        <label htmlFor="post-tag-input" className={labelStyle}>
          태그
        </label>
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-raised p-2 focus-within:ring-2 focus-within:ring-accent/40">
          {(tags || []).map((tag, index) => (
            <button
              type="button"
              key={`${tag}-${index}`}
              onClick={() => handleTagRemove(index)}
              aria-label={`${tag} 태그 삭제`}
              className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-fg hover:text-danger"
            >
              {tag}
              <FiX size={12} />
            </button>
          ))}
          <div className="relative min-w-[6rem] flex-1">
            <input
              id="post-tag-input"
              type="text"
              placeholder={tags.length ? '' : '입력 후 Enter'}
              className="w-full bg-transparent px-1 py-0.5 text-sm text-fg outline-none placeholder:text-fg-faint"
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              onBlur={handleTagInputBlur}
              value={tagInput}
            />
            <TagAutocompleteDropdown
              suggestions={suggestions}
              isOpen={isOpen}
              highlightedIndex={highlightedIndex}
              onSelect={handleSelectSuggestion}
              onMouseEnter={setHighlightedIndex}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t pt-5">
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span>
            <span className="block text-sm text-fg">비공개</span>
            <span className="block text-xs text-fg-muted">
              관리자만 볼 수 있습니다.
            </span>
          </span>
          <Switch checked={isPrivate} onChange={handlePrivateChange} />
        </label>
        <label
          className={`flex items-center justify-between gap-3 ${
            isPrivate ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          <span>
            <span className="block text-sm text-fg">구독자에게 발행</span>
            <span className="block text-xs text-fg-muted">
              발행할 때 구독자에게 메일을 보냅니다.
            </span>
          </span>
          <Switch
            checked={sendToSubscribers}
            onChange={handleSendToSubscribersChange}
            disabled={isPrivate}
          />
        </label>
      </div>
    </div>
  );
};

export default memo(PostMetadataForm);
