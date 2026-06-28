import { useState, useMemo } from 'react';
import { Swords, Award, Wand2, ChevronDown, ChevronUp, Trophy, Users, GripVertical, Trash2, CalendarClock, X } from 'lucide-react';
import type { MatchRound, MatchGame, TournamentStage, GroupStanding } from '../../data/mockData';
import { useMatch, useMatchActions } from '../../context/matchHooks';
import type { TeamPoolItem } from './TeamPool';
import MatchResultInput from './MatchResultInput';
import RoundRobinBracket from './bracket/RoundRobinBracket';
import EliminationBracket from './bracket/EliminationBracket';
import SwissBracket from './bracket/SwissBracket';
import { computeGroupStandings, computeSwissStandings } from '../../data/mockData';

const subTabs = [
  { key: 'bracket', label: '对阵图', icon: Swords },
  { key: 'results', label: '成绩录入', icon: Award },
];

export default function MatchCompetitionMgmt({ onTeamClick }: { onTeamClick?: (teamName: string) => void }) {
  const { match, rounds, approvedTeams, advancedTeams } = useMatch();
  const { assignTeam, clearSlot, updateGame, autoAssignStage, clearStage, showToast, pairSwissRound, assignGroupSlot, clearGroupSlot, advanceTeams, addExtraRound } = useMatchActions();

  const [subTab, setSubTab] = useState('bracket');
  const stages = match?.stages || [];
  const [activeStageId, setActiveStageId] = useState<string | null>(stages[0]?.stageId || null);

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
    if (advTeams.length > 0) {
      return advTeams.map((name, i) => ({ userId: `adv-${i}-${name}`, userNickname: name, teamName: name }));
    }
    // 来源为"上一阶段晋级"的阶段，未晋级前不展示任何队伍
    const activeStage = stages.find((s) => s.stageId === activeStageId);
    if (activeStage?.entrant?.source?.type === 'FROM_PREVIOUS_STAGE') {
      return [];
    }
    return approvedTeams;
  }, [activeStageId, advancedTeams, approvedTeams, stages]);

  // 未排入对阵图的可用队伍（供一键排布判断是否禁用）
  const stagePoolTeams = useMemo((): TeamPoolItem[] =>
    allStageTeams.filter((t) => !activeStageAssignedNames.has(t.teamName || t.userNickname)),
  [allStageTeams, activeStageAssignedNames]);

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

  if (!match) {
    return <div className="text-center py-12 text-slate-400 text-sm">未选择赛事</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-800">比赛编排</div>
      </div>

        <div className="flex items-center border-b border-slate-200 overflow-x-auto">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSubTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                  subTab === tab.key
                    ? 'text-primary border-b-2 border-primary font-medium'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {subTab === 'bracket' && (
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
              onTeamClick={onTeamClick}
            />
          )}
          {subTab === 'results' && <MatchResultInput matchId={match.id} rounds={rounds} stages={stages} />}
        </div>
    </div>
  );
}

function AvailableTeamsBar({
  teams,
  assignedNames,
  isAdvanced,
}: {
  teams: TeamPoolItem[];
  assignedNames: Set<string>;
  isAdvanced?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const assignedCount = teams.filter((t) => assignedNames.has(t.teamName || t.userNickname)).length;
  const pendingCount = teams.length - assignedCount;

  return (
    <div className={`border rounded-xl overflow-hidden ${isAdvanced ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-black/5 transition-colors"
      >
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
        <span className="ml-auto text-xs text-slate-400 hidden sm:block">可拖入对阵图重新排布</span>
        {open ? <ChevronUp size={13} className="text-slate-400 shrink-0" /> : <ChevronDown size={13} className="text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {teams.map((team) => {
            const name = team.teamName || team.userNickname;
            const isAssigned = assignedNames.has(name);
            return (
              <div
                key={team.userId}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(team));
                  e.dataTransfer.effectAllowed = 'move';
                }}
                title={isAssigned ? `${name}（已排入对阵图，可拖动换位）` : name}
                className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-sm font-medium cursor-grab active:cursor-grabbing transition-colors ${
                  isAssigned
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-primary hover:text-primary'
                }`}
              >
                <GripVertical size={10} className={isAssigned ? 'text-emerald-300' : 'text-slate-300'} />
                {name}
                {isAssigned && <span className="text-emerald-500 text-[9px]">✓</span>}
              </div>
            );
          })}
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
  onTeamClick,
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
  onTeamClick?: (teamName: string) => void;
}) {
  const [showBatchTime, setShowBatchTime] = useState(false);
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

  if (rounds.length === 0) {
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
          {/* Stage selector + action buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              {stages.map((stage) => (
                <button
                  key={stage.stageId}
                  onClick={() => onStageChange(stage.stageId)}
                  className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                    activeStageId === stage.stageId
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {stage.name}
                </button>
              ))}
            </div>
            {activeStage && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { setShowBatchTime(v => !v); setBatchRoundId(null); }}
                  className={`flex items-center gap-1 text-sm px-3 py-1.5 border rounded-lg transition-colors ${
                    showBatchTime
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-primary'
                  }`}
                >
                  <CalendarClock size={12} />
                  批量设时
                </button>
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

          {/* 本阶段队伍栏 */}
          {allStageTeams.length > 0 && (
            <AvailableTeamsBar
              teams={allStageTeams}
              assignedNames={activeStageAssignedNames}
              isAdvanced={isAdvanced}
            />
          )}
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
          {/* 晋级确认面板：有下一阶段时始终显示，面板内展示完成进度 */}
          {(activeStage.type === 'ROUND_ROBIN' || activeStage.type === 'SWISS') && (() => {
            const sortedStages = [...stages].sort((a, b) => a.order - b.order);
            const currentIdx = sortedStages.findIndex((s) => s.stageId === activeStage.stageId);
            const nextStage = sortedStages[currentIdx + 1];
            if (!nextStage) return null;
            const totalGames = activeRounds.reduce((n, r) => n + r.matches.length, 0);
            const doneGames = activeRounds.reduce(
              (n, r) => n + r.matches.filter((g) => g.status === 'completed' || g.status === 'cancelled').length, 0
            );
            return (
              <AdvancementPanel
                currentStage={activeStage}
                nextStage={nextStage}
                activeRounds={activeRounds}
                totalGames={totalGames}
                doneGames={doneGames}
                onAdvance={(teams) => onAdvanceTeams(activeStage.stageId, nextStage.stageId, teams)}
              />
            );
          })()}
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
  nextStage,
  activeRounds,
  totalGames,
  doneGames,
  onAdvance,
}: {
  currentStage: TournamentStage;
  nextStage: TournamentStage;
  activeRounds: MatchRound[];
  totalGames: number;
  doneGames: number;
  onAdvance: (teams: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const allDone = totalGames > 0 && doneGames === totalGames;

  const groupedStandings = useMemo((): { label: string; standings: GroupStanding[]; quota: number }[] => {
    const winPts = currentStage.config.winPoints ?? 3;
    const drawPts = currentStage.config.drawPoints ?? 1;
    const lossPts = currentStage.config.lossPoints ?? 0;

    const groupCount = currentStage.group?.enabled ? currentStage.group.groupCount : 1;
    // 优先从 advancement 规则取每组名额，再回退到 teamsOut 均分
    const qualifierPerGroup =
      currentStage.advancement?.type === 'TOP_N_PER_GROUP'
        ? (currentStage.advancement.countPerGroup ?? 1)
        : currentStage.advancement?.type === 'GLOBAL_TOP_N'
          ? Math.ceil((currentStage.advancement.totalCount ?? currentStage.teamsOut) / Math.max(1, groupCount))
          : Math.ceil((currentStage.teamsOut ?? 1) / Math.max(1, groupCount));

    if (currentStage.type === 'SWISS') {
      return Array.from({ length: groupCount }, (_, g) => {
        const groupRounds = activeRounds.filter((r) => (r.groupIndex ?? 0) === g);
        const standings = computeSwissStandings(groupRounds, winPts, drawPts, lossPts);
        return {
          label: groupCount > 1 ? `第 ${g + 1} 组` : '总排名',
          standings,
          quota: groupCount > 1 ? qualifierPerGroup
            : (currentStage.advancement?.type === 'GLOBAL_TOP_N'
                ? (currentStage.advancement.totalCount ?? currentStage.teamsOut)
                : currentStage.teamsOut),
        };
      });
    }

    return Array.from({ length: groupCount }, (_, g) => {
      const standings = computeGroupStandings(activeRounds, g, winPts, drawPts, lossPts);
      return { label: groupCount > 1 ? `第 ${g + 1} 组` : '积分榜', standings, quota: qualifierPerGroup };
    });
  }, [currentStage, activeRounds]);

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
        <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
          <Trophy size={14} className={allDone ? 'text-amber-600' : 'text-slate-400'} />
          <span className={allDone ? 'text-amber-800' : 'text-slate-600'}>晋级管理</span>
          <span className={`text-sm font-normal ${allDone ? 'text-amber-600' : 'text-slate-400'}`}>
            → {nextStage.name}，计划晋级 {totalQuota} 队
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
              尚有 {totalGames - doneGames} 场比赛未完成，当前积分榜仅供参考，确认无误后再执行晋级。
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupedStandings.map(({ label, standings, quota }) => (
              <div key={label} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 text-sm font-bold text-slate-700 border-b border-slate-200 flex items-center justify-between">
                  <span>{label}</span>
                  <span className="text-slate-400 font-normal text-xs">晋级名额 {quota}</span>
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
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full shrink-0">晋级</span>
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
              已选 <span className="font-bold text-slate-700">{selected.size}</span> 支队伍 / 计划晋级 {totalQuota} 支
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
                确认晋级 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
