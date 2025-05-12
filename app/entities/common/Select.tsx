interface SelectOption<T> {
  value: T;
  label: string;
}
interface SelectProps<T> {
  options: SelectOption<T>[];
  defaultValue: T;
  setValue: (value: T) => void;
}
const Select = <T extends string>({
  options,
  defaultValue,
  setValue,
}: SelectProps<T>) => {
  return (
    <select
      key={defaultValue}
      className="block py-1.5 px-2 w-full text-sm text-weak bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-gray-400   focus:outline-none focus:ring-0 focus:border-gray-200 peer  "
      defaultValue={defaultValue}
      onChange={(e) => setValue(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
export default Select;
