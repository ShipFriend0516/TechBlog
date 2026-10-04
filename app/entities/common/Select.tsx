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
      className="block py-1.5 px-2 w-full text-sm text-fg-soft bg-transparent border-0 border-b border-hairline appearance-none focus:outline-none focus:ring-0 focus:border-accent peer"
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
