interface AutoSyncToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const AutoSyncToggle = ({ enabled, onToggle }: AutoSyncToggleProps) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <span className="text-sm font-medium text-fg">
        자동 클라우드 저장 (3분)
      </span>
      <div className="relative">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-raised peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-hairline after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-hairline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </div>
    </label>
  );
};

export default AutoSyncToggle;
