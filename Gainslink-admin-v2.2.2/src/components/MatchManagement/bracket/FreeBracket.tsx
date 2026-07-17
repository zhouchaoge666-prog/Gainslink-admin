import { useState } from 'react';
import { Plus, Pencil, Trash2, Trophy, Clock } from 'lucide-react';
import type { MatchRound, MatchGame, TournamentStage } from '../../../data/mockData';
import type { TeamPoolItem } from '../TeamPool';
import MatchEditorModal from './MatchEditorModal';

interface FreeBracketProps {
  rounds: MatchRound[];
  stage: TournamentStage;
  availableTeams: TeamPoolItem[];
  onUpdateGame: (roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => void;
  onAddFreeGame: (stageId: string, teamA: string, teamB: string, format: string, roundName?: string) => void;
  onDeleteFreeRound: (roundId: string) => void;
  onTeamClick?: (teamName: string) => void;
}

const STATUS_STYLE: Record<string, string> = {
  scheduled: 'bg-slate-100 text-slate-500',
  inprogress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-500',
};
const STATUS_LABEL: Record<string, string> = {
  scheduled: '未开始',
  inprogress: '进行中',
  completed: '已结束',
  cancelled: '已取消',
};

function displayName(t: TeamPoolItem) {
  return t.teamName || t.userNickname;
}

// ── 新建比赛内联表单 ─────────────────────────────────────────────────────────
function CreateGameForm({
  stage,
  availableTeams,
  onConfirm,
  onCancel,
}: {
  stage: TournamentStage;
  availableTeams: TeamPoolItem[];
  onConfirm: (teamA: string, teamB: string, format: string, name: string) => void;
  onCancel: () => void;
}) {
  const defaultBo = `BO${stage.match.defaultBestOf}`;
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [format, setFormat] = useState(defaultBo);
  const [name, setName] = useState('');

  const canSubmit = teamA && teamB && teamA !== teamB;

  return (
    <div className="border border-primary/30 rounded-xl bg-blue-50/60 p-4 space-y-3">
      <div className="text-sm font-medium text-slate-700">新建比赛</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">左方队伍</label>
          <select
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-white"
          >
            <option value="">— 选择队伍 —</option>
            {availableTeams.filter((t) => displayName(t) !== teamB).map((t) => (
              <option key={t.userId} value={displayName(t)}>{displayName(t)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">右方队伍</label>
          <select
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-white"
          >
            <option value="">— 选择队伍 —</option>
            {availableTeams.filter((t) => displayName(t) !== teamA).map((t) => (
              <option key={t.userId} value={displayName(t)}>{displayName(t)}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">赛制</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-white"
          >
            {['BO1', 'BO2', 'BO3', 'BO5', 'BO7'].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">比赛名称（选填）</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={teamA && teamB ? `${teamA} vs ${teamB}` : '自动生成'}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-white placeholder:text-slate-300"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          disabled={!canSubmit}
          onClick={() => onConfirm(teamA, teamB, format, name)}
          className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors"
        >
          创建
        </button>
      </div>
    </div>
  );
}

// ── 比赛卡片 ─────────────────────────────────────────────────────────────────
function GameCard({
  round,
  game,
  availableTeams,
  onUpdate,
  onDelete,
  onTeamClick,
}: {
  round: MatchRound;
  game: MatchGame;
  availableTeams: TeamPoolItem[];
  onUpdate: (roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => void;
  onDelete: () => void;
  onTeamClick?: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  const teamAWin = game.winner === game.teamA;
  const teamBWin = game.winner === game.teamB;

  return (
    <>
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden hover:border-slate-300 transition-colors">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
          <span className="text-xs font-medium text-slate-600">{round.roundName}</span>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_STYLE[game.status] ?? STATUS_STYLE.scheduled}`}>
              {STATUS_LABEL[game.status] ?? game.status}
            </span>
            <span className="text-[10px] text-slate-400">{game.format}</span>
            <button
              onClick={() => setEditing(true)}
              className="text-slate-400 hover:text-primary transition-colors"
              title="编辑比赛"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={onDelete}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="删除比赛"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* 对阵区 */}
        <div className="flex items-center px-4 py-3 gap-3">
          {/* 队伍 A */}
          <div className={`flex-1 text-right ${teamAWin ? 'font-semibold text-emerald-700' : teamBWin ? 'text-slate-400' : 'text-slate-700'}`}>
            <button
              className="text-sm hover:underline"
              onClick={() => !game.teamAIsPlaceholder && onTeamClick?.(game.teamA)}
            >
              {game.teamAIsPlaceholder ? <span className="text-slate-300">{game.teamA}</span> : game.teamA}
            </button>
            {teamAWin && <Trophy size={11} className="inline ml-1 text-amber-500" />}
          </div>

          {/* 比分 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-lg font-bold tabular-nums min-w-[1.5rem] text-center ${teamAWin ? 'text-emerald-600' : 'text-slate-600'}`}>
              {game.scoreA ?? '—'}
            </span>
            <span className="text-slate-300 text-sm">:</span>
            <span className={`text-lg font-bold tabular-nums min-w-[1.5rem] text-center ${teamBWin ? 'text-emerald-600' : 'text-slate-600'}`}>
              {game.scoreB ?? '—'}
            </span>
          </div>

          {/* 队伍 B */}
          <div className={`flex-1 text-left ${teamBWin ? 'font-semibold text-emerald-700' : teamAWin ? 'text-slate-400' : 'text-slate-700'}`}>
            {teamBWin && <Trophy size={11} className="inline mr-1 text-amber-500" />}
            <button
              className="text-sm hover:underline"
              onClick={() => !game.teamBIsPlaceholder && onTeamClick?.(game.teamB)}
            >
              {game.teamBIsPlaceholder ? <span className="text-slate-300">{game.teamB}</span> : game.teamB}
            </button>
          </div>
        </div>

        {/* 时间行 */}
        {game.startTime && (
          <div className="flex items-center gap-1 px-4 pb-2.5 text-[10px] text-slate-400">
            <Clock size={10} />
            {game.startTime}
          </div>
        )}
      </div>

      {editing && (
        <MatchEditorModal
          round={round}
          game={game}
          availableTeams={availableTeams}
          onClose={() => setEditing(false)}
          onSave={(roundId, gameId, updates, winner) => {
            onUpdate(roundId, gameId, updates, winner);
            setEditing(false);
          }}
        />
      )}
    </>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function FreeBracket({
  rounds,
  stage,
  availableTeams,
  onUpdateGame,
  onAddFreeGame,
  onDeleteFreeRound,
  onTeamClick,
}: FreeBracketProps) {
  const [creating, setCreating] = useState(false);

  const handleCreate = (teamA: string, teamB: string, format: string, name: string) => {
    onAddFreeGame(stage.stageId, teamA, teamB, format, name || undefined);
    setCreating(false);
  };

  return (
    <div className="space-y-3">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          共 <span className="font-medium text-slate-700">{rounds.length}</span> 场比赛
        </span>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={13} />
            新建比赛
          </button>
        )}
      </div>

      {/* 新建表单 */}
      {creating && (
        <CreateGameForm
          stage={stage}
          availableTeams={availableTeams}
          onConfirm={handleCreate}
          onCancel={() => setCreating(false)}
        />
      )}

      {/* 比赛列表 */}
      {rounds.length === 0 && !creating ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          暂无比赛，点击「新建比赛」添加对阵
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {rounds.map((round) => {
            const game = round.matches[0];
            if (!game) return null;
            return (
              <GameCard
                key={round.roundId}
                round={round}
                game={game}
                availableTeams={availableTeams}
                onUpdate={onUpdateGame}
                onDelete={() => onDeleteFreeRound(round.roundId)}
                onTeamClick={onTeamClick}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
