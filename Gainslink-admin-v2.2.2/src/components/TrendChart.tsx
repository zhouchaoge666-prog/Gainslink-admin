import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { hourlyTrendNew, gameBets } from '../data/mockData';

export default function TrendChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 左侧：趋势分析 */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-4">趋势分析</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={hourlyTrendNew}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
            />
            <Line yAxisId="left" type="monotone" dataKey="betUsers" name="投注人数" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="betCount" name="投注笔数" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="betPointsGL" name="投注积分(Gainslink)" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line yAxisId="right" type="monotone" dataKey="betPointsSV" name="投注积分(Salvo)" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs text-slate-500">
          <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-purple-500" />投注人数</div>
          <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-500" />投注笔数</div>
          <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-emerald-500" />投注积分(Gainslink)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-amber-500" />投注积分(Salvo)</div>
        </div>
      </div>

      {/* 右侧：投注赛事 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-4">投注赛事</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={gameBets}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="game" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Bar dataKey="betCount" name="投注笔数" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
