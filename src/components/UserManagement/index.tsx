import { useState, useMemo } from 'react';
import {
  Search, Users, UserCheck, UserX, TrendingUp,
  ChevronLeft, ChevronRight, Shield, Ban, Crown,
} from 'lucide-react';
import { userListData } from '../../data/mockData';
import type { UserItem, UserRole, UserStatus } from '../../data/mockData';
import UserDetailDrawer from './UserDetailDrawer';

// ── KPI ────────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800">{value.toLocaleString()}</div>
        <div className="text-xs text-slate-500">{label}</div>
        {sub && <div className="text-xs text-emerald-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── 角色 badge ───────────────────────────────────────────────────────────────
const roleConfig: Record<UserRole, { label: string; cls: string; icon: React.ReactNode }> = {
  admin:     { label: '管理员', cls: 'bg-purple-50 text-purple-700', icon: <Crown size={10} /> },
  organizer: { label: '组织方', cls: 'bg-blue-50 text-blue-700',   icon: <Shield size={10} /> },
  player:    { label: '玩家',   cls: 'bg-slate-100 text-slate-600', icon: null },
};

function RoleBadge({ role }: { role: UserRole }) {
  const c = roleConfig[role];
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${c.cls}`}>
      {c.icon}{c.label}
    </span>
  );
}

// ── 状态 badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: UserStatus }) {
  return status === 'active' ? (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />正常
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
      <Ban size={10} />封禁
    </span>
  );
}

// ── 国家 flag emoji ──────────────────────────────────────────────────────────
const countryFlag: Record<string, string> = {
  '菲律宾': '🇵🇭', '印尼': '🇮🇩', '中国': '🇨🇳', '越南': '🇻🇳',
  '马来西亚': '🇲🇾', '新加坡': '🇸🇬', '泰国': '🇹🇭',
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const ALL_COUNTRIES = ['菲律宾', '印尼', '中国', '越南', '马来西亚', '新加坡', '泰国'];

// ── 主组件 ──────────────────────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>(userListData);

  // 筛选状态
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | UserStatus>('all');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'organic' | 'invite'>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'regTime' | 'points' | 'matchCount'>('regTime');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  // 分页
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 批量
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // 详情抽屉
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);

  // ── 筛选 + 排序 ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => {
        if (q && !u.nickname.toLowerCase().includes(q) && !u.id.toLowerCase().includes(q)
          && !u.email.toLowerCase().includes(q) && !(u.phone ?? '').includes(q)) return false;
        if (filterStatus !== 'all' && u.status !== filterStatus) return false;
        if (filterRole !== 'all' && u.role !== filterRole) return false;
        if (filterSource !== 'all' && u.source !== filterSource) return false;
        if (filterCountry !== 'all' && u.country !== filterCountry) return false;
        return true;
      })
      .sort((a, b) => {
        let va: number | string = 0, vb: number | string = 0;
        if (sortBy === 'regTime') { va = a.regTime; vb = b.regTime; }
        else if (sortBy === 'points') { va = a.points; vb = b.points; }
        else if (sortBy === 'matchCount') { va = a.matchCount; vb = b.matchCount; }
        if (va < vb) return sortDir === 'desc' ? 1 : -1;
        if (va > vb) return sortDir === 'desc' ? -1 : 1;
        return 0;
      });
  }, [users, search, filterStatus, filterRole, filterSource, filterCountry, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // KPI
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const bannedUsers = users.filter((u) => u.status === 'banned').length;
  const thisMonth = '2026-06';
  const newThisMonth = users.filter((u) => u.regTime.startsWith(thisMonth)).length;

  // ── 操作：封禁 / 解封 ───────────────────────────────────────────────────
  const handleToggleBan = (userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        if (u.status === 'active') {
          return {
            ...u, status: 'banned' as UserStatus,
            banReason: reason || '管理员操作',
            banTime: new Date().toISOString().slice(0, 10),
            adminLog: [...u.adminLog, {
              id: `AL-${Date.now()}`, action: 'ban' as const,
              operator: 'Admin', reason: reason || '管理员操作',
              time: new Date().toLocaleString('zh-CN'),
            }],
          };
        } else {
          return {
            ...u, status: 'active' as UserStatus,
            banReason: undefined, banTime: undefined,
            adminLog: [...u.adminLog, {
              id: `AL-${Date.now()}`, action: 'unban' as const,
              operator: 'Admin', reason: '解除封禁',
              time: new Date().toLocaleString('zh-CN'),
            }],
          };
        }
      })
    );
  };

  // ── 操作：积分调整 ──────────────────────────────────────────────────────
  const handleAdjustPoints = (userId: string, delta: number, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newBalance = Math.max(0, u.points + delta);
        const newLog = {
          id: `PL-${Date.now()}`,
          type: (delta >= 0 ? 'earn' : 'deduct') as 'earn' | 'deduct',
          amount: Math.abs(delta),
          event: 'admin_adjust' as const,
          eventLabel: '管理员调整',
          reason,
          time: new Date().toLocaleString('zh-CN'),
          balance: newBalance,
        };
        return {
          ...u, points: newBalance,
          pointsLog: [newLog, ...u.pointsLog],
          adminLog: [...u.adminLog, {
            id: `AL-${Date.now()}`, action: 'adjust_points' as const,
            operator: 'Admin', reason: `${delta >= 0 ? '+' : ''}${delta} 积分 — ${reason}`,
            time: new Date().toLocaleString('zh-CN'),
          }],
        };
      })
    );
  };

  // ── 操作：修改角色 ──────────────────────────────────────────────────────
  const handleChangeRole = (userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return {
          ...u, role,
          adminLog: [...u.adminLog, {
            id: `AL-${Date.now()}`, action: 'change_role' as const,
            operator: 'Admin', reason: `角色变更为「${roleConfig[role].label}」`,
            time: new Date().toLocaleString('zh-CN'),
          }],
        };
      })
    );
  };

  // 批量封禁
  const handleBatchBan = () => {
    selected.forEach((id) => {
      const u = users.find((x) => x.id === id);
      if (u && u.status === 'active') handleToggleBan(id, '批量封禁');
    });
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allChecked = paginated.length > 0 && paginated.every((u) => selected.has(u.id));
  const toggleAll = () => {
    if (allChecked) {
      setSelected((prev) => { const n = new Set(prev); paginated.forEach((u) => n.delete(u.id)); return n; });
    } else {
      setSelected((prev) => { const n = new Set(prev); paginated.forEach((u) => n.add(u.id)); return n; });
    }
  };

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortBy(col); setSortDir('desc'); }
    setPage(1);
  };

  const drawerUser = drawerUserId ? users.find((u) => u.id === drawerUserId) ?? null : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-bg">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* KPI */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard icon={<Users size={18} className="text-primary" />} label="注册用户总数" value={totalUsers} color="bg-primary/10" />
          <KpiCard icon={<TrendingUp size={18} className="text-emerald-600" />} label="本月新增" value={newThisMonth} sub="较上月 ↑" color="bg-emerald-50" />
          <KpiCard icon={<UserCheck size={18} className="text-blue-600" />} label="正常用户" value={activeUsers} color="bg-blue-50" />
          <KpiCard icon={<UserX size={18} className="text-red-500" />} label="封禁用户" value={bannedUsers} color="bg-red-50" />
        </div>

        {/* 搜索 + 筛选 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="搜索用户名、邮箱、手机号、ID…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* 快速筛选条 */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 状态 */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 mr-1">状态</span>
              {(['all', 'active', 'banned'] as const).map((v) => (
                <button key={v} onClick={() => { setFilterStatus(v); setPage(1); }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filterStatus === v ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:border-primary/50'}`}>
                  {v === 'all' ? '全部' : v === 'active' ? '正常' : '封禁'}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-slate-200" />

            {/* 角色 */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 mr-1">角色</span>
              {(['all', 'player', 'organizer', 'admin'] as const).map((v) => (
                <button key={v} onClick={() => { setFilterRole(v); setPage(1); }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filterRole === v ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:border-primary/50'}`}>
                  {v === 'all' ? '全部' : roleConfig[v].label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-slate-200" />

            {/* 来源 */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 mr-1">来源</span>
              {(['all', 'invite', 'organic'] as const).map((v) => (
                <button key={v} onClick={() => { setFilterSource(v); setPage(1); }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filterSource === v ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:border-primary/50'}`}>
                  {v === 'all' ? '全部' : v === 'invite' ? '邀请' : '自然'}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-slate-200" />

            {/* 国家 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">国家</span>
              <select value={filterCountry} onChange={(e) => { setFilterCountry(e.target.value); setPage(1); }}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">全部</option>
                {ALL_COUNTRIES.map((c) => <option key={c} value={c}>{countryFlag[c] ?? ''} {c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 批量操作 */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
            <span className="text-sm text-primary font-medium">已选 {selected.size} 人</span>
            <button onClick={handleBatchBan}
              className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              批量封禁
            </button>
            <button onClick={() => setSelected(new Set())}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              取消选择
            </button>
          </div>
        )}

        {/* 表格 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-xs">
                  <th className="text-left px-4 py-3 w-8">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll}
                      className="rounded border-slate-300 text-primary focus:ring-primary/30" />
                  </th>
                  <th className="text-left px-4 py-3">用户</th>
                  <th className="text-left px-4 py-3">邮箱</th>
                  <th className="text-left px-4 py-3">角色</th>
                  <th className="text-left px-4 py-3">国家</th>
                  <th className="text-left px-4 py-3 cursor-pointer select-none hover:text-slate-800" onClick={() => handleSort('points')}>
                    积分 {sortBy === 'points' ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer select-none hover:text-slate-800" onClick={() => handleSort('matchCount')}>
                    参赛 {sortBy === 'matchCount' ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer select-none hover:text-slate-800" onClick={() => handleSort('regTime')}>
                    注册时间 {sortBy === 'regTime' ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
                  </th>
                  <th className="text-left px-4 py-3">状态</th>
                  <th className="text-left px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-slate-400 text-sm">暂无用户数据</td>
                  </tr>
                ) : paginated.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)}
                        className="rounded border-slate-300 text-primary focus:ring-primary/30" />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDrawerUserId(u.id)}
                        className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.nickname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 text-sm">{u.nickname}</div>
                          <div className="text-xs text-slate-400">{u.id}</div>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {countryFlag[u.country] ?? ''} {u.country}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{u.points.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">{u.matchCount}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{u.regTime}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setDrawerUserId(u.id)}
                          className="text-xs text-primary hover:underline">详情</button>
                        <span className="text-slate-200">|</span>
                        <button onClick={() => handleToggleBan(u.id)}
                          className={`text-xs hover:underline ${u.status === 'active' ? 'text-red-500' : 'text-emerald-600'}`}>
                          {u.status === 'active' ? '封禁' : '解封'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>共 {filtered.length} 条</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border border-slate-200 rounded-md px-1.5 py-0.5 text-xs focus:outline-none">
                {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>每页 {n} 条</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-xs">…</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p as number)}
                      className={`w-7 h-7 rounded-md text-xs transition-colors ${page === p ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                      {p}
                    </button>
                  )
                )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 详情抽屉 */}
      {drawerUser && (
        <UserDetailDrawer
          user={drawerUser}
          onClose={() => setDrawerUserId(null)}
          onToggleBan={handleToggleBan}
          onAdjustPoints={handleAdjustPoints}
          onChangeRole={handleChangeRole}
        />
      )}
    </div>
  );
}
