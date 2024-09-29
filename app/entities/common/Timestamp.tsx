interface Props {
  date: number | Date;
}
const Timestamp = ({ date }: Props) => {
  const timestamp = (date: number | Date): Date => {
    return date instanceof Date ? date : new Date(date);
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

    if (diffSeconds < 60) {
      return '방금 전';
    } else if (diffMinutes < 60) {
      return rtf.format(-diffMinutes, 'minute');
    } else if (diffHours < 24) {
      return rtf.format(-diffHours, 'hour');
    } else if (diffDays < 7) {
      return rtf.format(-diffDays, 'day');
    } else {
      return new Intl.DateTimeFormat('ko', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    }
  };

  return <div>{formatRelativeTime(timestamp(date))}</div>;
};

export default Timestamp;
