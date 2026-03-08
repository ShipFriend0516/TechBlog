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

interface DailyView {
  date: string;
  count: number;
}

const DailyViewsChart = ({ data }: { data: DailyView[] }) => {
  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    date: `${new Date(d.date).getMonth() + 1}/${new Date(d.date).getDate()}`,
    조회수: d.count,
  }));

  return (
    <div className="mt-6">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        최근 14일 조회수
      </p>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#fff',
              padding: '6px 10px',
            }}
            itemStyle={{ color: '#fb923c' }}
            formatter={(value) => [
              `${Number(value).toLocaleString()}회`,
              '조회수',
            ]}
            cursor={{ stroke: '#fb923c', strokeWidth: 1, strokeOpacity: 0.4 }}
          />
          <Line
            type="monotone"
            dataKey="조회수"
            stroke="#fb923c"
            strokeWidth={2}
            dot={<Dot r={3} fill="#fb923c" stroke="#fed7aa" strokeWidth={1} />}
            activeDot={{
              r: 5,
              fill: '#fb923c',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyViewsChart;
