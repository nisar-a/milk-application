import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const SalesChart = ({ data = [] }) => {
  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <p className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-200">Daily Milk and Revenue</p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="milkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area type="monotone" dataKey="milk" stroke="#0f766e" fill="url(#milkGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
