import { useState, useMemo } from 'react';
import {
  Trophy, Activity, Users, Clock, Award, CalendarDays, ArrowUpRight, CheckCircle,
  ShieldCheck, X, Check, Shield,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MatchItem } from '../../data/mockData';
import { teamListData } from '../../data/mockData';

type KpiFilter = 'pendingReview' | 'pendingPublish' | 'pendingSignupAudit' | 'live' | 'open' | 'pendingResult' | 'pendingPoints' | null;
type Granularity = 'day' | 'week' | 'month';

interface MatchDashboardProps {
  matches: MatchItem[];
  onViewMatch?: (match: MatchItem, tab?: string) => void;
  onApprove?: (matchId: string) => void;
  onReject?: (matchId: string, reason?: string) => void;
}

// ─── Trend mock data ───────────────────────────────────────────────────────────

const trendByGranularity: Record<Granularity, { label: string; newMatches: number; signups: number }[]> = {
  day: [
    { label: '6/21', newMatches: 2, signups: 380 },
    { label: '6/22', newMatches: 1, signups: 210 },
    { label: '6/23', newMatches: 3, signups: 560 },
    { label: '6/24', newMatches: 0, signups: 190 },
    { label: '6/25', newMatches: 1, signups: 320 },
    { label: '6/26', newMatches: 2, signups: 445 },
    { label: '今天', newMatches: 1, signups: 280 },
  ],
  week: [
    { label: 'W17', newMatches: 8, signups: 1200 },
    { label: 'W18', newMatches: 10, signups: 1450 },
    { label: 'W19', newMatches: 7, signups: 1100 },
    { label: 'W20', newMatches: 12, signups: 1800 },
    { label: 'W21', newMatches: 9, signups: 1500 },
    { label: '本周', newMatches: 5, signups: 980 },
  ],
  month: [
    { label: '1月', newMatches: 28, signups: 4200 },
    { label: '2月', newMatches: 22, signups: 3100 },
    { label: '3月', newMatches: 35, signups: 5800 },
    { label: '4月', newMatches: 41, signups: 6900 },
    { label: '5月', newMatches: 38, signups: 6200 },
    { label: '6月', newMatches: 24, signups: 3900 },
  ],
};

// ─── Status labels ─────────────────────────────────────────────────────────────

const statusLabel: Record<MatchItem['status'], { text: string; cls: string }> = {
  draft:     { text: '未发布',   cls: 'text-slate-500 bg-slate-100' },
  open:      { text: '报名中',   cls: 'text-emerald-600 bg-emerald-50' },
  closing:   { text: '即将截止', cls: 'text-amber-600 bg-amber-50' },
  live:      { text: '进行中',   cls: 'text-blue-600 bg-blue-50' },
  ended:     { text: '已结束',   cls: 'text-slate-400 bg-slate-50' },
  cancelled: { text: '已取消',   cls: 'text-red-400 bg-red-50' },
};

const gameColor: Record<string, string> = {
  'MLBB':      'text-blue-600 bg-blue-50',
  'Dota 2':    'text-red-600 bg-red-50',
  'PUBG':      'text-amber-600 bg-amber-50',
  'eFootball': 'text-emerald-600 bg-emerald-50',
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function filterByKpi(matches: MatchItem[], filter: KpiFilter): MatchItem[] {
  switch (filter) {
    case 'pendingReview':     return matches.filter((m) => m.source === 'user' && m.approvalStatus === 'pending_review');
    case 'pendingPublish':    return matches.filter((m) => m.source === 'admin' && m.status === 'draft');
    case 'pendingSignupAudit':return matches.filter((m) => m.pendingAudit > 0);
    case 'live':              return matches.filter((m) => m.status === 'live');
    case 'open':              return matches.filter((m) => m.status === 'open' || m.status === 'closing');
    case 'pendingResult':     return matches.filter((m) => m.status === 'ended');
    case 'pendingPoints':     return matches.filter((m) => m.status === 'ended' && m.pointsPool > 0);
    default:
      return matches.filter((m) =>
        (m.source === 'user' && m.approvalStatus === 'pending_review') ||
        (m.source === 'admin' && m.status === 'draft') ||
        m.pendingAudit > 0 ||
        m.status === 'ended'
      );
  }
}

function tabForFilter(filter: KpiFilter, match: MatchItem): string {
  switch (filter) {
    case 'pendingReview':     return 'basic';
    case 'pendingPublish':    return 'basic';
    case 'pendingSignupAudit':return 'signup';
    case 'open':              return 'signup';
    case 'live':
    case 'pendingResult':
    case 'pendingPoints':     return 'competition';
    default:
      if (match.source === 'user' && match.approvalStatus === 'pending_review') return 'basic';
      if (match.status === 'draft') return 'basic';
      if (match.pendingAudit > 0)   return 'signup';
      return 'competition';
  }
}

function pendingBadge(match: MatchItem, filter: KpiFilter): { text: string; cls: string } | null {
  if (filter === 'pendingReview' || (filter === null && match.source === 'user' && match.approvalStatus === 'pending_review'))
    return { text: `待审核 · ${match.organizerName}`, cls: 'bg-violet-50 text-violet-600' };
  if (filter === 'pendingSignupAudit' || (filter === null && match.pendingAudit > 0))
    return { text: `待审核 ${match.pendingAudit} 队`, cls: 'bg-amber-50 text-amber-600' };
  if (filter === 'pendingPublish' || (filter === null && match.source === 'admin' && match.status === 'draft'))
    return { text: '待发布', cls: 'bg-slate-100 text-slate-500' };
  if (filter === 'pendingPoints')
    return { text: '代币待发放', cls: 'bg-violet-50 text-violet-600' };
  if (filter === 'pendingResult' || (filter === null && match.status === 'ended'))
    return { text: '成绩待录入', cls: 'bg-rose-50 text-rose-600' };
  return null;
}

function actionLabel(filter: KpiFilter): string {
  switch (filter) {
    case 'pendingReview':     return '查看详情';
    case 'pendingPublish':    return '去发布';
    case 'pendingSignupAudit':return '去审核';
    case 'open':              return '查看报名';
    case 'live':              return '查看赛程';
    case 'pendingResult':     return '录入成绩';
    case 'pendingPoints':     return '发放代币';
    default:                  return '去处理';
  }
}

// ─── Week calendar helpers ─────────────────────────────────────────────────────

const DAY_NAMES = ['一', '二', '三', '四', '五', '六', '日'];

function getWeekDays() {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return {
      date: `${mm}-${dd}`,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      dayName: DAY_NAMES[i],
    };
  });
}

function todayMMDD() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}-${dd}`;
}

function matchesOnDay(matches: MatchItem[], day: string): MatchItem[] {
  return matches.filter((m) => m.matchStart <= day && day <= m.matchEnd);
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({
  label, value, icon: Icon, color, active, onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
  active?: boolean;
  onClick?: () => void;
}) {
  const iconCls = {
    blue:    'text-blue-600 bg-blue-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber:   'text-amber-600 bg-amber-50',
    rose:    'text-rose-600 bg-rose-50',
    violet:  'text-violet-600 bg-violet-50',
    slate:   'text-slate-600 bg-slate-100',
  }[color];

  const ringCls = active ? 'ring-2 ring-primary shadow-md' : '';
  const cursorCls = onClick ? 'cursor-pointer hover:shadow-md' : '';

  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-4 transition-shadow ${ringCls} ${cursorCls}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconCls}`}>
          <Icon size={14} />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      {onClick && (
        <div className={`text-[10px] mt-1 ${active ? 'text-primary' : 'text-slate-400'}`}>
          {active ? '已筛选 · 点击取消' : '点击筛选待办'}
        </div>
      )}
    </div>
  );
}

function PendingSection({
  matches, filter, onViewMatch, onApprove, onReject,
}: {
  matches: MatchItem[];
  filter: KpiFilter;
  onViewMatch?: (match: MatchItem, tab?: string) => void;
  onApprove?: (matchId: string) => void;
  onReject?: (matchId: string, reason?: string) => void;
}) {
  const title = filter === null ? '全部待办赛事' : {
    pendingReview:      '待审核赛事（用户提交）',
    pendingPublish:     '待发布赛事',
    pendingSignupAudit: '待审核报名',
    live:               '进行中赛事',
    open:               '报名中赛事',
    pendingResult:      '待录入成绩',
    pendingPoints:      '待发放代币',
  }[filter];

  const shown = matches.slice(0, 6);
  const isReviewMode = filter === 'pendingReview';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="text-sm font-medium text-slate-800">{title}</div>
        <span className="text-xs text-slate-400">{matches.length} 个赛事</span>
      </div>

      {shown.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">暂无待办赛事</div>
      ) : (
        <div className="divide-y divide-slate-50">
          {shown.map((match) => {
            const badge = pendingBadge(match, filter);
            const tab   = tabForFilter(filter, match);
            const status = statusLabel[match.status];
            const game  = gameColor[match.game] ?? 'text-slate-600 bg-slate-100';
            return (
              <div key={match.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-800 truncate">{match.name}</span>
                    {match.source === 'user' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-medium shrink-0">用户提交</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${game}`}>
                      {match.game}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${status.cls}`}>
                      {status.text}
                    </span>
                    {badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${badge.cls}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-400 shrink-0 hidden sm:block">{match.id}</div>
                <div className="flex items-center gap-2 shrink-0">
                  {isReviewMode && onApprove && onReject && (
                    <>
                      <button
                        onClick={() => onReject(match.id, '')}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <X size={11} />
                        驳回
                      </button>
                      <button
                        onClick={() => onApprove(match.id)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <Check size={11} />
                        通过
                      </button>
                    </>
                  )}
                  {onViewMatch && (
                    <button
                      onClick={() => onViewMatch(match, tab)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      {actionLabel(filter)}
                      <ArrowUpRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WeekCalendar({ matches }: { matches: MatchItem[] }) {
  const weekDays = useMemo(() => getWeekDays(), []);
  const today = todayMMDD();
  const [selectedDay, setSelectedDay] = useState<string>(today);

  const dayMatchMap = useMemo(
    () => Object.fromEntries(weekDays.map(({ date }) => [date, matchesOnDay(matches, date)])),
    [matches, weekDays]
  );

  const dayMatches = dayMatchMap[selectedDay] ?? [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="text-sm font-medium text-slate-800">本周赛程</div>
      </div>

      {/* Day strip */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {weekDays.map(({ date, label, dayName }) => {
          const count  = dayMatchMap[date]?.length ?? 0;
          const isToday    = date === today;
          const isSelected = date === selectedDay;
          return (
            <button
              key={date}
              onClick={() => setSelectedDay(date)}
              className={`flex flex-col items-center py-3 gap-1 transition-colors ${
                isSelected
                  ? 'bg-primary/5'
                  : 'hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] ${isToday ? 'text-primary font-bold' : 'text-slate-400'}`}>
                {isToday ? '今天' : `周${dayName}`}
              </span>
              <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                {label}
              </span>
              {count > 0 ? (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count} 场
                </span>
              ) : (
                <span className="text-[10px] text-slate-200">—</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Matches for selected day */}
      <div className="px-4 py-3 min-h-[72px]">
        {dayMatches.length === 0 ? (
          <div className="text-xs text-slate-400 py-2">当天无赛事</div>
        ) : (
          <div className="space-y-2">
            {dayMatches.map((m) => {
              const status = statusLabel[m.status];
              const game   = gameColor[m.game] ?? 'text-slate-600 bg-slate-100';
              return (
                <div key={m.id} className="flex items-center gap-2 text-xs">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${game}`}>{m.game}</span>
                  <span className="text-slate-700 font-medium flex-1 truncate">{m.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${status.cls}`}>{status.text}</span>
                  <span className="text-slate-400 shrink-0">{m.matchStart} → {m.matchEnd}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TrendChart() {
  const [granularity, setGranularity] = useState<Granularity>('week');
  const data = trendByGranularity[granularity];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700">赛事与报名趋势</h3>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {(['day', 'week', 'month'] as Granularity[]).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                granularity === g
                  ? 'bg-white text-slate-800 font-medium shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {{ day: '日', week: '周', month: '月' }[g]}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Line yAxisId="left"  type="monotone" dataKey="newMatches" name="新增赛事" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="signups"    name="报名人数" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-blue-500 rounded" />新增赛事</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-[1px] bg-emerald-500 border-t border-dashed border-emerald-500" />报名人数</div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function MatchDashboard({ matches, onViewMatch, onApprove, onReject }: MatchDashboardProps) {
  const [kpiFilter, setKpiFilter] = useState<KpiFilter>(null);

  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const oneWeekAgo   = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  const weekAgoStr   = oneWeekAgo.toISOString().slice(0, 10);

  const stats = {
    pendingReview:      matches.filter((m) => m.source === 'user' && m.approvalStatus === 'pending_review').length,
    pendingPublish:     matches.filter((m) => m.source === 'admin' && m.status === 'draft').length,
    pendingSignupAudit: matches.reduce((s, m) => s + m.pendingAudit, 0),
    live:               matches.filter((m) => m.status === 'live').length,
    open:               matches.filter((m) => m.status === 'open' || m.status === 'closing').length,
    pendingResult:      matches.filter((m) => m.status === 'ended').length,
    pendingPoints:      matches.filter((m) => m.status === 'ended' && m.pointsPool > 0).length,
    monthTotal:         matches.filter((m) => m.matchStart.startsWith(currentMonthPrefix)).length,
    weekNew:            matches.filter((m) => m.createdAt >= weekAgoStr).length,
    totalTeams:         teamListData.filter((t) => t.status === 'active').length,
    newTeamsMonth:      teamListData.filter((t) => t.createdAt.startsWith(currentMonthPrefix)).length,
  };

  const pendingMatches = useMemo(() => filterByKpi(matches, kpiFilter), [matches, kpiFilter]);

  const toggleFilter = (key: KpiFilter) =>
    setKpiFilter((prev) => (prev === key ? null : key));

  type KpiCard = {
    key: KpiFilter;
    label: string;
    value: number;
    icon: React.ElementType;
    color: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
    clickable: boolean;
  };

  const kpiCards: KpiCard[] = [
    { key: 'pendingReview',      label: '待审核赛事', value: stats.pendingReview,      icon: ShieldCheck,  color: 'violet',  clickable: true },
    { key: 'pendingPublish',     label: '待发布赛事', value: stats.pendingPublish,     icon: Clock,        color: 'amber',   clickable: true },
    { key: 'pendingSignupAudit', label: '待审核报名', value: stats.pendingSignupAudit, icon: Users,        color: 'blue',    clickable: true },
    { key: 'live',               label: '进行中赛事', value: stats.live,               icon: Activity,     color: 'blue',    clickable: true },
    { key: 'open',               label: '报名中赛事', value: stats.open,               icon: Trophy,       color: 'emerald', clickable: true },
    { key: 'pendingResult',      label: '待录入成绩', value: stats.pendingResult,      icon: Award,        color: 'rose',    clickable: true },
    { key: null,                 label: '本月赛事数', value: stats.monthTotal,         icon: CalendarDays, color: 'slate',   clickable: false },
    { key: null,                 label: '注册战队数', value: stats.totalTeams,         icon: Shield,       color: 'violet',  clickable: false },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">赛事运营看板</h2>
        <span className="text-xs text-slate-400">
          更新于 {now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <KpiCard
            key={i}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            active={card.clickable && kpiFilter === card.key}
            onClick={card.clickable ? () => toggleFilter(card.key) : undefined}
          />
        ))}
      </div>

      {/* 待办赛事 */}
      <PendingSection
        matches={pendingMatches}
        filter={kpiFilter}
        onViewMatch={onViewMatch}
        onApprove={onApprove}
        onReject={onReject}
      />

      {/* 本周赛程 */}
      <WeekCalendar matches={matches} />

      {/* 趋势图 */}
      <TrendChart />

      {/* 战队概况 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="text-sm font-medium text-slate-800 mb-3">战队概况</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '注册战队', value: teamListData.length, cls: 'text-primary' },
            { label: '正常战队', value: teamListData.filter((t) => t.status === 'active').length, cls: 'text-emerald-600' },
            { label: '本月新增', value: stats.newTeamsMonth, cls: 'text-blue-600' },
            { label: '已禁用', value: teamListData.filter((t) => t.status === 'disabled').length, cls: 'text-rose-500' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="text-center py-2">
              <div className={`text-2xl font-bold ${cls}`}>{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
