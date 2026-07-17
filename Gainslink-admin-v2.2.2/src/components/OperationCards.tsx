import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, Flame, Snowflake, Users, Trophy, Heart, Share2 } from 'lucide-react';
import { userSegment, retentionTrend, gameCategory, profitTrend, betDistribution, careFunnel } from '../data/mockData';

function UserCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Users size={16} className="text-blue-500" />
          用户运营
        </h3>
        <span className="text-xs text-slate-400">近7日</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-slate-500 mb-1">用户分层</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={userSegment} cx="50%" cy="50%" innerRadius={25} outerRadius={60} paddingAngle={2} dataKey="value">
                {userSegment.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
            {userSegment.map(s => (
              <div key={s.name} className="flex items-center gap-1 text-[10px]">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-slate-600">{s.name}{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">7日留存趋势</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={retentionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 10 }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="newUser" name="新用户" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="oldUser" name="老用户" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">投注转化率</span>
          <span className="font-medium text-slate-800">3.2%</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-500">访问→详情→投注→复投</span>
          <span className="text-blue-500 cursor-pointer">查看漏斗</span>
        </div>
      </div>
    </div>
  );
}

function MatchCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          赛事运营
        </h3>
        <span className="text-xs text-slate-400">本周</span>
      </div>
      <div className="space-y-2 mb-3">
        {gameCategory.map(g => (
          <div key={g.game} className="flex items-center gap-2">
            <span className="text-xs text-slate-600 w-16">{g.game}</span>
            <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(g.bets / 68000) * 100}%` }} />
            </div>
            <span className="text-xs text-slate-500 w-12 text-right">{(g.bets / 1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs">
          <Flame size={12} className="text-red-500" />
          <span className="text-slate-500">热门:</span>
          <span className="text-slate-700 font-medium">MLBB总决赛</span>
          <span className="text-slate-400 ml-auto">1,250人投注</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Snowflake size={12} className="text-blue-500" />
          <span className="text-slate-500">冷门:</span>
          <span className="text-slate-700 font-medium">eFootball预选赛</span>
          <span className="text-slate-400 ml-auto">12人投注</span>
        </div>
      </div>
    </div>
  );
}

function FinanceCard() {
  const totalProfit = profitTrend.reduce((a, b) => a + b.profit, 0);
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-500" />
          投注财务
        </h3>
        <span className={`text-xs font-medium ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          本周盈亏: {totalProfit > 0 ? '+' : ''}{totalProfit.toLocaleString()}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={profitTrend}>
          <defs>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#cbd5e1" />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey="profit" stroke="#3b82f6" fill="url(#profitGrad)" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100">
        {betDistribution.map(b => (
          <div key={b.result} className="text-center">
            <div className="text-xs text-slate-500">{b.result}</div>
            <div className="text-sm font-bold" style={{ color: b.color }}>{b.pct}%</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs">
        <span className="text-slate-500">赔率健康度</span>
        <span className="text-emerald-600 font-medium">102% (正常)</span>
      </div>
      <div className="mt-1 flex justify-between text-xs">
        <span className="text-slate-500">人均投注</span>
        <span className="text-slate-700 font-medium">856 积分</span>
      </div>
    </div>
  );
}

function CareCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Heart size={16} className="text-red-500" />
          社交关怀
        </h3>
        <span className="text-xs text-slate-400">本周</span>
      </div>
      <div className="mb-3">
        <div className="text-xs text-slate-500 mb-1">关怀漏斗效果</div>
        <div className="space-y-1.5">
          {careFunnel.map((stage, i) => {
            const prev = i > 0 ? careFunnel[i - 1].count : stage.count;
            const rate = i > 0 ? Math.round((stage.count / prev) * 100) : 100;
            return (
              <div key={stage.stage} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-14">{stage.stage}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${(stage.count / 120) * 100}%` }} />
                </div>
                <span className="text-[10px] text-slate-600 w-8 text-right">{stage.count}</span>
                {i > 0 && <span className="text-[10px] text-slate-400">{rate}%</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-1 text-[10px] text-red-500">7日复投率 44% 偏低，建议提高关怀比例</div>
      </div>
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs mb-1">
          <Share2 size={12} className="text-blue-500" />
          <span className="text-slate-500">分享转化: 320次→890访问→56注册→23投注</span>
        </div>
        <div className="flex gap-3 text-xs mt-2">
          <div className="bg-red-50 rounded px-2 py-1">
            <span className="text-slate-500">红板Top1:</span>
            <span className="text-red-600 font-medium ml-1">User#8821</span>
          </div>
          <div className="bg-slate-100 rounded px-2 py-1">
            <span className="text-slate-500">黑板Top1:</span>
            <span className="text-slate-700 font-medium ml-1">User#3341</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OperationCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UserCard />
      <MatchCard />
      <FinanceCard />
      <CareCard />
    </div>
  );
}
