import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, Users, Shield, Ban, CheckCircle,
  ChevronLeft, ChevronRight, X, Trophy,
  Gamepad2, MapPin, CalendarDays, Crown,
  AlertCircle, TrendingUp,
} from 'lucide-react';
import { teamListData } from '../../data/mockData';
import type { TeamItem, TeamStatus } from '../../data/mockData';

// ── KPI ─────────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: number | string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <div className="text-xs text-slate-500">{label}</div>
        {sub && <div className="text-xs text-emerald-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── 状态 Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TeamStatus }) {
  return status === 'active' ? (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />正常
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />已禁用
    </span>
  );
}

// ── 比赛结果 Badge ────────────────────────────────────────────────────────────
function ResultBadge({ result }: { result: string }) {
  const map: Record<string, string> = {
    冠军: 'bg-amber-50 text-amber-700',
    亚军: 'bg-slate-100 text-slate-700',
    季军: 'bg-orange-50 text-orange-700',
    晋级: 'bg-blue-50 text-blue-700',
    淘汰: 'bg-slate-50 text-slate-400',
    参赛: 'bg-indigo-50 text-indigo-600',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[result] || 'bg-slate-100 text-slate-600'}`}>
      {result}
    </span>
  );
}

// ── 游戏色点 ──────────────────────────────────────────────────────────────────
const gameColors: Record<string, string> = {
  'MLBB':      'bg-blue-500',
  'Dota 2':    'bg-red-500',
  'PUBG':      'bg-amber-500',
  'eFootball': 'bg-emerald-500',
};
function GameBadge({ game }: { game: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
      <span className={`w-1.5 h-1.5 rounded-full ${gameColors[game] || 'bg-slate-400'}`} />
      {game}
    </span>
  );
}

// ── 战队 Logo Placeholder ─────────────────────────────────────────────────────
function TeamLogo({ name, size = 32 }: { name: string; size?: number }) {
  const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-indigo-100 text-indigo-700'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`rounded-lg flex items-center justify-center font-bold text-sm ${colors[idx]}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ── 战队详情抽屉 ──────────────────────────────────────────────────────────────
function TeamDetailDrawer({
  team,
  onClose,
  onToggleStatus,
}: {
  team: TeamItem;
  onClose: () => void;
  onToggleStatus: (id: string, status: TeamStatus) => void;
}) {
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[440px] bg-white shadow-2xl z-50 flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <TeamLogo name={team.name} size={40} />
            <div>
              <div className="font-semibold text-slate-800">{team.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <GameBadge game={team.game} />
                <StatusBadge status={team.status} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 基本信息 */}
          <div className="px-5 py-4 border-b border-slate-100 space-y-3">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">基本信息</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                {team.region}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CalendarDays size={14} className="text-slate-400" />
                {team.createdAt} 创建
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users size={14} className="text-slate-400" />
                {team.memberCount} 名成员
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Trophy size={14} className="text-slate-400" />
                参赛 {team.matchCount} 次
              </div>
            </div>
            {team.description && (
              <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">{team.description}</div>
            )}
          </div>

          {/* 成员列表 */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">成员列表</div>
            <div className="space-y-2">
              {team.members.map((m) => (
                <div key={m.userId} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {m.nickname.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm text-slate-700 font-medium">{m.nickname}</div>
                      <div className="text-[10px] text-slate-400">{m.userId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.role === 'captain' && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                        <Crown size={9} />队长
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{m.joinedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 参赛记录 */}
          <div className="px-5 py-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">近期参赛记录</div>
            {team.recentMatches.length === 0 ? (
              <div className="text-sm text-slate-400">暂无参赛记录</div>
            ) : (
              <div className="space-y-2.5">
                {team.recentMatches.map((m) => (
                  <div key={m.matchId} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-700">{m.matchName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{m.matchId} · {m.date}</div>
                    </div>
                    <ResultBadge result={m.result} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 操作区 */}
        <div className="px-5 py-4 border-t border-slate-100">
          {team.status === 'active' ? (
            <div>
              <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                禁用后该战队将无法参加新赛事，已参加的赛事不受影响。
              </div>
              <button
                onClick={() => onToggleStatus(team.id, 'disabled')}
                className="w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Ban size={14} />
                禁用战队
              </button>
            </div>
          ) : (
            <button
              onClick={() => onToggleStatus(team.id, 'active')}
              className="w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <CheckCircle size={14} />
              解除禁用
            </button>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

// ── 主页面 ────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;
const games = ['全部游戏', 'MLBB', 'Dota 2', 'PUBG', 'eFootball'];

export default function TeamManagement() {
  const [teams, setTeams] = useState<TeamItem[]>(teamListData);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('全部游戏');
  const [statusFilter, setStatusFilter] = useState<'all' | TeamStatus>('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<TeamItem | null>(null);

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.captainName.toLowerCase().includes(search.toLowerCase())) return false;
      if (gameFilter !== '全部游戏' && t.game !== gameFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      return true;
    });
  }, [teams, search, gameFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const kpi = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return {
      total: teams.length,
      active: teams.filter((t) => t.status === 'active').length,
      thisMonth: teams.filter((t) => t.createdAt.startsWith(currentMonth)).length,
      disabled: teams.filter((t) => t.status === 'disabled').length,
    };
  }, [teams]);

  const handleToggleStatus = (id: string, status: TeamStatus) => {
    setTeams((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    setSelected((prev) => prev?.id === id ? { ...prev, status } : prev);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Users size={18} className="text-white" />}
          label="总战队数" value={kpi.total} color="bg-primary"
        />
        <KpiCard
          icon={<CheckCircle size={18} className="text-white" />}
          label="正常战队" value={kpi.active} sub="可参赛" color="bg-emerald-500"
        />
        <KpiCard
          icon={<TrendingUp size={18} className="text-white" />}
          label="本月新增" value={kpi.thisMonth} color="bg-blue-500"
        />
        <KpiCard
          icon={<Ban size={18} className="text-white" />}
          label="已禁用" value={kpi.disabled} color="bg-rose-400"
        />
      </div>

      {/* 列表区 */}
      <div className="bg-white rounded-xl border border-slate-200">
        {/* 搜索栏 */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="搜索战队名 / 队长"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary"
            />
          </div>
          <select
            value={gameFilter}
            onChange={(e) => { setGameFilter(e.target.value); setPage(1); }}
            className="text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
          >
            {games.map((g) => <option key={g}>{g}</option>)}
          </select>
          <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden text-sm">
            {(['all', 'active', 'disabled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-2 transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {s === 'all' ? '全部' : s === 'active' ? '正常' : '已禁用'}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400 ml-auto">共 {filtered.length} 支战队</div>
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-4 py-3 font-medium">战队</th>
                <th className="text-left px-4 py-3 font-medium">游戏</th>
                <th className="text-left px-4 py-3 font-medium">队长</th>
                <th className="text-left px-4 py-3 font-medium">地区</th>
                <th className="text-center px-4 py-3 font-medium">成员数</th>
                <th className="text-center px-4 py-3 font-medium">参赛场次</th>
                <th className="text-left px-4 py-3 font-medium">创建时间</th>
                <th className="text-left px-4 py-3 font-medium">状态</th>
                <th className="text-center px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">暂无符合条件的战队</td>
                </tr>
              ) : pageData.map((team) => (
                <tr
                  key={team.id}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelected(team)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <TeamLogo name={team.name} size={32} />
                      <div>
                        <div className="font-medium text-slate-800">{team.name}</div>
                        <div className="text-[10px] text-slate-400">{team.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><GameBadge game={team.game} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Crown size={12} className="text-amber-500" />
                      {team.captainName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {team.region}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{team.memberCount}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{team.matchCount}</td>
                  <td className="px-4 py-3 text-slate-500">{team.createdAt}</td>
                  <td className="px-4 py-3"><StatusBadge status={team.status} /></td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelected(team)}
                        className="text-xs px-2.5 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        详情
                      </button>
                      {team.status === 'active' ? (
                        <button
                          onClick={() => handleToggleStatus(team.id, 'disabled')}
                          className="text-xs px-2.5 py-1 border border-rose-100 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          禁用
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(team.id, 'active')}
                          className="text-xs px-2.5 py-1 border border-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          解禁
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <div className="text-xs text-slate-400">
              第 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} 条，共 {filtered.length} 条
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded-lg hover:bg-slate-100"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === p ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded-lg hover:bg-slate-100"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 详情抽屉 */}
      {selected && (
        <TeamDetailDrawer
          team={teams.find((t) => t.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}
