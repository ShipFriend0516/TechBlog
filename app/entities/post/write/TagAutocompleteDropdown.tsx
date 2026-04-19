import { TagData } from '@/app/types/Tag';

interface TagAutocompleteDropdownProps {
  suggestions: TagData[];
  isOpen: boolean;
  highlightedIndex: number;
  onSelect: (tag: string) => void;
  onMouseEnter: (index: number) => void;
}

const TagAutocompleteDropdown = ({
  suggestions,
  isOpen,
  highlightedIndex,
  onSelect,
  onMouseEnter,
}: TagAutocompleteDropdownProps) => {
  if (!isOpen || suggestions.length === 0) return null;

  return (
    <div className="absolute z-50 mt-1 w-full min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.tag}
          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
            highlightedIndex === index
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelect(suggestion.tag)}
          onMouseEnter={() => onMouseEnter(index)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span>{suggestion.tag}</span>
          <span className="text-xs text-gray-400">({suggestion.count})</span>
        </div>
      ))}
    </div>
  );
};

export default TagAutocompleteDropdown;
