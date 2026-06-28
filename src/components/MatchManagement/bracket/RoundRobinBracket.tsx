import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ChevronUp, Users, Plus, CalendarClock } from 'lucide-react';
import type { MatchRound, MatchGame, GroupStanding } from '../../../data/mockData';
import { computeRoundRobinStandings } from '../../../data/mockData';
import type { TeamPoolItem } from '../TeamPool';
import MatchEditorModal from './MatchEditorModal';

interface RoundRobinBracketProps {
  rounds: MatchRound[];
  availableTeams: TeamPoolItem[];
  onUpdateGame: (roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => void;
  onAssignGroupSlot?: (roundIds: string[], slotName: string, team: TeamPoolItem) => void;
  onClearGroupSlot?: (roundIds: string[], slotName: string) => void;
  onAddExtraRound?: (stageId: string, groupIndex: number, teamA: string, teamB: string) => void;
  winPoints?: number;
  drawPoints?: number;
  lossPoints?: number;
  onTeamClick?: (teamName: string) => void;
}

export default function RoundRobinBracket({
  rounds,
  availableTeams,
  onUpdateGame,
  onAssignGroupSlot,
  onClearGroupSlot,
  onAddExtraRound,
  winPoints = 3,
  drawPoints = 1,
  lossPoints = 0,
  onTeamClick,
}: RoundRobinBracketProps) {
  const [editGame, setEditGame] = useState<{ round: MatchRound; game: MatchGame; forcedTeamA?: string; forcedTeamB?: string } | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, MatchRound[]>();
    rounds.forEach((r) => {
      const parts = r.roundName.split(' · ');
      const label = parts[1] || '默认组';
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(r);
    });
    return Array.from(map.entries()).map(([label, list]) => ({
      label,
      rounds: list.sort((a, b) => a.roundNumber - b.roundNumber),
      teams: Array.from(new Set(
        list.flatMap((r) => r.matches.flatMap((g) => [
          g.teamAIsPlaceholder ? null : g.teamA,
          g.teamBIsPlaceholder ? null : g.teamB,
        ])).filter((t): t is string => t !== null)
      )),
    }));
  }, [rounds]);

  return (
    <div className="space-y-8">
      {groups.map(({ label, rounds: groupRounds, teams }) => (
        <GroupSection
          key={label}
          label={label}
          groupRounds={groupRounds}
          teams={teams}
          availableTeams={availableTeams}
          onEdit={(round, game, forcedTeamA, forcedTeamB) => setEditGame({ round, game, forcedTeamA, forcedTeamB })}
          onUpdateGame={onUpdateGame}
          onAssignGroupSlot={onAssignGroupSlot}
          onClearGroupSlot={onClearGroupSlot}
          onAddExtraRound={onAddExtraRound}
          winPoints={winPoints}
          drawPoints={drawPoints}
          lossPoints={lossPoints}
          onTeamClick={onTeamClick}
        />
      ))}

      {editGame && (
        <MatchEditorModal
          round={editGame.round}
          game={editGame.game}
          availableTeams={availableTeams}
          forcedTeamA={editGame.forcedTeamA}
          forcedTeamB={editGame.forcedTeamB}
          onClose={() => setEditGame(null)}
          onSave={onUpdateGame}
        />
      )}
    </div>
  );
}

function GroupSection({
  label,
  groupRounds,
  teams,
  availableTeams,
  onEdit,
  onUpdateGame,
  onAssignGroupSlot,
  onClearGroupSlot,
  onAddExtraRound,
  winPoints,
  drawPoints,
  lossPoints,
  onTeamClick,
}: {
  label: string;
  groupRounds: MatchRound[];
  teams: string[];
  availableTeams: TeamPoolItem[];
  onEdit: (round: MatchRound, game: MatchGame, forcedTeamA?: string, forcedTeamB?: string) => void;
  onUpdateGame: (roundId: string, gameId: string, updates: Partial<MatchGame>) => void;
  onAssignGroupSlot?: (roundIds: string[], slotName: string, team: TeamPoolItem) => void;
  onClearGroupSlot?: (roundIds: string[], slotName: string) => void;
  onAddExtraRound?: (stageId: string, groupIndex: number, teamA: string, teamB: string) => void;
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
  onTeamClick?: (teamName: string) => void;
}) {
  const [showAssign, setShowAssign] = useState(true);
  const [showExtraDialog, setShowExtraDialog] = useState(false);
  const [extraTeamA, setExtraTeamA] = useState('');
  const [extraTeamB, setExtraTeamB] = useState('');

  const standings = useMemo(
    () => computeRoundRobinStandings(groupRounds, winPoints, drawPoints, lossPoints),
    [groupRounds, winPoints, drawPoints, lossPoints]
  );

  const findGame = (a: string, b: string) => {
    for (const r of groupRounds) {
      for (const g of r.matches) {
        if ((g.teamA === a && g.teamB === b) || (g.teamA === b && g.teamB === a)) return g;
      }
    }
    return null;
  };

  const findRoundForGame = (game: MatchGame) => groupRounds.find((r) => r.matches.includes(game));

  // Collect all unique slot codes (e.g. A1, B2) and their current assignment state.
  // Extra rounds use team names as slotA/slotB — exclude those to avoid phantom slot cards.
  const slots = useMemo(() => {
    const isSlotCode = (s: string) => /^[A-Z]\d+$/.test(s);
    const slotMap = new Map<string, string | null>(); // slotName -> assigned team name or null
    groupRounds.forEach((r) =>
      r.matches.forEach((g) => {
        if (g.slotA && isSlotCode(g.slotA)) {
          // Always overwrite: last non-placeholder value wins, placeholder → null
          const cur = slotMap.get(g.slotA);
          if (cur === undefined || (!g.teamAIsPlaceholder)) {
            slotMap.set(g.slotA, g.teamAIsPlaceholder ? null : g.teamA);
          }
        }
        if (g.slotB && isSlotCode(g.slotB)) {
          const cur = slotMap.get(g.slotB);
          if (cur === undefined || (!g.teamBIsPlaceholder)) {
            slotMap.set(g.slotB, g.teamBIsPlaceholder ? null : g.teamB);
          }
        }
      })
    );
    return Array.from(slotMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [groupRounds]);

  const roundIds = useMemo(() => groupRounds.map((r) => r.roundId), [groupRounds]);

  const hasSlots = slots.length > 0;
  const assignedCount = slots.filter(([, v]) => v !== null).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-slate-800">{label}</div>
        <div className="text-xs text-slate-400">积分规则：胜 {winPoints} / 平 {drawPoints} / 负 {lossPoints}</div>
      </div>

      {/* Group slot assignment panel */}
      {hasSlots && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowAssign((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Users size={12} className="text-primary" />
              队伍分配
              <span className="text-slate-400">
                ({assignedCount}/{slots.length} 已分配)
              </span>
            </div>
            {showAssign ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
          </button>

          {showAssign && (
            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
              {slots.map(([slotName, assignedTeam]) => (
                <SlotCard
                  key={slotName}
                  slotName={slotName}
                  assignedTeam={assignedTeam}
                  availableTeams={availableTeams}
                  onDrop={(team) => onAssignGroupSlot?.(roundIds, slotName, team)}
                  onClear={() => onClearGroupSlot?.(roundIds, slotName)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
        <StandingsTable standings={standings} onTeamClick={onTeamClick} />
        <MatrixTable teams={teams} findGame={findGame} findRoundForGame={findRoundForGame} onEdit={onEdit} />
      </div>

      <SchedulePanel groupRounds={groupRounds} onUpdateGame={onUpdateGame} onEdit={onEdit} />

      {onAddExtraRound && teams.length >= 2 && (
        <div className="flex justify-end">
          <button
            onClick={() => { setExtraTeamA(''); setExtraTeamB(''); setShowExtraDialog(true); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            <Plus size={12} />
            添加加赛
          </button>
        </div>
      )}

      {showExtraDialog && createPortal(
        <div className="fixed inset-0 z-[9990] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="text-sm font-medium text-slate-800">添加加赛</div>
              <button onClick={() => setShowExtraDialog(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">队伍 A</label>
                <select
                  value={extraTeamA}
                  onChange={(e) => setExtraTeamA(e.target.value)}
                  className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                >
                  <option value="">— 选择队伍 —</option>
                  {teams.filter((t) => t !== extraTeamB).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">队伍 B</label>
                <select
                  value={extraTeamB}
                  onChange={(e) => setExtraTeamB(e.target.value)}
                  className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                >
                  <option value="">— 选择队伍 —</option>
                  {teams.filter((t) => t !== extraTeamA).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setShowExtraDialog(false)}
                className="text-xs px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                disabled={!extraTeamA || !extraTeamB}
                onClick={() => {
                  const stageId = groupRounds[0]?.stageId ?? '';
                  const groupIndex = groupRounds[0]?.groupIndex ?? 0;
                  onAddExtraRound!(stageId, groupIndex, extraTeamA, extraTeamB);
                  setShowExtraDialog(false);
                }}
                className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                确认
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── 时间工具 ────────────────────────────────────────────────────────────────
function dtLocalToDisplay(v: string) { return v.replace('T', ' '); }
function displayToDtLocal(v: string) { return v.replace(' ', 'T').slice(0, 16); }
function addMins(display: string, mins: number): string {
  const d = new Date(display.replace(' ', 'T'));
  if (isNaN(d.getTime())) return display;
  d.setMinutes(d.getMinutes() + mins);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ─── 场次排期面板 ─────────────────────────────────────────────────────────────
function SchedulePanel({
  groupRounds,
  onUpdateGame,
  onEdit,
}: {
  groupRounds: MatchRound[];
  onUpdateGame: (roundId: string, gameId: string, updates: Partial<MatchGame>) => void;
  onEdit: (round: MatchRound, game: MatchGame) => void;
}) {
  const [open, setOpen] = useState(true);
  const [batchRoundId, setBatchRoundId] = useState<string | null>(null);
  const [batchStart, setBatchStart] = useState('');
  const [batchInterval, setBatchInterval] = useState(30);

  const allGames = useMemo(() =>
    groupRounds.flatMap((r) => r.matches.map((g) => ({ round: r, game: g }))),
    [groupRounds]
  );

  const statusLabel: Record<MatchGame['status'], string> = {
    scheduled: '未开始', live: '进行中', completed: '已结束', cancelled: '已取消',
  };
  const statusColor: Record<MatchGame['status'], string> = {
    scheduled: 'text-slate-400', live: 'text-blue-500', completed: 'text-emerald-600', cancelled: 'text-red-400',
  };

  const openBatch = (roundId: string) => {
    const firstTime = groupRounds.find(r => r.roundId === roundId)?.matches[0]?.startTime;
    setBatchStart(firstTime ? displayToDtLocal(firstTime) : '');
    setBatchRoundId(roundId);
  };

  const applyBatch = () => {
    if (!batchRoundId || !batchStart) return;
    const round = groupRounds.find(r => r.roundId === batchRoundId);
    if (!round) return;
    let t = dtLocalToDisplay(batchStart);
    round.matches.forEach((g) => {
      onUpdateGame(batchRoundId, g.gameId, { startTime: t });
      t = addMins(t, batchInterval);
    });
    setBatchRoundId(null);
  };

  if (allGames.length === 0) return null;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <CalendarClock size={13} className="text-primary" />
          场次排期
          <span className="text-slate-400 text-xs">({allGames.length} 场)</span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>

      {open && (
        <div className="divide-y divide-slate-100">
          {groupRounds.map((round) => (
            <div key={round.roundId} className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  {round.roundName.split(' · ').pop()}
                </span>
                {batchRoundId === round.roundId ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={batchStart}
                      onChange={(e) => setBatchStart(e.target.value)}
                      className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary"
                    />
                    <span className="text-xs text-slate-400">间隔</span>
                    <input
                      type="number"
                      min={0}
                      value={batchInterval}
                      onChange={(e) => setBatchInterval(Number(e.target.value))}
                      className="text-xs w-14 px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary text-center"
                    />
                    <span className="text-xs text-slate-400">分钟</span>
                    <button
                      onClick={applyBatch}
                      disabled={!batchStart}
                      className="text-xs px-2 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >应用</button>
                    <button onClick={() => setBatchRoundId(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openBatch(round.roundId)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors"
                  >
                    <CalendarClock size={12} />
                    批量设时
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {round.matches.map((game) => (
                  <button
                    key={game.gameId}
                    onClick={() => onEdit(round, game)}
                    className="w-full flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className={`shrink-0 ${statusColor[game.status]}`}>●</span>
                    <span className="flex-1 truncate font-medium text-slate-700">
                      {game.teamAIsPlaceholder ? '—' : game.teamA}
                      <span className="text-slate-400 mx-1">vs</span>
                      {game.teamBIsPlaceholder ? '—' : game.teamB}
                    </span>
                    {game.scoreA !== undefined && game.scoreB !== undefined && (
                      <span className="shrink-0 font-bold text-slate-600">{game.scoreA}:{game.scoreB}</span>
                    )}
                    <span className="shrink-0 text-slate-400">{game.startTime || '待排期'}</span>
                    <span className={`shrink-0 ${statusColor[game.status]}`}>{statusLabel[game.status]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SlotCard({
  slotName,
  assignedTeam,
  availableTeams,
  onDrop,
  onClear,
}: {
  slotName: string;
  assignedTeam: string | null;
  availableTeams: TeamPoolItem[];
  onDrop: (team: TeamPoolItem) => void;
  onClear: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPickerPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX, width: rect.width });
  }, [pickerOpen]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const team: TeamPoolItem = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop(team);
    } catch {
      // ignore bad drag data
    }
  };

  const handlePick = (team: TeamPoolItem) => {
    onDrop(team);
    setPickerOpen(false);
  };

  if (assignedTeam) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-lg min-w-0">
        <TeamBadge name={assignedTeam} size="xs" />
        <span className="text-xs font-medium text-blue-800 truncate flex-1" title={assignedTeam}>
          {assignedTeam}
        </span>
        <button
          onClick={onClear}
          className="shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
          title="移除"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        ref={triggerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => setPickerOpen((v) => !v)}
        className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 rounded-lg border border-dashed text-center transition-colors cursor-pointer min-h-[56px] ${
          isDragOver
            ? 'bg-primary/10 border-primary text-primary'
            : pickerOpen
              ? 'bg-primary/5 border-primary text-primary'
              : 'bg-slate-50 border-slate-300 text-slate-400 hover:border-primary hover:text-primary'
        }`}
      >
        <div className="text-xs font-bold">{slotName}</div>
        <div className="text-[10px]">{isDragOver ? '放开以分配' : '点击选择'}</div>
      </div>

      {pickerOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setPickerOpen(false)} />
          <div
            className="fixed z-[9999] bg-white border border-slate-200 rounded-lg shadow-xl min-w-[140px] max-h-48 overflow-y-auto"
            style={{ top: pickerPos.top, left: pickerPos.left, minWidth: Math.max(pickerPos.width, 140) }}
          >
            {availableTeams.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400">无可用队伍</div>
            ) : (
              availableTeams.map((t) => {
                const name = t.teamName || t.userNickname;
                return (
                  <button
                    key={t.userId}
                    onClick={() => handlePick(t)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <TeamBadge name={name} size="xs" />
                    <span className="truncate">{name}</span>
                  </button>
                );
              })
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

function StandingsTable({ standings, onTeamClick }: { standings: GroupStanding[]; onTeamClick?: (teamName: string) => void }) {
  const anyDraws = standings.some((s) => s.draws > 0);
  const gridCols = `1.5rem 1fr 1.75rem repeat(${anyDraws ? 5 : 4}, 1.75rem)`;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 border-b border-slate-200">小组排名</div>
      <div
        className="bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 border-b border-slate-200 grid gap-1"
        style={{ gridTemplateColumns: gridCols }}
      >
        <div className="text-center">#</div>
        <div>队伍</div>
        <div className="text-center">场次</div>
        <div className="text-center">胜</div>
        {anyDraws && <div className="text-center">平</div>}
        <div className="text-center">负</div>
        <div className="text-center">积分</div>
        <div className="text-center" title="得分:失分">得失</div>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {standings.length === 0 ? (
          <div className="p-4 text-xs text-slate-400 text-center">暂无比赛结果</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {standings.map((s, i) => (
              <div
                key={s.teamName}
                className={`px-3 py-2 grid gap-1 items-center ${rankRowBg(i, standings.length)}`}
                style={{ gridTemplateColumns: gridCols }}
              >
                <div className={`text-xs font-bold text-center ${rankTextColor(i)}`}>{i + 1}.</div>
                <div className="flex items-center gap-2 min-w-0">
                  <TeamBadge name={s.teamName} size="sm" />
                  <button
                    onClick={() => onTeamClick?.(s.teamName)}
                    className={`text-xs font-medium truncate ${rankTextColor(i)} ${onTeamClick ? 'hover:underline cursor-pointer' : 'cursor-default'}`}
                    title={s.teamName}
                  >
                    {s.teamName}
                  </button>
                </div>
                <div className="text-xs text-center text-slate-600">{s.played}</div>
                <div className="text-xs text-center font-medium text-emerald-600">{s.wins}</div>
                {anyDraws && <div className="text-xs text-center font-medium text-amber-600">{s.draws}</div>}
                <div className="text-xs text-center font-medium text-rose-600">{s.losses}</div>
                <div className="text-xs text-center font-bold text-slate-700">{s.points}</div>
                <div
                  className="text-xs text-center text-slate-600"
                  title={`得分 ${s.scoreFor} / 失分 ${s.scoreAgainst}`}
                >
                  {s.scoreFor}:{s.scoreAgainst}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatrixTable({
  teams,
  findGame,
  findRoundForGame,
  onEdit,
}: {
  teams: string[];
  findGame: (a: string, b: string) => MatchGame | null;
  findRoundForGame: (game: MatchGame) => MatchRound | undefined;
  onEdit: (round: MatchRound, game: MatchGame, forcedTeamA?: string, forcedTeamB?: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-collapse">
        <thead>
          <tr>
            <th className="p-2 bg-slate-50 border border-slate-200 sticky left-0 z-10">
              <div className="w-20"></div>
            </th>
            {teams.map((t) => (
              <th key={t} className="p-2 bg-slate-50 border border-slate-200 min-w-[80px]">
                <div className="flex flex-col items-center gap-1">
                  <TeamBadge name={t} size="xs" />
                  <span className="text-xs text-slate-500 truncate max-w-[64px]">{t}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((row) => (
            <tr key={row}>
              <td className="p-2 border border-slate-200 sticky left-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <TeamBadge name={row} size="xs" />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[90px]">{row}</span>
                </div>
              </td>
              {teams.map((col) => {
                if (row === col) {
                  return <td key={col} className="p-2 border border-slate-200 bg-slate-100"></td>;
                }
                const g = findGame(row, col);
                if (!g) return <td key={col} className="p-2 border border-slate-200"></td>;

                const completed = g.status === 'completed' && g.scoreA !== undefined && g.scoreB !== undefined;
                const rowIsA = g.teamA === row;
                const rowScore = rowIsA ? g.scoreA! : g.scoreB!;
                const colScore = rowIsA ? g.scoreB! : g.scoreA!;
                const won = completed && rowScore > colScore;
                const lost = completed && rowScore < colScore;
                const draw = completed && rowScore === colScore;

                return (
                  <td
                    key={col}
                    onClick={() => {
                      const round = findRoundForGame(g);
                      if (round) onEdit(round, g, row, col);
                    }}
                    className={`p-0 border border-slate-200 text-center cursor-pointer transition-colors ${
                      won
                        ? 'bg-emerald-100 hover:bg-emerald-200'
                        : lost
                          ? 'bg-rose-100 hover:bg-rose-200'
                          : draw
                            ? 'bg-amber-50 hover:bg-amber-100'
                            : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="py-2 px-1 min-w-[72px]">
                      {completed ? (
                        <>
                          <div className={`text-sm font-bold ${won ? 'text-emerald-800' : lost ? 'text-rose-800' : 'text-amber-700'}`}>
                            {rowScore}-{colScore}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(g.startTime)}</div>
                        </>
                      ) : (
                        <div className="text-xs font-medium text-slate-400">VS</div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamBadge({ name, size = 'sm' }: { name: string; size?: 'sm' | 'xs' }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const color = stringToColor(name);
  const dim = size === 'xs' ? 'w-6 h-6 text-[10px]' : 'w-7 h-7 text-xs';
  return (
    <div
      className={`${dim} rounded-md flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initial}
    </div>
  );
}

function rankRowBg(rank: number, total: number): string {
  if (rank === 0) return 'bg-blue-50/80';
  if (rank === 1) return 'bg-sky-50/80';
  if (rank === 2) return 'bg-emerald-50/80';
  if (rank === 3) return 'bg-emerald-50/60';
  if (rank <= 6) return 'bg-yellow-50/60';
  if (rank <= total - 4) return 'bg-orange-50/50';
  return 'bg-rose-50/60';
}

function rankTextColor(rank: number): string {
  if (rank === 0) return 'text-blue-700';
  if (rank === 1) return 'text-sky-700';
  if (rank === 2) return 'text-emerald-700';
  if (rank === 3) return 'text-emerald-700';
  return 'text-slate-700';
}

function formatDate(startTime: string): string {
  const m = startTime.match(/(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : '';
}

function stringToColor(str: string): string {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    '#14b8a6', '#d946ef', '#64748b', '#94a3b8', '#4f46e5',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
