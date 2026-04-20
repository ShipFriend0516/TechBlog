// 채팅 피드 초기 로딩 스켈레톤
const SKELETON_ITEMS = [
  { mine: false, widths: ['w-32', 'w-48'] },
  { mine: true, widths: ['w-40'] },
  { mine: false, widths: ['w-56', 'w-36'] },
  { mine: true, widths: ['w-28', 'w-44'] },
  { mine: false, widths: ['w-48'] },
  { mine: true, widths: ['w-36'] },
  { mine: false, widths: ['w-52', 'w-32', 'w-44'] },
  { mine: true, widths: ['w-40', 'w-28'] },
];

const SkeletonBubble = ({
  mine,
  widths,
}: {
  mine: boolean;
  widths: string[];
}) => {
  const alignCls = mine ? 'items-end' : 'items-start';

  return (
    <div className={`flex flex-col gap-1 ${alignCls}`}>
      {/* 아바타 + 닉네임 (상대방 메시지) */}
      {!mine && (
        <div className="flex items-center gap-1.5 px-0 ml-1">
          <div className="-ml-1 w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="w-12 h-3 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>
      )}

      {/* 버블 */}
      <div className="max-w-[75%] flex flex-col gap-1">
        {widths.map((w, i) => (
          <div
            key={i}
            className={`h-9 ${w} rounded-2xl ${
              mine ? 'rounded-tr-sm' : 'rounded-tl-sm'
            } bg-neutral-200 dark:bg-neutral-700 animate-pulse`}
          />
        ))}
      </div>

      {/* 시간 */}
      <div className="w-8 h-2.5 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse mx-1" />
    </div>
  );
};

const ChatFeedSkeleton = () => (
  <div className="flex flex-col gap-4 h-full overflow-hidden border border-border rounded-2xl p-4">
    {SKELETON_ITEMS.map((item, i) => (
      <SkeletonBubble key={i} mine={item.mine} widths={item.widths} />
    ))}
  </div>
);

export default ChatFeedSkeleton;
