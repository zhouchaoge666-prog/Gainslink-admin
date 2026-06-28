import { useState } from 'react';
import { CalendarDays, Clock, Edit2, CheckCircle2, X, CalendarClock } from 'lucide-react';
import { matchRoundData } from '../../data/mockData';
import type { MatchRound, MatchGame } from '../../data/mockData';
import NumericInput from './NumericInput';

interface TeamPayload {
  userId: string;
  userNickname: string;
  teamName?: string;
}

interface MatchScheduleProps {
  matchId: string;
  rounds?: MatchRound[];
  onRoundsChange?: (rounds: MatchRound[]) => void;
  onAssignTeam?: (roundId: string, gameId: string, side: 'A' | 'B', team: TeamPayload) => void;
  onClearSlot?: (roundId: string, gameId: string, side: 'A' | 'B') => void;
}

const stageMap: Record<MatchRound['stage'], string> = {
  group: '小组赛',
  knockout: '淘汰赛',
  final: '决赛',
};

const gameStatusMap: Record<MatchGame['status'], { label: string; color: string }> = {
  scheduled: { label: '未开始', color: 'text-slate-500' },
  live: { label: '进行中', color: 'text-blue-600' },
  completed: { label: '已完成', color: 'text-emerald-600' },
  cancelled: { label: '已取消', color: 'text-red-600' },
};

const gameFormatOptions = ['BO1', 'BO2', 'BO3', 'BO5'];

// Format "YYYY-MM-DDTHH:MM" (datetime-local) ↔ "YYYY-MM-DD HH:MM"
function datetimeLocalToDisplay(v: string): string {
  return v.replace('T', ' ');
}
function displayToDatetimeLocal(v: string): string {
  // Accept "YYYY-MM-DD HH:MM" or "YYYY-MM-DDTHH:MM"
  return v.replace(' ', 'T').slice(0, 16);
}

function addMinutes(datetimeDisplay: string, minutes: number): string {
  const iso = datetimeDisplay.replace(' ', 'T');
  const d = new Date(iso);
  if (isNaN(d.getTime())) return datetimeDisplay;
  d.setMinutes(d.getMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MatchSchedule({
  matchId,
  rounds: controlledRounds,
  onRoundsChange,
  onAssignTeam,
  onClearSlot,
}: MatchScheduleProps) {
  const isControlled = controlledRounds !== undefined;
  const [internalRounds, setInternalRounds] = useState<MatchRound[]>(
    matchRoundData.filter((r) => r.matchId === matchId)
  );
  const [editingGame, setEditingGame] = useState<string | null>(null);
  // batchPanel: roundId that has batch-schedule panel open
  const [batchPanel, setBatchPanel] = useState<string | null>(null);
  const [batchStart, setBatchStart] = useState('');
  const [batchInterval, setBatchInterval] = useState(30);

  const rounds = isControlled ? controlledRounds! : internalRounds;
  const setRounds = (updater: React.SetStateAction<MatchRound[]>) => {
    const next = typeof updater === 'function' ? (updater as (prev: MatchRound[]) => MatchRound[])(rounds) : updater;
    if (isControlled) {
      onRoundsChange?.(next);
    } else {
      setInternalRounds(next);
      next.forEach((round) => {
        const idx = matchRoundData.findIndex((r) => r.roundId === round.roundId);
        if (idx >= 0) matchRoundData[idx] = round;
      });
    }
  };

  const updateScore = (roundId: string, gameId: string, scoreA: number, scoreB: number) => {
    setRounds((prev) =>
      prev.map((round) =>
        round.roundId === roundId
          ? {
              ...round,
              matches: round.matches.map((game) =>
                game.gameId === gameId
                  ? {
                      ...game,
                      scoreA,
                      scoreB,
                      winner: scoreA > scoreB ? game.teamA : scoreB > scoreA ? game.teamB : undefined,
                      status: 'completed',
                    }
                  : game
              ),
            }
          : round
      )
    );
    setEditingGame(null);
  };

  const handleUpdateGame = (roundId: string, gameId: string, updates: Partial<MatchGame>) => {
    setRounds((prev) =>
      prev.map((round) =>
        round.roundId === roundId
          ? { ...round, matches: round.matches.map((game) => (game.gameId === gameId ? { ...game, ...updates } : game)) }
          : round
      )
    );
  };

  const handleDrop = (e: React.DragEvent, roundId: string, gameId: string, side: 'A' | 'B') => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/json');
    if (!raw || !onAssignTeam) return;
    try {
      const team: TeamPayload = JSON.parse(raw);
      onAssignTeam(roundId, gameId, side, team);
    } catch {
      // ignore
    }
  };

  const handleBatchApply = (roundId: string) => {
    if (!batchStart) return;
    setRounds((prev) =>
      prev.map((round) => {
        if (round.roundId !== roundId) return round;
        const matches = round.matches.map((game, idx) => ({
          ...game,
          startTime: idx === 0 ? batchStart : addMinutes(batchStart, idx * batchInterval),
        }));
        return { ...round, matches };
      })
    );
    setBatchPanel(null);
  };

  const openBatchPanel = (round: MatchRound) => {
    // Pre-fill with first game's time or round's startTime
    const firstTime = round.matches[0]?.startTime || round.startTime || '';
    setBatchStart(firstTime);
    setBatchInterval(30);
    setBatchPanel(round.roundId);
  };

  if (rounds.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        该赛事暂未配置排期，请在排阵设计中生成赛程。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rounds.map((round) => (
        <div key={round.roundId} className="bg-slate-50 rounded-xl p-4 space-y-3">
          {/* Round header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-medium text-slate-800">{round.roundName}</div>
              <span className="text-xs px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-500">
                {stageMap[round.stage]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={12} />
                {round.startTime} ~ {round.endTime}
              </div>
              <button
                onClick={() =>
                  batchPanel === round.roundId ? setBatchPanel(null) : openBatchPanel(round)
                }
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  batchPanel === round.roundId
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CalendarClock size={12} />
                批量排期
              </button>
            </div>
          </div>

          {/* Batch schedule panel */}
          {batchPanel === round.roundId && (
            <div className="flex items-end gap-3 px-3 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 font-medium">第一场开始时间</label>
                <input
                  type="datetime-local"
                  value={displayToDatetimeLocal(batchStart)}
                  onChange={(e) => setBatchStart(datetimeLocalToDisplay(e.target.value))}
                  className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 font-medium">场次间隔（分钟）</label>
                <NumericInput
                  value={batchInterval}
                  onChange={(v) => setBatchInterval(v ?? 30)}
                  min={0}
                  className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-primary"
                />
              </div>
              <div className="text-xs text-slate-400 mb-1.5">
                共 {round.matches.length} 场，最后一场约{' '}
                {addMinutes(batchStart, (round.matches.length - 1) * batchInterval)}
              </div>
              <div className="flex gap-2 mb-0.5">
                <button
                  onClick={() => handleBatchApply(round.roundId)}
                  disabled={!batchStart}
                  className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  应用
                </button>
                <button
                  onClick={() => setBatchPanel(null)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* Match list */}
          <div className="space-y-2">
            {round.matches.map((game) => {
              const status = gameStatusMap[game.status];
              const isEditing = editingGame === game.gameId;

              return (
                <div key={game.gameId} className="bg-white border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Slot
                        side="A"
                        team={game.teamA}
                        slot={game.slotA}
                        isPlaceholder={!!game.teamAIsPlaceholder}
                        onDrop={(e) => handleDrop(e, round.roundId, game.gameId, 'A')}
                        onClear={() => onClearSlot?.(round.roundId, game.gameId, 'A')}
                        allowDrop={!!onAssignTeam}
                      />

                      {isEditing ? (
                        <ScoreEditor
                          initialA={game.scoreA}
                          initialB={game.scoreB}
                          onSave={(a, b) => updateScore(round.roundId, game.gameId, a, b)}
                          onCancel={() => setEditingGame(null)}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">
                            {game.scoreA ?? '-'}
                          </div>
                          <span className="text-slate-400">:</span>
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">
                            {game.scoreB ?? '-'}
                          </div>
                        </div>
                      )}

                      <Slot
                        side="B"
                        team={game.teamB}
                        slot={game.slotB}
                        isPlaceholder={!!game.teamBIsPlaceholder}
                        onDrop={(e) => handleDrop(e, round.roundId, game.gameId, 'B')}
                        onClear={() => onClearSlot?.(round.roundId, game.gameId, 'B')}
                        allowDrop={!!onAssignTeam}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                      <button
                        onClick={() => setEditingGame(game.gameId)}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
                      >
                        <Edit2 size={11} />
                        编辑
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        <input
                          type="text"
                          value={game.startTime}
                          onChange={(e) => handleUpdateGame(round.roundId, game.gameId, { startTime: e.target.value })}
                          className="w-36 px-1.5 py-0.5 border border-slate-200 rounded text-xs outline-none focus:border-primary bg-transparent"
                          placeholder="YYYY-MM-DD HH:MM"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-300">局数</span>
                        <select
                          value={game.format || 'BO1'}
                          onChange={(e) => handleUpdateGame(round.roundId, game.gameId, { format: e.target.value })}
                          className="px-1.5 py-0.5 border border-slate-200 rounded text-xs bg-transparent outline-none focus:border-primary"
                        >
                          {gameFormatOptions.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {game.winner && <span className="text-emerald-600">获胜：{game.winner}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Slot({
  side,
  team,
  slot,
  isPlaceholder,
  onDrop,
  onClear,
  allowDrop,
}: {
  side: 'A' | 'B';
  team: string;
  slot?: string;
  isPlaceholder: boolean;
  onDrop: (e: React.DragEvent) => void;
  onClear: () => void;
  allowDrop: boolean;
}) {
  const [isOver, setIsOver] = useState(false);
  const display = isPlaceholder ? `占位 ${slot || team}` : team;

  return (
    <div
      onDragOver={allowDrop ? (e) => { e.preventDefault(); setIsOver(true); } : undefined}
      onDragLeave={allowDrop ? () => setIsOver(false) : undefined}
      onDrop={allowDrop ? (e) => { setIsOver(false); onDrop(e); } : undefined}
      className={`flex-1 min-w-0 flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
        isPlaceholder
          ? isOver
            ? 'border-primary bg-primary/5'
            : 'border-dashed border-slate-300 bg-slate-50'
          : isOver
          ? 'border-primary bg-primary/5'
          : 'border-solid border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
            side === 'A' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'
          }`}
        >
          {side}
        </div>
        <div className={`text-sm truncate ${isPlaceholder ? 'text-slate-400 italic' : 'text-slate-700 font-medium'}`}>
          {display}
        </div>
      </div>
      {!isPlaceholder && allowDrop && (
        <button
          onClick={onClear}
          className="ml-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
          title="清空"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

function ScoreEditor({
  initialA,
  initialB,
  onSave,
  onCancel,
}: {
  initialA?: number;
  initialB?: number;
  onSave: (a: number, b: number) => void;
  onCancel: () => void;
}) {
  const [a, setA] = useState(initialA ?? 0);
  const [b, setB] = useState(initialB ?? 0);

  return (
    <div className="flex items-center gap-2">
      <NumericInput
        value={a}
        onChange={(value) => setA(value ?? 0)}
        min={0}
        className="w-12 h-10 text-center border border-slate-200 rounded-lg text-sm outline-none focus:border-primary"
      />
      <span className="text-slate-400">:</span>
      <NumericInput
        value={b}
        onChange={(value) => setB(value ?? 0)}
        min={0}
        className="w-12 h-10 text-center border border-slate-200 rounded-lg text-sm outline-none focus:border-primary"
      />
      <button
        onClick={() => onSave(a, b)}
        className="ml-1 p-1.5 bg-primary text-white rounded-lg hover:bg-primary/90"
      >
        <CheckCircle2 size={14} />
      </button>
      <button
        onClick={onCancel}
        className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
      >
        取消
      </button>
    </div>
  );
}
