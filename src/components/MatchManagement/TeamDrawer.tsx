import { X, Users, Trophy, MapPin, CalendarDays, Crown } from 'lucide-react';
import { teamListData } from '../../data/mockData';
import type { TeamItem } from '../../data/mockData';

interface TeamDrawerProps {
  teamName: string;
  onClose: () => void;
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

// ── 状态 Badge ────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TeamItem['status'] }) {
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

// ── 战队 Logo ─────────────────────────────────────────────────────────────────
function TeamLogo({ name, size = 40 }: { name: string; size?: number }) {
  const colors = [
    'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700', 'bg-indigo-100 text-indigo-700',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`rounded-lg flex items-center justify-center font-bold ${colors[idx]}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ── 无数据占位 ────────────────────────────────────────────────────────────────
function NoDataPanel({ teamName, onClose }: { teamName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative ml-auto h-full w-[440px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <TeamLogo name={teamName} size={40} />
            <div className="font-semibold text-slate-800">{teamName}</div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          该战队尚无系统档案记录
        </div>
      </div>
    </div>
  );
}

// ── 主抽屉 ────────────────────────────────────────────────────────────────────
export default function TeamDrawer({ teamName, onClose }: TeamDrawerProps) {
  const team = teamListData.find((t) => t.name === teamName) ?? null;

  if (!team) return <NoDataPanel teamName={teamName} onClose={onClose} />;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative ml-auto h-full w-[440px] bg-white shadow-2xl flex flex-col">

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
          </div>

          {/* 成员列表 */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              成员列表
            </div>
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

          {/* 近期参赛记录 */}
          <div className="px-5 py-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              近期参赛记录
            </div>
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
      </div>
    </div>
  );
}
