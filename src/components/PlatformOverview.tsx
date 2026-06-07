import { useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import {
  Users, UserPlus, Activity, Ticket, Trophy, RefreshCw, Link2, Star, UserCheck,
} from 'lucide-react';
import {
  overviewKpiDataV2,
  coreDailyDataNew, coreWeeklyDataNew, coreMonthlyDataNew,
  weeklyRetentionData,
  userSourceData,
  userPointDistribution, matchUserDistribution, userCountryDistribution,
} from '../data/mockData';

const iconMap: Record<string, React.ElementType> = {
  '今日活跃用户': Activity,
  '总注册用户': Users,
  '今日新增用户': UserPlus,
  '七日用户回流数': UserCheck,
  '报名用户/待审核': Ticket,
  '总进行中的赛事/开放报名赛事': Trophy,
  '积分签到人次': Star,
  '被邀请注册成功人数': Link2,
};

const statusStyles = {
  normal: { bg: 'bg-white', border: 'border-slate-200', change: 'text-emerald-600' },
  danger: { bg: 'bg-red-50', border: 'border-red-200', change: 'text-red-600' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', change: 'text-amber-600' },
};

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// ============ 实时看板 ============
function RealTimeKpi() {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setSpinning(false);
    }, 600);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">实时看板</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">更新时间：{formatTime(lastRefresh)}</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={spinning ? 'animate-spin' : ''} />
            刷新
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {overviewKpiDataV2.map((item) => {
          const Icon = iconMap[item.label] || Activity;
          const style = statusStyles[item.status];
          const isNegative = item.changeType === 'down';
          return (
            <div key={item.label} className={`${style.bg} border ${style.border} rounded-xl p-4 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Icon size={14} />
                  <span>{item.label}</span>
                </div>
                {item.status === 'warning' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded">关注</span>
                )}
              </div>
              {'pending' in item && item.pending ? (
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {item.value}
                  <span className="text-slate-300 mx-1">/</span>
                  <span className={item.pendingColor === 'danger' ? 'text-danger' : 'text-primary'}>
                    {item.pending}
                    {item.pendingLabel ? (
                      <span className="text-xs font-normal">（{item.pendingLabel}）</span>
                    ) : null}
                  </span>
                </div>
              ) : (
                <div className="text-2xl font-bold text-slate-800 mb-1">{item.value}</div>
              )}
              <div className="text-xs">
                <span className={isNegative ? 'text-red-600' : style.change}>
                  {item.compareLabel} {isNegative ? '' : (item.change?.startsWith('+') ? '' : '+')}{item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ 核心数据看板 ============
const timeTabs = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
];

function CoreDataBoard() {
  const [activeTab, setActiveTab] = useState('day');
  const data = activeTab === 'day' ? coreDailyDataNew : activeTab === 'week' ? coreWeeklyDataNew : coreMonthlyDataNew;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">核心数据看板</h3>
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          {timeTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-xs rounded-md transition-colors ${activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 图1：用户增长趋势 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">用户增长趋势</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" interval={0} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="totalUsers" name="注册用户" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="newUsers" name="新增用户" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 图2：活跃用户分层 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">活跃用户分层</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" interval={0} />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="dau" name="活跃用户" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="matchSignupUsers" name="报名赛事用户" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pointActivityUsers" name="积分变化用户" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-500" />活跃用户</div>
            <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-purple-500" />报名赛事用户</div>
            <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-emerald-500" />积分变化用户</div>
          </div>
        </div>

        {/* 图3：赛事运营 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">赛事运营</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" interval={0} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="newMatches" name="新增赛事" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="signups" name="报名人次" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 图4：积分流水 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">积分流水</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" interval={0} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="pointFlow" name="积分总流水" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="pointChangeUsers" name="积分变动用户" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ============ 留存趋势（按周） ============
function RetentionChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h3 className="text-lg font-bold text-slate-800 mb-4">用户留存趋势（按周）</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={weeklyRetentionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" unit="%" />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: any) => [`${v}%`, '']} />
          <Line type="monotone" dataKey="d1" name="D1留存" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="d3" name="D3留存" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="d7" name="D7留存" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="d14" name="D14留存" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="d30" name="D30留存" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-500" />D1留存</div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-purple-500" />D3留存</div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-emerald-500" />D7留存</div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-amber-500" />D14留存</div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-red-500" />D30留存</div>
      </div>
    </div>
  );
}

// ============ 用户分布概览 ============
function UserDistribution() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800">用户分布概览</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 用户积分分布 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">用户积分分布</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userPointDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis dataKey="range" type="category" tick={{ fontSize: 12 }} stroke="#64748b" width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: any, _n: any, p: any) => [`${Number(v).toLocaleString()}人 (${p.payload.pct}%)`, '用户数']} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 参与不同赛事的用户分布 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">参与不同赛事的用户分布</h4>
          <div className="flex items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={matchUserDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="users">
                  {matchUserDistribution.map((_entry, index) => (
                    <Cell key={index} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#64748b'][index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: any, _n: any, p: any) => [`${Number(v).toLocaleString()}人 (${p.payload.pct}%)`, p.payload.game]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 min-w-[100px]">
              {matchUserDistribution.map((s, i) => (
                <div key={s.game} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#64748b'][i] }} />
                  <span className="text-slate-600">{s.game}</span>
                  <span className="text-slate-400 ml-auto">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 用户来源分布 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">用户来源分布</h4>
          <div className="flex items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={userSourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {userSourceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: any, _n: any, p: any) => [`${v}%`, p.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 min-w-[100px]">
              {userSourceData.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-600">{s.name}</span>
                  <span className="text-slate-400 ml-auto">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 用户国家分布 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">用户国家分布</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userCountryDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis dataKey="country" type="category" tick={{ fontSize: 12 }} stroke="#64748b" width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: any, _n: any, p: any) => [`${Number(v).toLocaleString()}人 (${p.payload.pct}%)`, '用户数']} />
              <Bar dataKey="users" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ============ 主组件 ============
export default function PlatformOverview() {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      <RealTimeKpi />
      <CoreDataBoard />
      <RetentionChart />
      <UserDistribution />
      <div className="h-4" />
    </div>
  );
}
