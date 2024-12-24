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
      className="w-full p-2 border text-overlay border-gray-300 rounded-md"
      defaultValue={defaultValue}
      onChange={(e) => setValue(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
export default Select;
