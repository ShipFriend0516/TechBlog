import { FaSearch } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import Tag from '@/app/entities/common/Tag';

const SearchOverlayContainer = (props: {
  setQuery: (query: string) => void;
  value: string;
  onCancel: () => void;
  tags: string[];
}) => {
  const emptyInput = () => {
    props.setQuery('');
  };

  return (
    <div className="bg-overlay rounded-lg px-5 p-4">
      <div className="flex mb-4">
        <div className={'flex flex-grow items-center space-x-4 relative'}>
          <FaSearch size={20} className="text-fg-muted" />
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            className="w-full p-2 outline-none text-fg"
            autoFocus
            onChange={(e) => props.setQuery(e.target.value)}
            value={props.value}
          />
          <button
            className={`${props.value ? 'block' : 'hidden'} p-2 text-fg-muted absolute right-2`}
            onClick={emptyInput}
          >
            <FaX />
          </button>
        </div>
        <button
          onClick={props.onCancel}
          className="text-fg-muted hover:text-fg p-2"
        >
          ESC
        </button>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-fg-muted">최근 검색어</div>
        <div className="flex flex-wrap gap-2 text-fg">
          {props.tags.map((tag) => (
            <Tag key={tag} content={tag} onClick={() => props.setQuery(tag)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlayContainer;
