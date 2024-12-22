import { FaSearch } from 'react-icons/fa';
import Tag from '@/app/entities/common/Tag';

const SearchOverlayContainer = (props: {
  setQuery: (query: string) => void;
  value: string;
  onCancel: () => void;
  tags: string[];
}) => {
  return (
    <div className="px-5 p-4">
      <div className="flex items-center space-x-4 mb-4">
        <FaSearch size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          className="w-full p-2 outline-none"
          autoFocus
          onChange={(e) => props.setQuery(e.target.value)}
          value={props.value}
        />
        <button
          onClick={props.onCancel}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          ESC
        </button>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-500">최근 검색어</div>
        <div className="flex flex-wrap gap-2">
          {props.tags.map((tag) => (
            <Tag key={tag} content={tag} onClick={() => props.setQuery(tag)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlayContainer;
