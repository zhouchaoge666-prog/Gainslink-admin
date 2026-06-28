import { useState, useMemo } from 'react';
import { X, CalendarClock, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import type { MatchRound, MatchGame } from '../../../data/mockData';
import type { TeamPoolItem } from '../TeamPool';
import MatchEditorModal from './MatchEditorModal';

interface EliminationBracketProps {
  rounds: MatchRound[];
  availableTeams: TeamPoolItem[];
  onUpdateGame: (roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => void;
  onAssignTeam: (roundId: string, gameId: string, side: 'A' | 'B', team: TeamPoolItem) => void;
  onClearSlot?: (roundId: string, gameId: string, side: 'A' | 'B') => void;
  variant?: 'single' | 'double';
  onTeamClick?: (teamName: string) => void;
}

const CARD_W = 188;
const CARD_H = 82;  // 32+1+32+1+16 = team A + divider + team B + divider + time row
const COL_GAP = 56;
// ROW_GAP = 28 (reserved for future use)

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

export default function EliminationBracket({
  rounds,
  availableTeams,
  onUpdateGame,
  onAssignTeam,
  onClearSlot,
  variant = 'single',
  onTeamClick,
}: EliminationBracketProps) {
  const [editGame, setEditGame] = useState<{ round: MatchRound; game: MatchGame } | null>(null);

  const handleDrop = (e: React.DragEvent, round: MatchRound, game: MatchGame, side: 'A' | 'B') => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    try {
      const team: TeamPoolItem = JSON.parse(raw);
      onAssignTeam(round.roundId, game.gameId, side, team);
    } catch { /* ignore */ }
  };

  const handleAssign = (round: MatchRound, game: MatchGame, side: 'A' | 'B', team: TeamPoolItem) => {
    onAssignTeam(round.roundId, game.gameId, side, team);
  };

  const handleClear = (round: MatchRound, game: MatchGame, side: 'A' | 'B') => {
    onClearSlot?.(round.roundId, game.gameId, side);
  };

  const handleEdit = (round: MatchRound, game: MatchGame) => {
    const isByeGame = game.slotA === 'BYE' || game.slotB === 'BYE';
    if (!isByeGame && (!game.teamAIsPlaceholder || !game.teamBIsPlaceholder)) {
      setEditGame({ round, game });
    }
  };

  const { upper, lower, final } = useMemo(() => {
    if (variant !== 'double') return { upper: rounds, lower: [], final: [] };
    const upper: MatchRound[] = [];
    const lower: MatchRound[] = [];
    const finalRounds: MatchRound[] = [];
    [...rounds].sort((a, b) => a.roundNumber - b.roundNumber).forEach((r) => {
      const name = r.roundName;
      if (/grand\s*final|总决赛|决赛$/i.test(name) && !/胜者|败者|upper|lower|ub|lb/i.test(name)) {
        finalRounds.push(r);
      } else if (/败者|lower|lb|loser/i.test(name)) {
        lower.push(r);
      } else {
        upper.push(r);
      }
    });
    return { upper, lower, final: finalRounds };
  }, [rounds, variant]);

  const finalGame = final[0]?.matches[0];

  return (
    <div className="space-y-4">
      {/* 场次排期面板（置顶，默认展开） */}
      <StageSchedulePanel
        rounds={rounds}
        onUpdateGame={onUpdateGame}
        onEdit={handleEdit}
        defaultOpen
      />

      {variant === 'double' ? (
        <>
          {upper.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-700">胜者组 Upper Bracket</div>
              <BracketTree rounds={upper} availableTeams={availableTeams} onDrop={handleDrop} onAssign={handleAssign} onClear={handleClear} onEdit={handleEdit} onTeamClick={onTeamClick} />
            </section>
          )}
          {lower.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-slate-700">败者组 Lower Bracket</div>
                <span className="text-[10px] text-slate-400 font-normal">· 可拖拽队伍调整对阵顺序</span>
              </div>
              <BracketTree rounds={lower} availableTeams={availableTeams} onDrop={handleDrop} onAssign={handleAssign} onClear={handleClear} onEdit={handleEdit} onTeamClick={onTeamClick} />
            </section>
          )}
          {final.length > 0 && finalGame && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-700">总决赛 Grand Final</div>
              <div className="flex flex-wrap justify-center gap-8 py-2">
                {final.map((r) => (
                  <div key={r.roundId} className="flex flex-col items-center gap-2">
                    {r.isResetRound && (
                      <div className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-0.5">
                        重制局（LB 冠军赢第一场后启用）
                      </div>
                    )}
                    <MatchCard round={r} game={r.matches[0]} availableTeams={availableTeams} onDrop={handleDrop} onAssign={handleAssign} onClear={handleClear} onEdit={handleEdit} onTeamClick={onTeamClick} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <BracketTree rounds={[...rounds].sort((a, b) => a.roundNumber - b.roundNumber)} availableTeams={availableTeams} onDrop={handleDrop} onAssign={handleAssign} onClear={handleClear} onEdit={handleEdit} onTeamClick={onTeamClick} />
      )}

      {editGame && (
        <MatchEditorModal
          round={editGame.round}
          game={editGame.game}
          availableTeams={availableTeams}
          onClose={() => setEditGame(null)}
          onSave={onUpdateGame}
        />
      )}
    </div>
  );
}

// ─── 场次排期面板（淘汰赛/双败） ──────────────────────────────────────────────
function StageSchedulePanel({
  rounds,
  onUpdateGame,
  onEdit,
  defaultOpen = false,
}: {
  rounds: MatchRound[];
  onUpdateGame: (roundId: string, gameId: string, updates: Partial<MatchGame>) => void;
  onEdit: (round: MatchRound, game: MatchGame) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [batchRoundId, setBatchRoundId] = useState<string | null>(null);
  const [batchStart, setBatchStart] = useState('');
  const [batchInterval, setBatchInterval] = useState(30);

  const sorted = useMemo(() => [...rounds].sort((a, b) => a.roundNumber - b.roundNumber), [rounds]);

  // 过滤掉纯 BYE 场，只保留有实际队伍的场次
  const visibleRounds = useMemo(() =>
    sorted.map((r) => ({
      ...r,
      matches: r.matches.filter((g) => g.slotA !== 'BYE' && g.slotB !== 'BYE'),
    })).filter((r) => r.matches.length > 0),
    [sorted]
  );

  if (visibleRounds.length === 0) return null;

  const totalGames = visibleRounds.reduce((n, r) => n + r.matches.length, 0);

  const statusLabel: Record<MatchGame['status'], string> = {
    scheduled: '未开始', live: '进行中', completed: '已结束', cancelled: '已取消',
  };
  const statusColor: Record<MatchGame['status'], string> = {
    scheduled: 'text-slate-400', live: 'text-blue-500', completed: 'text-emerald-600', cancelled: 'text-red-400',
  };

  const openBatch = (roundId: string) => {
    const firstTime = visibleRounds.find(r => r.roundId === roundId)?.matches[0]?.startTime;
    setBatchStart(firstTime ? displayToDtLocal(firstTime) : '');
    setBatchRoundId(roundId);
  };

  const applyBatch = () => {
    if (!batchRoundId || !batchStart) return;
    const round = visibleRounds.find(r => r.roundId === batchRoundId);
    if (!round) return;
    let t = dtLocalToDisplay(batchStart);
    round.matches.forEach((g) => {
      onUpdateGame(batchRoundId, g.gameId, { startTime: t });
      t = addMins(t, batchInterval);
    });
    setBatchRoundId(null);
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <CalendarClock size={13} className="text-primary" />
          场次排期
          <span className="text-slate-400 text-xs">({totalGames} 场)</span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>

      {open && (
        <div className="divide-y divide-slate-100">
          {visibleRounds.map((round) => (
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
                    onClick={() => {
                      const origRound = rounds.find(r => r.roundId === round.roundId);
                      if (origRound) onEdit(origRound, game);
                    }}
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

// ─── 对阵树 ──────────────────────────────────────────────────────────────────
function BracketTree({
  rounds,
  availableTeams,
  onDrop,
  onAssign,
  onClear,
  onEdit,
  onTeamClick,
}: {
  rounds: MatchRound[];
  availableTeams: TeamPoolItem[];
  onDrop: (e: React.DragEvent, round: MatchRound, game: MatchGame, side: 'A' | 'B') => void;
  onAssign: (round: MatchRound, game: MatchGame, side: 'A' | 'B', team: TeamPoolItem) => void;
  onClear: (round: MatchRound, game: MatchGame, side: 'A' | 'B') => void;
  onEdit: (round: MatchRound, game: MatchGame) => void;
  onTeamClick?: (teamName: string) => void;
}) {
  const sorted = [...rounds].sort((a, b) => a.roundNumber - b.roundNumber);
  const maxMatches = Math.max(...sorted.map((r) => r.matches.length), 1);
  const containerHeight = Math.max(CARD_H, maxMatches * CARD_H + (maxMatches - 1) * 28);
  const totalWidth = sorted.length * CARD_W + (sorted.length - 1) * COL_GAP;

  if (sorted.length === 0) return null;

  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="relative" style={{ minWidth: totalWidth, height: containerHeight + 32 }}>
        {/* Column headers */}
        {sorted.map((round, ri) => (
          <div
            key={`hdr-${round.roundId}`}
            className="absolute top-0 text-xs font-bold text-slate-400 text-center uppercase tracking-wider truncate px-1"
            style={{ left: ri * (CARD_W + COL_GAP), width: CARD_W }}
          >
            {round.roundName.split(' · ').pop()}
          </div>
        ))}

        {/* Connector lines */}
        <svg className="absolute top-6 left-0 pointer-events-none" width={totalWidth} height={containerHeight}>
          {sorted.map((round, ri) => {
            if (ri === sorted.length - 1) return null;
            const nextRound = sorted[ri + 1];
            const x1 = ri * (CARD_W + COL_GAP) + CARD_W;
            const x2 = (ri + 1) * (CARD_W + COL_GAP);
            const cx = (x1 + x2) / 2;
            const stepCurrent = round.matches.length <= 1 ? 0 : containerHeight / round.matches.length;
            const stepNext = nextRound.matches.length <= 1 ? 0 : containerHeight / nextRound.matches.length;

            return round.matches.map((game, gi) => {
              const y1 = round.matches.length === 1
                ? containerHeight / 2
                : gi * stepCurrent + stepCurrent / 2;
              // 1:1 rounds (LB same-count): each game connects to the same index
              // 2:1 rounds (halving): two games converge to one
              const ni = nextRound.matches.length === round.matches.length
                ? gi
                : Math.floor(gi / 2);
              const y2 = nextRound.matches.length === 1
                ? containerHeight / 2
                : ni * stepNext + stepNext / 2;
              const hasWinner = game.status === 'completed' && game.winner;
              return (
                <path
                  key={`${round.roundId}-${game.gameId}`}
                  d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
                  fill="none"
                  stroke={hasWinner ? '#10b981' : '#e2e8f0'}
                  strokeWidth={hasWinner ? 2 : 1.5}
                />
              );
            });
          })}
        </svg>

        {/* Match cards */}
        {sorted.map((round, ri) => {
          const step = round.matches.length <= 1 ? 0 : containerHeight / round.matches.length;
          return round.matches.map((game, gi) => {
            const top = 24 + (round.matches.length === 1
              ? containerHeight / 2 - CARD_H / 2
              : gi * step + step / 2 - CARD_H / 2);
            return (
              <div
                key={`${round.roundId}-${game.gameId}`}
                className="absolute"
                style={{ left: ri * (CARD_W + COL_GAP), top, width: CARD_W }}
              >
                <MatchCard
                  round={round}
                  game={game}
                  availableTeams={availableTeams}
                  onDrop={onDrop}
                  onAssign={onAssign}
                  onClear={onClear}
                  onEdit={onEdit}
                  onTeamClick={onTeamClick}
                />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}

// ─── 比赛卡片 ────────────────────────────────────────────────────────────────
function MatchCard({
  round,
  game,
  availableTeams,
  onDrop,
  onAssign,
  onClear,
  onEdit,
  onTeamClick,
}: {
  round: MatchRound;
  game: MatchGame;
  availableTeams: TeamPoolItem[];
  onDrop: (e: React.DragEvent, round: MatchRound, game: MatchGame, side: 'A' | 'B') => void;
  onAssign: (round: MatchRound, game: MatchGame, side: 'A' | 'B', team: TeamPoolItem) => void;
  onClear: (round: MatchRound, game: MatchGame, side: 'A' | 'B') => void;
  onEdit: (round: MatchRound, game: MatchGame) => void;
  onTeamClick?: (teamName: string) => void;
}) {
  // BYE 场次：一方是轮空槽，不显示比分，不可编辑
  const isByeGame = game.slotA === 'BYE' || game.slotB === 'BYE';
  const completed = !isByeGame && game.status === 'completed' && game.scoreA !== undefined && game.scoreB !== undefined;
  const aWon = completed && game.scoreA! > game.scoreB!;
  const bWon = completed && game.scoreB! > game.scoreA!;
  const bothPlaceholder = game.teamAIsPlaceholder && game.teamBIsPlaceholder;

  return (
    <div
      onClick={() => !bothPlaceholder && !isByeGame && onEdit(round, game)}
      className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-colors ${
        isByeGame
          ? 'border-slate-100 opacity-60 cursor-default'
          : completed
            ? 'border-emerald-300 cursor-pointer'
            : bothPlaceholder
              ? 'border-slate-200 cursor-default'
              : 'border-slate-200 hover:border-primary cursor-pointer'
      }`}
      style={{ width: CARD_W, height: CARD_H }}
    >
      <TeamRow
        team={game.teamA}
        score={isByeGame ? undefined : game.scoreA}
        seed={game.seedA}
        placeholder={!!game.teamAIsPlaceholder}
        isByeSlot={game.slotA === 'BYE'}
        winner={aWon}
        loser={completed && !aWon}
        availableTeams={availableTeams}
        onDrop={(e) => onDrop(e, round, game, 'A')}
        onAssign={(team) => onAssign(round, game, 'A', team)}
        onClear={() => onClear(round, game, 'A')}
        onTeamClick={onTeamClick}
      />
      <div className={`h-px ${completed ? 'bg-emerald-100' : 'bg-slate-100'}`} />
      <TeamRow
        team={game.teamB}
        score={isByeGame ? undefined : game.scoreB}
        seed={game.seedB}
        placeholder={!!game.teamBIsPlaceholder}
        isByeSlot={game.slotB === 'BYE'}
        winner={bWon}
        loser={completed && !bWon}
        availableTeams={availableTeams}
        onDrop={(e) => onDrop(e, round, game, 'B')}
        onAssign={(team) => onAssign(round, game, 'B', team)}
        onClear={() => onClear(round, game, 'B')}
        onTeamClick={onTeamClick}
      />
      <div className={`h-px ${completed ? 'bg-emerald-100' : 'bg-slate-100'}`} />
      <div className="flex items-center gap-1 px-2.5 h-4">
        {game.startTime ? (
          <>
            <CalendarClock size={10} className="text-primary" />
            <span className="text-[10px] truncate text-slate-500">{game.startTime}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

// ─── 队伍行 ──────────────────────────────────────────────────────────────────
function TeamRow({
  team,
  score,
  seed,
  placeholder,
  isByeSlot,
  winner,
  loser,
  availableTeams,
  onDrop,
  onAssign,
  onClear,
  onTeamClick,
}: {
  team: string;
  score?: number;
  seed?: number;
  placeholder: boolean;
  isByeSlot: boolean;
  winner: boolean;
  loser: boolean;
  availableTeams: TeamPoolItem[];
  onDrop: (e: React.DragEvent) => void;
  onAssign: (team: TeamPoolItem) => void;
  onClear: () => void;
  onTeamClick?: (teamName: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // BYE 槽：直接显示"轮空"
  if (isByeSlot) {
    return (
      <div className="flex items-center gap-2 px-2.5 h-[32px] bg-slate-50/60">
        <div className="w-5 h-5 rounded bg-slate-200 shrink-0" />
        <span className="text-xs text-slate-400 italic">轮空 BYE</span>
      </div>
    );
  }

  const canAssign = placeholder && !isByeSlot && availableTeams.length > 0;

  const bgCls = isDragOver
    ? 'bg-primary/8'
    : winner ? 'bg-emerald-100'
    : loser  ? 'bg-slate-50'
    : 'bg-white';

  const handleDragStart = (e: React.DragEvent) => {
    if (placeholder) return;
    const teamItem = { userId: `bracket-${team}`, userNickname: team, teamName: team };
    e.dataTransfer.setData('application/json', JSON.stringify(teamItem));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable={!placeholder}
      onDragStart={handleDragStart}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { setIsDragOver(false); onDrop(e); }}
      onClick={canAssign ? (e) => { e.stopPropagation(); setShowPicker((v) => !v); } : undefined}
      className={`group/row relative flex items-center gap-1.5 h-[32px] transition-colors ${bgCls} ${
        winner ? 'border-l-2 border-emerald-500 pl-2 pr-2' : 'px-2.5'
      } ${isDragOver ? 'outline outline-1 outline-primary outline-offset-[-1px]' : ''
      } ${canAssign ? 'cursor-pointer' : ''} ${!placeholder ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {placeholder ? (
        isDragOver ? (
          <>
            <div className="w-5 h-5 rounded border-2 border-primary bg-primary/10 shrink-0" />
            <span className="text-xs text-primary font-medium">放开以分配</span>
          </>
        ) : canAssign ? (
          <>
            <div className="w-5 h-5 rounded border border-dashed border-slate-300 shrink-0 flex items-center justify-center">
              <span className="text-[9px] text-slate-400">+</span>
            </div>
            <span className="text-xs text-slate-400">点击或拖入分配</span>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded bg-slate-100 shrink-0" />
            <span className="text-xs text-slate-300">—</span>
          </>
        )
      ) : (
        <>
          {winner ? (
            <Trophy size={11} className="text-emerald-500 shrink-0" />
          ) : (
            <TeamBadge name={team} dim={loser} />
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onTeamClick?.(team); }}
            className={`flex-1 truncate text-xs text-left ${
              winner ? 'text-emerald-800 font-bold hover:underline' :
              loser  ? 'text-slate-400 line-through decoration-slate-300' :
                       'text-slate-700 font-medium hover:text-primary'
            } ${onTeamClick ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {team}
          </button>
          {seed ? (
            <span className={`text-[10px] px-1 rounded shrink-0 ${
              winner ? 'text-emerald-600 bg-emerald-100 font-semibold' :
              loser  ? 'text-slate-300 bg-slate-100' :
                       'text-slate-400 bg-slate-100'
            }`}>#{seed}</span>
          ) : null}
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="hidden group-hover/row:flex w-4 h-4 items-center justify-center text-slate-300 hover:text-red-400 transition-colors shrink-0"
            title="移除队伍（将重置成绩）"
          >
            <X size={10} />
          </button>
          <span className={`text-xs font-bold w-5 text-right shrink-0 ${
            winner ? 'text-emerald-600' : loser ? 'text-slate-300' : 'text-slate-500'
          }`}>
            {score ?? ''}
          </span>
        </>
      )}

      {/* Team picker dropdown */}
      {showPicker && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowPicker(false); }} />
          <div className="absolute top-full left-0 z-20 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-1 max-h-52 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] text-slate-400 font-medium border-b border-slate-100">选择队伍</div>
            {availableTeams.map((t) => (
              <button
                key={t.userId}
                onClick={(e) => {
                  e.stopPropagation();
                  onAssign(t);
                  setShowPicker(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                {t.teamName || t.userNickname}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TeamBadge({ name, dim }: { name: string; dim?: boolean }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const color = stringToColor(name);
  return (
    <div
      className={`w-5 h-5 rounded text-[10px] font-bold text-white flex items-center justify-center shrink-0 transition-opacity ${dim ? 'opacity-30' : ''}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initial}
    </div>
  );
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
