import { useState, useMemo, useEffect } from 'react';
import { Wand2, ChevronDown, ChevronUp, Users, GripVertical, Trash2, CalendarClock, X, Plus, Pencil, Check, Trophy, SlidersHorizontal } from 'lucide-react';
import type { MatchRound, MatchGame, TournamentStage, GroupStanding, AdvancementConfig } from '../../data/mockData';
import { useMatch, useMatchActions } from '../../context/matchHooks';
import type { TeamPoolItem } from './TeamPool';
import RoundRobinBracket from './bracket/RoundRobinBracket';
import EliminationBracket from './bracket/EliminationBracket';
import SwissBracket from './bracket/SwissBracket';
import FreeBracket from './bracket/FreeBracket';
import { computeGroupStandings, computeSwissStandings } from '../../data/mockData';

export default function MatchCompetitionMgmt({ onTeamClick }: { onTeamClick?: (teamName: string) => void }) {
  const { match, rounds, approvedTeams, advancedTeams } = useMatch();
  const { assignTeam, clearSlot, updateGame, autoAssignStage, clearStage, showToast, pairSwissRound, assignGroupSlot, clearGroupSlot, advanceTeams, addExtraRound, addFreeGame, deleteFreeRound, updateStageMeta } = useMatchActions();

  const stages = match?.stages || [];
  const [activeStageId, setActiveStageId] = useState<string | null>(stages[0]?.stageId || null);
  // 每个阶段手动添加的自定义队伍
  const [extraTeams, setExtraTeams] = useState<Record<string, TeamPoolItem[]>>({});

  // 当前阶段已分配的队伍名
  const activeStageAssignedNames = useMemo(() => {
    const ids = new Set<string>();
    rounds
      .filter((r) => r.stageId === activeStageId || (!activeStageId))
      .forEach((round) =>
        round.matches.forEach((game) => {
          if (!game.teamAIsPlaceholder) ids.add(game.teamA);
          if (!game.teamBIsPlaceholder) ids.add(game.teamB);
        })
      );
    return ids;
  }, [rounds, activeStageId]);

  // 本阶段全量队伍（含已排入对阵图的）：有晋级记录用晋级列表，否则用报名队伍
  const allStageTeams = useMemo((): TeamPoolItem[] => {
    const advTeams = activeStageId ? (advancedTeams[activeStageId] ?? []) : [];
    const extra = extraTeams[activeStageId || ''] || [];
    if (advTeams.length > 0) {
      const base = advTeams.map((name, i) => ({ userId: `adv-${i}-${name}`, userNickname: name, teamName: name }));
      return [...base, ...extra];
    }
    // 来源为"上一阶段晋级"的阶段，未晋级前只展示手动添加的队伍
    const activeStage = stages.find((s) => s.stageId === activeStageId);
    if (activeStage?.entrant?.source?.type === 'FROM_PREVIOUS_STAGE') {
      return extra;
    }
    return [...approvedTeams, ...extra];
  }, [activeStageId, advancedTeams, approvedTeams, stages, extraTeams]);

  // 未排入对阵图的可用队伍：用计数而非集合，正确处理同名队伍
  const stagePoolTeams = useMemo((): TeamPoolItem[] => {
    // 统计对阵图里每个名字已占用几个槽
    const assignedCounts = new Map<string, number>();
    rounds
      .filter((r) => r.stageId === activeStageId || !activeStageId)
      .forEach((round) =>
        round.matches.forEach((game) => {
          if (!game.teamAIsPlaceholder) assignedCounts.set(game.teamA, (assignedCounts.get(game.teamA) || 0) + 1);
          if (!game.teamBIsPlaceholder) assignedCounts.set(game.teamB, (assignedCounts.get(game.teamB) || 0) + 1);
        })
      );
    // 按名字消耗计数：每遇到一个同名队伍先消耗一个"已分配"配额
    const usedCounts = new Map<string, number>();
    return allStageTeams.filter((t) => {
      const name = t.teamName || t.userNickname;
      const assigned = assignedCounts.get(name) || 0;
      const used = usedCounts.get(name) || 0;
      if (used < assigned) { usedCounts.set(name, used + 1); return false; }
      return true;
    });
  }, [rounds, activeStageId, allStageTeams]);

  const handleAssignTeam = (roundId: string, gameId: string, side: 'A' | 'B', team: TeamPoolItem) => {
    const teamName = team.teamName || team.userNickname;
    assignTeam(roundId, gameId, side, teamName);
  };

  const handleClearSlot = (roundId: string, gameId: string, side: 'A' | 'B') => {
    const round = rounds.find((r) => r.roundId === roundId);
    const game = round?.matches.find((g) => g.gameId === gameId);
    if (!game) return;
    const placeholder = side === 'A' ? game.slotA || '待定' : game.slotB || '待定';
    clearSlot(roundId, gameId, side, placeholder);
  };

  const handleUpdateGame = (roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => {
    updateGame(roundId, gameId, updates, winnerTeamName);
    if (winnerTeamName) {
      const round = rounds.find((r) => r.roundId === roundId);
      const isElimination = round?.stageType === 'SINGLE_ELIMINATION' || round?.stageType === 'DOUBLE_ELIMINATION';
      if (isElimination) showToast(`胜者 ${winnerTeamName} 已晋级下一轮`, 'success');
    }
  };

  const handleAddTeam = (name: string) => {
    if (!activeStageId || !name.trim()) return;
    const trimmed = name.trim();
    const newTeam: TeamPoolItem = {
      userId: `custom-${Date.now()}-${trimmed}`,
      userNickname: trimmed,
      teamName: trimmed,
    };
    setExtraTeams(prev => ({ ...prev, [activeStageId]: [...(prev[activeStageId] || []), newTeam] }));
  };

  const handleRemoveExtraTeam = (userId: string) => {
    if (!activeStageId) return;
    setExtraTeams(prev => ({ ...prev, [activeStageId]: (prev[activeStageId] || []).filter(t => t.userId !== userId) }));
  };

  if (!match) {
    return <div className="text-center py-12 text-slate-400 text-sm">未选择赛事</div>;
  }

  return (
    <BracketView
      rounds={rounds}
      stages={stages}
      activeStageId={activeStageId}
      availableTeams={stagePoolTeams}
      allStageTeams={allStageTeams}
      activeStageAssignedNames={activeStageAssignedNames}
      isAdvanced={activeStageId ? (advancedTeams[activeStageId] ?? []).length > 0 : false}
      onStageChange={setActiveStageId}
      onAssignTeam={handleAssignTeam}
      onClearSlot={handleClearSlot}
      onUpdateGame={handleUpdateGame}
      onAssignGroupSlot={assignGroupSlot}
      onClearGroupSlot={clearGroupSlot}
      onPairSwissRound={(stageId, groupIndex) => {
        pairSwissRound(stageId, groupIndex);
        showToast('已根据当前积分配对下一轮', 'success');
      }}
      onAutoAssignStage={(stageId) => {
        autoAssignStage(stageId);
        showToast('已自动排布此阶段队伍', 'success');
      }}
      onClearStage={(stageId) => {
        clearStage(stageId);
        showToast('已清空此阶段排布', 'info');
      }}
      onAdvanceTeams={(currentStageId, nextStageId, teams) => {
        advanceTeams(currentStageId, nextStageId, teams);
        showToast(`已将 ${teams.length} 支队伍记录为晋级，请前往下一阶段排布`, 'success');
      }}
      onAddExtraRound={(stageId, groupIndex, teamA, teamB) => {
        addExtraRound(stageId, groupIndex, teamA, teamB);
        showToast('已添加加赛场次', 'success');
      }}
      onAddFreeGame={(stageId, teamA, teamB, format, roundName) => {
        addFreeGame(stageId, teamA, teamB, format, roundName);
        showToast(`已创建比赛：${teamA} vs ${teamB}`, 'success');
      }}
      onDeleteFreeRound={(roundId) => {
        deleteFreeRound(roundId);
        showToast('已删除比赛', 'info');
      }}
      onTeamClick={onTeamClick}
      onAddTeam={handleAddTeam}
      onRemoveExtraTeam={handleRemoveExtraTeam}
      onUpdateStageMeta={(stageId, scoring) => {
        updateStageMeta(stageId, scoring);
        showToast('积分规则已更新', 'success');
      }}
    />
  );
}

function ScoringRulesEditor({
  stage,
  onSave,
  onCancel,
}: {
  stage: TournamentStage;
  onSave: (scoring: { winPoints: number; drawPoints: number; lossPoints: number }) => void;
  onCancel: () => void;
}) {
  const [win, setWin] = useState(stage.config.winPoints ?? 3);
  const [draw, setDraw] = useState(stage.config.drawPoints ?? 1);
  const [loss, setLoss] = useState(stage.config.lossPoints ?? 0);

  return (
    <div className="border border-primary/30 bg-primary/5 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-primary">积分规则</span>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={13} /></button>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {([
          { label: '胜场积分', value: win, set: setWin },
          { label: '平局积分', value: draw, set: setDraw },
          { label: '败场积分', value: loss, set: setLoss },
        ] as { label: string; value: number; set: (v: number) => void }[]).map(({ label, value, set }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 shrink-0">{label}</span>
            <input
              type="number"
              min={0}
              value={value}
              onChange={e => set(Number(e.target.value))}
              className="w-14 text-sm px-2 py-1 border border-slate-200 rounded-lg focus:border-primary outline-none text-center bg-white"
            />
          </div>
        ))}
        <button
          onClick={() => onSave({ winPoints: win, drawPoints: draw, lossPoints: loss })}
          className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  );
}

function TeamManagementPanel({
  teams,
  assignedNames,
  isAdvanced,
  onAddTeam,
  onRemoveExtraTeam,
}: {
  teams: TeamPoolItem[];
  assignedNames: Set<string>;
  isAdvanced?: boolean;
  onAddTeam?: (name: string) => void;
  onRemoveExtraTeam?: (userId: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const assignedCount = teams.filter(t => assignedNames.has(t.teamName || t.userNickname)).length;
  const pendingCount = teams.length - assignedCount;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddTeam?.(newName.trim());
    setNewName('');
  };

  return (
    <div className={`border rounded-xl overflow-hidden ${isAdvanced ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2 px-4 py-2.5">
        <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 flex-1 min-w-0">
          <Users size={13} className={isAdvanced ? 'text-amber-600' : 'text-primary'} />
          <span className={`text-sm font-medium ${isAdvanced ? 'text-amber-800' : 'text-slate-700'}`}>
            {isAdvanced ? '晋级队伍' : '本阶段队伍'}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${isAdvanced ? 'bg-amber-200 text-amber-800' : 'bg-primary/10 text-primary'}`}>{teams.length}</span>
          </span>
          {assignedCount > 0 && (
            <span className="text-xs text-emerald-600 font-medium">{assignedCount} 已排入</span>
          )}
          {pendingCount > 0 && (
            <span className="text-xs text-slate-400">{pendingCount} 待分配</span>
          )}
        </button>
        <span className="text-xs text-slate-400 hidden sm:block">可拖入对阵图</span>
        {onAddTeam && (
          <button
            onClick={() => { setEditing(v => !v); setNewName(''); }}
            title={editing ? '完成编辑' : '编辑队伍'}
            className={`p-1 rounded transition-colors ${editing ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
          >
            {editing ? <Check size={13} /> : <Pencil size={13} />}
          </button>
        )}
        <button onClick={() => setOpen(v => !v)} className="text-slate-400 shrink-0">
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>
      {open && (
        <div className="px-4 pb-3 border-t border-slate-100 pt-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {teams.map(team => {
              const name = team.teamName || team.userNickname;
              const isAssigned = assignedNames.has(name);
              const isCustom = team.userId.startsWith('custom-');
              return (
                <div
                  key={team.userId}
                  draggable={!editing}
                  onDragStart={e => {
                    if (editing) return;
                    e.dataTransfer.setData('application/json', JSON.stringify(team));
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  title={isAssigned ? `${name}（已排入对阵图，可拖动换位）` : name}
                  className={`flex items-center gap-1 px-2.5 py-1 border rounded-full text-sm font-medium transition-colors ${
                    isCustom
                      ? 'bg-violet-50 border-violet-200 text-violet-700'
                      : isAssigned
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  } ${!editing ? 'cursor-grab active:cursor-grabbing hover:border-primary hover:text-primary' : ''}`}
                >
                  {!editing && <GripVertical size={10} className="text-slate-300 shrink-0" />}
                  {name}
                  {isAssigned && !editing && <span className="text-emerald-500 text-[9px]">✓</span>}
                  {editing && isCustom && onRemoveExtraTeam && (
                    <button
                      onClick={() => onRemoveExtraTeam(team.userId)}
                      className="ml-0.5 text-violet-400 hover:text-red-500 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {editing && onAddTeam && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="输入队伍名称"
                className="flex-1 text-sm px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
                autoFocus
              />
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors"
              >
                <Plus size={13} />
                添加
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 批量设时工具 ─────────────────────────────────────────────────────────────
function dtLocalToDisplay(v: string) { return v.replace('T', ' '); }
function addMinsDisplay(display: string, mins: number): string {
  const d = new Date(display.replace(' ', 'T'));
  if (isNaN(d.getTime())) return display;
  d.setMinutes(d.getMinutes() + mins);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function BracketView({
  rounds,
  stages,
  activeStageId,
  availableTeams,
  allStageTeams,
  activeStageAssignedNames,
  isAdvanced,
  onStageChange,
  onAutoAssignStage,
  onClearStage,
  onAssignTeam,
  onClearSlot,
  onUpdateGame,
  onAssignGroupSlot,
  onClearGroupSlot,
  onPairSwissRound,
  onAdvanceTeams,
  onAddExtraRound,
  onAddFreeGame,
  onDeleteFreeRound,
  onTeamClick,
  onAddTeam,
  onRemoveExtraTeam,
  onUpdateStageMeta,
}: {
  rounds: MatchRound[];
  stages: TournamentStage[];
  activeStageId: string | null;
  availableTeams: TeamPoolItem[];
  allStageTeams: TeamPoolItem[];
  activeStageAssignedNames: Set<string>;
  isAdvanced: boolean;
  onStageChange: (id: string | null) => void;
  onAutoAssignStage: (stageId: string) => void;
  onClearStage: (stageId: string) => void;
  onAssignTeam: (roundId: string, gameId: string, side: 'A' | 'B', team: TeamPoolItem) => void;
  onClearSlot: (roundId: string, gameId: string, side: 'A' | 'B') => void;
  onUpdateGame: (roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => void;
  onAssignGroupSlot: (roundIds: string[], slotName: string, team: TeamPoolItem) => void;
  onClearGroupSlot: (roundIds: string[], slotName: string) => void;
  onPairSwissRound: (stageId: string, groupIndex: number) => void;
  onAdvanceTeams: (currentStageId: string, nextStageId: string, teams: string[]) => void;
  onAddExtraRound: (stageId: string, groupIndex: number, teamA: string, teamB: string) => void;
  onAddFreeGame: (stageId: string, teamA: string, teamB: string, format: string, roundName?: string) => void;
  onDeleteFreeRound: (roundId: string) => void;
  onTeamClick?: (teamName: string) => void;
  onAddTeam?: (name: string) => void;
  onRemoveExtraTeam?: (userId: string) => void;
  onUpdateStageMeta?: (stageId: string, scoring: { winPoints: number; drawPoints: number; lossPoints: number }) => void;
}) {
  const [showBatchTime, setShowBatchTime] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [batchRoundId, setBatchRoundId] = useState<string | null>(null);
  const [batchStart, setBatchStart] = useState('');
  const [batchInterval, setBatchInterval] = useState(30);
  const activeStage = useMemo(
    () => stages.find((s) => s.stageId === activeStageId) || stages[0] || null,
    [stages, activeStageId]
  );

  const activeRounds = useMemo(() => {
    if (!activeStage) return rounds;
    return rounds.filter(
      (r) => r.stageId === activeStage.stageId || r.roundName.split(' · ')[0] === activeStage.name
    );
  }, [rounds, activeStage]);

  // 排期可选的轮次（过滤掉纯 BYE 场）— must be before early return
  const scheduleRounds = useMemo(() =>
    activeRounds
      .filter(r => r.matches.some(g => g.slotA !== 'BYE' && g.slotB !== 'BYE'))
      .sort((a, b) => a.roundNumber - b.roundNumber),
    [activeRounds]
  );

  if (rounds.length === 0 && activeStage?.type !== 'FREE') {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        该赛事暂未配置赛程
      </div>
    );
  }

  const applyBatchTime = () => {
    if (!batchRoundId || !batchStart) return;
    const round = activeRounds.find(r => r.roundId === batchRoundId);
    if (!round) return;
    let t = dtLocalToDisplay(batchStart);
    round.matches
      .filter(g => g.slotA !== 'BYE' && g.slotB !== 'BYE')
      .forEach((g) => {
        onUpdateGame(round.roundId, g.gameId, { startTime: t });
        t = addMinsDisplay(t, batchInterval);
      });
    setShowBatchTime(false);
    setBatchRoundId(null);
    setBatchStart('');
  };

  return (
    <div className="space-y-4">
      {stages.length > 0 && (
        <div className="space-y-2">
          {/* Stage tabs + action buttons */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200">
            <div className="flex items-center overflow-x-auto">
              {stages.map((stage) => (
                <button
                  key={stage.stageId}
                  onClick={() => onStageChange(stage.stageId)}
                  className={`text-sm px-4 py-2.5 whitespace-nowrap transition-colors ${
                    activeStageId === stage.stageId
                      ? 'text-primary border-b-2 border-primary font-medium'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {stage.name}
                </button>
              ))}
            </div>
            {activeStage && (
              <div className="flex items-center gap-2 shrink-0 pb-2">
                {(activeStage.type === 'ROUND_ROBIN' || activeStage.type === 'SWISS' || activeStage.type === 'FREE') && (
                  <button
                    onClick={() => { setShowScoring(v => !v); setShowBatchTime(false); }}
                    className={`flex items-center gap-1 text-sm px-3 py-1.5 border rounded-lg transition-colors ${
                      showScoring
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-primary'
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    积分规则
                  </button>
                )}
                {activeStage.type !== 'FREE' && (
                  <button
                    onClick={() => { setShowBatchTime(v => !v); setShowScoring(false); setBatchRoundId(null); }}
                    className={`flex items-center gap-1 text-sm px-3 py-1.5 border rounded-lg transition-colors ${
                      showBatchTime
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-primary'
                    }`}
                  >
                    <CalendarClock size={12} />
                    批量设时
                  </button>
                )}
                <button
                  onClick={() => onClearStage(activeStage.stageId)}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:border-rose-300 hover:text-rose-600 transition-colors"
                  title="清空此阶段所有排布和成绩"
                >
                  <Trash2 size={12} />
                  清空
                </button>
                <button
                  onClick={() => onAutoAssignStage(activeStage.stageId)}
                  disabled={availableTeams.length === 0}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors"
                >
                  <Wand2 size={12} />
                  一键排布
                </button>
              </div>
            )}
          </div>

          {/* 批量设时面板 */}
          {showBatchTime && activeStage && (
            <div className="border border-primary/30 bg-primary/5 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">批量排期 · 选择轮次</span>
                <button onClick={() => setShowBatchTime(false)} className="text-slate-400 hover:text-slate-600"><X size={13} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {scheduleRounds.map(r => (
                  <button
                    key={r.roundId}
                    onClick={() => setBatchRoundId(batchRoundId === r.roundId ? null : r.roundId)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      batchRoundId === r.roundId
                        ? 'bg-primary text-white border-primary'
                        : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary bg-white'
                    }`}
                  >
                    {r.roundName.split(' · ').pop()}
                    <span className="ml-1 opacity-60">({r.matches.filter(g => g.slotA !== 'BYE' && g.slotB !== 'BYE').length}场)</span>
                  </button>
                ))}
              </div>
              {batchRoundId && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-slate-500 shrink-0">首场开始时间</span>
                  <input
                    type="datetime-local"
                    value={batchStart}
                    onChange={e => setBatchStart(e.target.value)}
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary"
                  />
                  <span className="text-xs text-slate-400 shrink-0">场间间隔</span>
                  <input
                    type="number"
                    min={0}
                    value={batchInterval}
                    onChange={e => setBatchInterval(Number(e.target.value))}
                    className="text-xs w-14 px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary text-center"
                  />
                  <span className="text-xs text-slate-400 shrink-0">分钟</span>
                  <button
                    onClick={applyBatchTime}
                    disabled={!batchStart}
                    className="text-xs px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    应用
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 积分规则面板 */}
          {showScoring && activeStage && (
            <ScoringRulesEditor
              stage={activeStage}
              onSave={(scoring) => { onUpdateStageMeta?.(activeStage.stageId, scoring); setShowScoring(false); }}
              onCancel={() => setShowScoring(false)}
            />
          )}

          {/* 队伍管理面板 */}
          <TeamManagementPanel
            teams={allStageTeams}
            assignedNames={activeStageAssignedNames}
            isAdvanced={isAdvanced}
            onAddTeam={onAddTeam}
            onRemoveExtraTeam={onRemoveExtraTeam}
          />
        </div>
      )}

      {activeStage ? (
        <div className="space-y-4">
          {activeStage.type === 'ROUND_ROBIN' && (
            <RoundRobinBracket
              rounds={activeRounds}
              availableTeams={availableTeams}
              onUpdateGame={onUpdateGame}
              onAssignGroupSlot={onAssignGroupSlot}
              onClearGroupSlot={onClearGroupSlot}
              onAddExtraRound={(stageId, groupIndex, teamA, teamB) =>
                onAddExtraRound(stageId, groupIndex, teamA, teamB)
              }
              winPoints={activeStage.config.winPoints ?? 3}
              drawPoints={activeStage.config.drawPoints ?? 1}
              lossPoints={activeStage.config.lossPoints ?? 0}
              onTeamClick={onTeamClick}
            />
          )}
          {activeStage.type === 'SINGLE_ELIMINATION' && (
            <EliminationBracket
              rounds={activeRounds}
              availableTeams={availableTeams}
              onUpdateGame={onUpdateGame}
              onAssignTeam={onAssignTeam}
              onClearSlot={onClearSlot}
              onTeamClick={onTeamClick}
            />
          )}
          {activeStage.type === 'DOUBLE_ELIMINATION' && (
            <EliminationBracket
              rounds={activeRounds}
              availableTeams={availableTeams}
              onUpdateGame={onUpdateGame}
              onAssignTeam={onAssignTeam}
              onClearSlot={onClearSlot}
              variant="double"
              onTeamClick={onTeamClick}
            />
          )}
          {activeStage.type === 'SWISS' && (
            <SwissBracket
              rounds={activeRounds}
              availableTeams={availableTeams}
              stage={activeStage}
              onUpdateGame={onUpdateGame}
              onPairNextRound={onPairSwissRound}
              onTeamClick={onTeamClick}
            />
          )}
          {activeStage.type === 'FREE' && (
            <FreeBracket
              rounds={activeRounds}
              stage={activeStage}
              availableTeams={allStageTeams}
              onUpdateGame={onUpdateGame}
              onAddFreeGame={onAddFreeGame}
              onDeleteFreeRound={onDeleteFreeRound}
              onTeamClick={onTeamClick}
            />
          )}
          {/* 晋级确认面板：按 advancement 路由逐条渲染 */}
          {(activeStage.advancement || []).map((route, idx) => {
            const targetStage = route.nextStageId ? stages.find((s) => s.stageId === route.nextStageId) : undefined;
            const totalGames = activeRounds.reduce((n, r) => n + r.matches.length, 0);
            const doneGames = activeRounds.reduce(
              (n, r) => n + r.matches.filter((g) => g.status === 'completed' || g.status === 'cancelled').length, 0
            );
            return (
              <AdvancementPanel
                key={idx}
                currentStage={activeStage}
                route={route}
                targetStage={targetStage}
                activeRounds={activeRounds}
                stages={stages}
                totalGames={totalGames}
                doneGames={doneGames}
                onAdvance={(teams) => {
                  if (route.nextStageId) {
                    onAdvanceTeams(activeStage.stageId, route.nextStageId, teams);
                  }
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-sm">该赛事暂未配置赛程</div>
      )}
    </div>
  );
}

// ─── 晋级确认面板 ────────────────────────────────────────────────────────────

function AdvancementPanel({
  currentStage,
  route,
  targetStage,
  stages,
  activeRounds,
  totalGames,
  doneGames,
  onAdvance,
}: {
  currentStage: TournamentStage;
  route: AdvancementConfig;
  targetStage?: TournamentStage;   // undefined = 最后赛段名次记录
  stages: TournamentStage[];
  activeRounds: MatchRound[];
  totalGames: number;
  doneGames: number;
  onAdvance: (teams: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const allDone = totalGames > 0 && doneGames === totalGames;
  const isWinnerTracking = !targetStage; // 无目标赛段 = 最终名次

  const groupedStandings = useMemo((): { label: string; standings: GroupStanding[]; quota: number }[] => {
    const winPts = currentStage.config.winPoints ?? 3;
    const drawPts = currentStage.config.drawPoints ?? 1;
    const lossPts = currentStage.config.lossPoints ?? 0;

    const groupCount = currentStage.group?.enabled ? currentStage.group.groupCount : 1;
    const qualifierPerGroup =
      route.type === 'TOP_N_PER_GROUP'
        ? (route.countPerGroup ?? 1)
        : route.type === 'GLOBAL_TOP_N'
          ? Math.ceil((route.totalCount ?? 1) / Math.max(1, groupCount))
          : 1;

    if (currentStage.type === 'SWISS') {
      return Array.from({ length: groupCount }, (_, g) => {
        const groupRounds = activeRounds.filter((r) => (r.groupIndex ?? 0) === g);
        const standings = computeSwissStandings(groupRounds, winPts, drawPts, lossPts);
        return {
          label: groupCount > 1 ? `第 ${g + 1} 组` : '总排名',
          standings,
          quota: groupCount > 1 ? qualifierPerGroup : (route.totalCount ?? currentStage.teamsOut),
        };
      });
    }

    return Array.from({ length: groupCount }, (_, g) => {
      const standings = computeGroupStandings(activeRounds, g, winPts, drawPts, lossPts);
      return { label: groupCount > 1 ? `第 ${g + 1} 组` : '积分榜', standings, quota: qualifierPerGroup };
    });
  }, [currentStage, route, activeRounds]);

  const defaultSelected = useMemo(() => {
    const set = new Set<string>();
    groupedStandings.forEach(({ standings, quota }) => {
      standings.slice(0, quota).forEach((s) => set.add(s.teamName));
    });
    return set;
  }, [groupedStandings]);

  const [selected, setSelected] = useState<Set<string>>(defaultSelected);
  const [prevDefault, setPrevDefault] = useState(defaultSelected);
  if (prevDefault !== defaultSelected) {
    setPrevDefault(defaultSelected);
    setSelected(defaultSelected);
  }

  const toggleTeam = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const totalQuota = groupedStandings.reduce((s, g) => s + g.quota, 0);

  return (
    <div className={`border rounded-xl overflow-hidden ${allDone ? 'border-amber-200' : 'border-slate-200'}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${allDone ? 'bg-amber-50 hover:bg-amber-100' : 'bg-slate-50 hover:bg-slate-100'}`}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Trophy size={14} className={allDone ? 'text-amber-600' : 'text-slate-400'} />
          <span className={allDone ? 'text-amber-800' : 'text-slate-600'}>
            {isWinnerTracking ? '最终名次' : '晋级管理'}
          </span>
          <span className={`text-sm font-normal ${allDone ? 'text-amber-600' : 'text-slate-400'}`}>
            {isWinnerTracking
              ? `计划记录 ${totalQuota} 支获胜队伍`
              : `→ ${targetStage!.name}，计划晋级 ${totalQuota} 队`}
          </span>
          {!allDone && totalGames > 0 && (
            <span className="text-xs px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded-full">
              {doneGames}/{totalGames} 场已完成
            </span>
          )}
        </div>
        {open ? <ChevronUp size={14} className="text-amber-500" /> : <ChevronDown size={14} className="text-amber-500" />}
      </button>

      {open && (
        <div className="p-4 space-y-4 bg-white">
          {!allDone && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              <Trophy size={13} />
              尚有 {totalGames - doneGames} 场比赛未完成，当前积分榜仅供参考，确认无误后再执行{isWinnerTracking ? '名次确认' : '晋级'}。
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupedStandings.map(({ label, standings, quota }) => (
              <div key={label} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 text-sm font-bold text-slate-700 border-b border-slate-200 flex items-center justify-between">
                  <span>{label}</span>
                  <span className="text-slate-400 font-normal text-xs">
                    {isWinnerTracking ? '获胜名额' : '晋级名额'} {quota}
                  </span>
                </div>
                {standings.length === 0 ? (
                  <div className="p-4 text-sm text-slate-400 text-center">暂无成绩</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {standings.map((s, i) => {
                      const isInQuota = i < quota;
                      const isChecked = selected.has(s.teamName);
                      return (
                        <label
                          key={s.teamName}
                          className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                            isChecked ? 'bg-amber-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTeam(s.teamName)}
                            className="accent-amber-500 shrink-0"
                          />
                          <span className={`text-sm w-5 text-center font-bold shrink-0 ${
                            i === 0 ? 'text-amber-600' : i === 1 ? 'text-slate-500' : i === 2 ? 'text-orange-500' : 'text-slate-400'
                          }`}>
                            {i + 1}
                          </span>
                          <span className={`text-sm flex-1 truncate font-medium ${isChecked ? 'text-slate-800' : 'text-slate-600'}`} title={s.teamName}>
                            {s.teamName}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                            <span className="text-emerald-600 font-medium">{s.points}分</span>
                            <span>{s.wins}胜{s.losses}负</span>
                          </div>
                          {isInQuota && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full shrink-0">
                              {isWinnerTracking ? '获胜' : '晋级'}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="text-sm text-slate-500">
              已选 <span className="font-bold text-slate-700">{selected.size}</span> 支队伍 / 计划 {totalQuota} 支
              {selected.size !== totalQuota && (
                <span className="ml-1 text-amber-600">（与计划名额不符，请确认）</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelected(new Set(defaultSelected))}
                className="text-sm px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
              >
                重置为默认
              </button>
              <button
                onClick={() => {
                  const orderedTeams: string[] = [];
                  groupedStandings.forEach(({ standings }) => {
                    standings.forEach((s) => {
                      if (selected.has(s.teamName)) orderedTeams.push(s.teamName);
                    });
                  });
                  onAdvance(orderedTeams);
                  setOpen(false);
                }}
                disabled={selected.size === 0}
                className="text-sm px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium"
              >
                {isWinnerTracking ? '确认名次' : '确认晋级 →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
