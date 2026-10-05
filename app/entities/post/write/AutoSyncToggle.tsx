import Switch from '@/app/entities/post/write/Switch';

interface AutoSyncToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const AutoSyncToggle = ({ enabled, onToggle }: AutoSyncToggleProps) => {
  return (
    <label
      className="inline-flex items-center gap-2 cursor-pointer text-sm text-fg-soft"
      title="3분마다 클라우드에 자동 저장"
    >
      자동 저장
      <Switch checked={enabled} onChange={onToggle} />
    </label>
  );
};

export default AutoSyncToggle;
