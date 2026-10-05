import { memo } from 'react';

interface PostTitleFieldsProps {
  title: string;
  subTitle: string;
  onFieldChange: (field: string, value: string) => void;
}

const PostTitleFields = ({
  title,
  subTitle,
  onFieldChange,
}: PostTitleFieldsProps) => {
  return (
    <div className="space-y-1">
      <input
        type="text"
        aria-label="제목"
        placeholder="제목을 입력하세요"
        className="w-full bg-transparent text-3xl font-bold text-fg outline-none placeholder:text-fg-faint"
        onChange={(e) => onFieldChange('title', e.target.value)}
        value={title}
      />
      <input
        type="text"
        aria-label="소제목"
        placeholder="소제목 (목록과 검색 결과에 보이는 한 줄 설명)"
        className="w-full bg-transparent text-lg text-fg-soft outline-none placeholder:text-fg-faint"
        onChange={(e) => onFieldChange('subTitle', e.target.value)}
        value={subTitle}
      />
    </div>
  );
};

export default memo(PostTitleFields);
