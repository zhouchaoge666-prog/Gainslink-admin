import { X, Crown, Users, Clock, Trophy, MapPin, Calendar } from 'lucide-react';
import { getTeamByName } from '../../data/mockData';

interface TeamDrawerProps {
  teamName: string;
  onClose: () => void;
}

const roleBadge: Record<string, { label: string; cls: string }> = {
  captain:    { label: '队长', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  member:     { label: '成员', cls: 'bg-slate-50 text-slate-600 border border-slate-200' },
  substitute: { label: '候补', cls: 'bg-blue-50 text-blue-600 border border-blue-200' },
};

const resultBadge: Record<string, { label: string; cls: string }> = {
  '晋级':  { label: '晋级', cls: 'bg-emerald-50 text-emerald-700' },
  '淘汰':  { label: '淘汰', cls: 'bg-slate-100 text-slate-500' },
  '进行中':{ label: '进行中', cls: 'bg-blue-50 text-blue-600' },
};

const actionColor: Record<string, string> = {
  '加入战队':    'text-emerald-600',
  '离开战队':    'text-red-500',
  '变更队长':    'text-amber-600',
  '战队名称变更':'text-violet-600',
  '参赛报名':    'text-primary',
  '资格取消':    'text-red-500',
};

function stringToColor(str: string): string {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function TeamDrawer({ teamName, onClose }: TeamDrawerProps) {
  const team = getTeamByName(teamName);

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-500" />
            <span className="font-medium text-slate-800">战队详情</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!team ? (
            /* ── 无 mock 数据时的占位面板 ── */
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ backgroundColor: stringToColor(teamName) }}
                >
                  {teamName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">{teamName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">暂无详细信息</div>
                </div>
              </div>
              <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
                该战队尚无系统档案记录
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* ── 基本信息 ── */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ backgroundColor: stringToColor(team.teamName) }}
                >
                  {team.teamName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-slate-800 truncate">{team.teamName}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Crown size={11} className="text-amber-500" />
                      {team.captainNickname}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {team.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {team.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── 成员列表 ── */}
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={13} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">成员 ({team.members.length})</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {team.members.map((m, i) => {
                    const badge = roleBadge[m.role];
                    return (
                      <div
                        key={m.userId}
                        className={`flex items-center gap-3 px-3 py-2.5 ${i < team.members.length - 1 ? 'border-b border-slate-100' : ''}`}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: stringToColor(m.nickname) }}
                        >
                          {m.nickname.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{m.nickname}</div>
                          <div className="text-xs text-slate-400">{m.userId}</div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge.cls}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-slate-400">{m.joinedAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── 参赛历史 ── */}
              {team.matchHistory.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={13} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">参赛历史</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    {team.matchHistory.map((h, i) => {
                      const rb = resultBadge[h.result] ?? { label: h.result, cls: 'bg-slate-100 text-slate-500' };
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 px-3 py-2.5 ${i < team.matchHistory.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-slate-700 truncate">{h.matchName}</div>
                            <div className="text-xs text-slate-400">{h.stage}</div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rb.cls}`}>{rb.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── 变更记录 ── */}
              {team.changeLog.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={13} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">变更记录</span>
                  </div>
                  <div className="space-y-0 relative">
                    {/* 竖线 */}
                    <div className="absolute left-[19px] top-3 bottom-3 w-px bg-slate-200" />
                    {team.changeLog.map((log) => {
                      const dotColor = actionColor[log.action] ?? 'text-slate-400';
                      return (
                        <div key={log.id} className="flex gap-3 pb-3 relative">
                          <div className={`w-10 h-10 shrink-0 flex items-center justify-center`}>
                            <div className={`w-2 h-2 rounded-full bg-current ${dotColor} mt-1`} />
                          </div>
                          <div className="flex-1 pt-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-semibold ${dotColor}`}>{log.action}</span>
                              <span className="text-xs text-slate-700 font-medium">{log.target}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {log.date} · 由 {log.operator} 操作
                            </div>
                            {log.remark && (
                              <div className="text-xs text-slate-500 bg-slate-50 rounded px-2 py-1 mt-1">{log.remark}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
