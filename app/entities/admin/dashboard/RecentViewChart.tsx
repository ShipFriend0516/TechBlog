import { memo, useMemo } from 'react';
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatShortDate } from '@/app/lib/utils/format';
import { DailyView } from '@/app/types/Admin';

const DailyViewsChart = ({ data }: { data: DailyView[] }) => {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: formatShortDate(d.date),
        조회수: d.count,
      })),
    [data]
  );

  if (data.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-xs text-fg-muted mb-3">
        최근 14일 조회수
      </p>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3"
            stroke="rgb(var(--fg) / 0.08)"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'rgb(var(--fg-muted))' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'rgb(var(--fg-muted))' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--overlay))',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'rgb(var(--fg))',
              padding: '6px 10px',
            }}
            itemStyle={{ color: 'rgb(var(--accent))' }}
            formatter={(value) => [
              `${Number(value).toLocaleString()}회`,
              '조회수',
            ]}
            cursor={{ stroke: 'rgb(var(--accent))', strokeWidth: 1, strokeOpacity: 0.4 }}
          />
          <Line
            type="monotone"
            dataKey="조회수"
            stroke="rgb(var(--accent))"
            strokeWidth={2}
            dot={<Dot r={3} fill="rgb(var(--accent))" stroke="rgb(var(--accent-strong))" strokeWidth={1} />}
            activeDot={{
              r: 5,
              fill: 'rgb(var(--accent))',
              stroke: 'rgb(var(--surface))',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(DailyViewsChart);
