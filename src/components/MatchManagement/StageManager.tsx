import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, AlertCircle, Play, ArrowRight } from 'lucide-react';
import type { MatchItem, MatchRound, TournamentStage } from '../../data/mockData';
import { applyTemplate, validateStages, generateMatchRounds, computeRoundRobinStandings, createDefaultStage } from '../../data/mockData';
import { useMatch, useMatchActions } from '../../context/matchHooks';
import StageConfigForm from './StageConfigForm';

const stageTypeOptions: { value: TournamentStage['type']; label: string }[] = [
  { value: 'ROUND_ROBIN', label: '循环赛' },
  { value: 'SINGLE_ELIMINATION', label: '单败淘汰赛' },
  { value: 'DOUBLE_ELIMINATION', label: '双败淘汰赛' },
  { value: 'SWISS', label: '瑞士轮' },
];

const templateCards = [
  { key: '单败淘汰', title: '单败淘汰', desc: 'N 队单场定胜负，快速决出冠军' },
  { key: '小组赛+淘汰', title: '小组赛+淘汰', desc: '先分组循环，再晋级淘汰赛' },
  { key: '循环赛', title: '循环赛', desc: '全组互相交手，按积分排名' },
  { key: '双败淘汰', title: '双败淘汰', desc: '胜者组+败者组，容错率更高' },
  { key: '瑞士轮', title: '瑞士轮', desc: '同战绩匹配，公平筛选强手' },
];

const MAX_STAGES = 3;

interface StageManagerProps {
  onSave?: (match: MatchItem) => void;
  onNavigateToCompetition?: () => void;
}

export default function StageManager({ onSave, onNavigateToCompetition }: StageManagerProps) {
  const { match, rounds } = useMatch();
  const { updateStages, showToast } = useMatchActions();
  const maxTeams = match?.maxTeams || 16;

  const [draftStages, setDraftStages] = useState<TournamentStage[]>(match?.stages || []);
  const [previewRounds, setPreviewRounds] = useState<MatchRound[]>(rounds);
  const [activeStageId, setActiveStageId] = useState<string | null>(match?.stages?.[0]?.stageId || null);
  const [expandedId, setExpandedId] = useState<string | null>(match?.stages?.[0]?.stageId || null);

  // 外部状态变化时同步本地草稿
  const [prevStages, setPrevStages] = useState(match?.stages);
  const [prevRounds, setPrevRounds] = useState(rounds);
  if (match?.stages !== prevStages || rounds !== prevRounds) {
    const savedStages = match?.stages || [];
    setPrevStages(match?.stages);
    setPrevRounds(rounds);
    setDraftStages(savedStages);
    setPreviewRounds(rounds);
    setActiveStageId((prev) => prev || savedStages[0]?.stageId || null);
    setExpandedId((prev) => prev || savedStages[0]?.stageId || null);
  }

  const stages = draftStages;
  const validationError = useMemo(() => validateStages(stages, maxTeams, false), [stages, maxTeams]);

  const activeStage = stages.find((s) => s.stageId === activeStageId) || stages[0];

  const activeRounds = activeStage
    ? previewRounds.filter((r) => r.roundName.startsWith(`${activeStage.name} ·`))
    : previewRounds;

  const handleUpdateStage = (stageId: string, updates: Partial<TournamentStage>) => {
    setDraftStages(stages.map((s) => (s.stageId === stageId ? { ...s, ...updates } : s)));
  };

  const handleSaveConfig = () => {
    if (!match) return;
    updateStages(stages);
    onSave?.({ ...match, stages });
    showToast('阶段配置已保存', 'success');
  };

  const handleGeneratePreview = () => {
    if (!match) return;
    const hasResults = rounds.some((r) => r.matches.some((g) => g.scoreA !== null && g.scoreA !== undefined));
    if (hasResults && !window.confirm('重新生成对阵图会清空已录入的比赛结果，确认继续？')) return;
    const nextRounds = generateMatchRounds(match, stages);
    setPreviewRounds(nextRounds);
    updateStages(stages);
    onSave?.({ ...match, stages });
    showToast('已生成对阵图并保存阶段配置', 'success');
  };

  const handleAddStage = () => {
    if (stages.length >= MAX_STAGES) {
      showToast(`最多支持 ${MAX_STAGES} 个阶段`, 'error');
      return;
    }
    const order = stages.length + 1;
    const previousStageId = stages.length > 0 ? stages[stages.length - 1].stageId : undefined;
    const entrantCount = previousStageId ? stages[stages.length - 1].teamsOut : maxTeams;
    const newStage = createDefaultStage(order, entrantCount, previousStageId);
    const next = [...stages, newStage];
    setDraftStages(next);
    setActiveStageId(newStage.stageId);
    setExpandedId(newStage.stageId);
  };

  const handleRemoveStage = (stageId: string) => {
    const next = stages.filter((s) => s.stageId !== stageId);
    setDraftStages(next);
    if (activeStageId === stageId) setActiveStageId(next[0]?.stageId || null);
    if (expandedId === stageId) setExpandedId(next[0]?.stageId || null);
  };

  const handleMoveStage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= stages.length) return;
    const next = [...stages];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    next.forEach((s, i) => (s.order = i + 1));
    setDraftStages(next);
  };

  const handleApplyTemplate = (key: string) => {
    if (stages.length >= MAX_STAGES) {
      showToast(`最多支持 ${MAX_STAGES} 个阶段，无法添加模板`, 'error');
      return;
    }
    const newStages = applyTemplate(key, maxTeams);
    const remaining = MAX_STAGES - stages.length;
    const trimmed = newStages.slice(0, remaining);
    if (trimmed.length < newStages.length) {
      showToast(`模板阶段数超过限制，仅添加前 ${trimmed.length} 个阶段`, 'info');
    }
    const next = [...stages, ...trimmed];
    setDraftStages(next);
    setActiveStageId(trimmed[trimmed.length - 1]?.stageId || null);
    setExpandedId(trimmed[trimmed.length - 1]?.stageId || null);
    showToast(`已添加「${key}」模板，点击生成对阵图预览`, 'success');
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="text-sm font-medium text-slate-800">阶段编排</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{stages.length}/{MAX_STAGES}</span>
            <select
              className="text-xs px-2 py-1.5 border border-slate-200 rounded-lg bg-transparent outline-none focus:border-primary disabled:opacity-50"
              disabled={stages.length >= MAX_STAGES}
              onChange={(e) => {
                const key = e.target.value;
                if (key) handleApplyTemplate(key);
                e.target.value = '';
              }}
            >
              <option value="">快速添加常用组合</option>
              {templateCards.map((t) => (
                <option key={t.key} value={t.key}>{t.title}</option>
              ))}
            </select>
            <button
              onClick={handleAddStage}
              disabled={stages.length >= MAX_STAGES}
              className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              + 添加阶段
            </button>
          </div>
        </div>

        {stages.length === 0 && (
          <div className="text-sm text-slate-400 py-6 text-center">点击「添加阶段」或选择上方快捷组合开始配置</div>
        )}

        <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 mt-4">
          {stages.map((stage, index) => {
            const isExpanded = expandedId === stage.stageId;
            return (
              <div
                key={stage.stageId}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  activeStageId === stage.stageId ? 'border-primary' : 'border-slate-200'
                }`}
              >
                <div
                  className="flex items-center justify-between px-3 py-2.5 bg-slate-50 cursor-pointer"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : stage.stageId);
                    setActiveStageId(stage.stageId);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">#{index + 1}</span>
                    <span className="text-sm font-medium text-slate-800">{stage.name}</span>
                    <span className="text-xs text-slate-400">
                      {stage.teamsIn} 进 → {stage.teamsOut} 出 · {stageTypeOptions.find((o) => o.value === stage.type)?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveStage(index, -1); }}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveStage(index, 1); }}
                      disabled={index === stages.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveStage(stage.stageId); }}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <StageConfigForm
                    stage={stage}
                    stages={stages}
                    maxTeams={maxTeams}
                    onChange={(updated) => handleUpdateStage(stage.stageId, updated)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {validationError && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3 mt-4">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {validationError}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="text-sm font-medium text-slate-800">对阵预览</div>
          <div className="flex items-center gap-2">
            {previewRounds.length > 0 && onNavigateToCompetition && (
              <button
                onClick={onNavigateToCompetition}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                前往比赛管理
                <ArrowRight size={12} />
              </button>
            )}
            <button
              onClick={handleSaveConfig}
              disabled={stages.length === 0}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              保存配置
            </button>
            <button
              onClick={handleGeneratePreview}
              disabled={stages.length === 0}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Play size={12} />
              生成对阵图
            </button>
          </div>
        </div>

        {stages.length > 1 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {stages.map((stage) => (
              <button
                key={stage.stageId}
                onClick={() => setActiveStageId(stage.stageId)}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  activeStageId === stage.stageId
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {stage.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 bg-slate-50 rounded-xl p-4 min-h-[420px]">
          {!activeStage ? (
            <div className="text-sm text-slate-400">请选择或添加阶段</div>
          ) : previewRounds.length === 0 ? (
            <div className="text-sm text-slate-400 text-center pt-20">
              配置完成后点击右上角「生成对阵图」预览
            </div>
          ) : activeRounds.length === 0 ? (
            <div className="text-sm text-slate-400">当前参数无法生成对阵，请检查阶段配置</div>
          ) : (
            <StagePreview stage={activeStage} rounds={activeRounds} />
          )}
        </div>
      </div>
    </div>
  );
}

function StagePreview({ stage, rounds }: { stage: TournamentStage; rounds: MatchRound[] }) {
  if (rounds.length === 0) return <div className="text-sm text-slate-400">无对阵数据</div>;

  switch (stage.type) {
    case 'ROUND_ROBIN':
      return (
        <RoundRobinPreview
          rounds={rounds}
          winPoints={stage.config.winPoints ?? 3}
          drawPoints={stage.config.drawPoints ?? 1}
          lossPoints={stage.config.lossPoints ?? 0}
        />
      );
    case 'SINGLE_ELIMINATION':
      return <EliminationPreview rounds={rounds} />;
    case 'DOUBLE_ELIMINATION':
      return <DoubleEliminationPreview rounds={rounds} />;
    case 'SWISS':
      return <SwissPreview rounds={rounds} />;
    default:
      return null;
  }
}

function groupRoundsByGroup(rounds: MatchRound[]): [string, MatchRound[]][] {
  const map = new Map<string, MatchRound[]>();
  rounds.forEach((r) => {
    const parts = r.roundName.split(' · ');
    const group = parts[1] || '默认组';
    if (!map.has(group)) map.set(group, []);
    map.get(group)!.push(r);
  });
  return Array.from(map.entries()).map(([label, list]) => [label, list.sort((a, b) => a.roundNumber - b.roundNumber)]);
}

function RoundRobinPreview({ rounds, winPoints = 3, drawPoints = 1, lossPoints = 0 }: { rounds: MatchRound[]; winPoints?: number; drawPoints?: number; lossPoints?: number }) {
  const groups = groupRoundsByGroup(rounds);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {groups.map(([label, groupRounds]) => {
        const teamSet = new Set<string>();
        groupRounds.forEach((r) => r.matches.forEach((g) => { teamSet.add(g.teamA); teamSet.add(g.teamB); }));
        const teams = Array.from(teamSet);
        const findGame = (a: string, b: string) => {
          for (const r of groupRounds) {
            for (const g of r.matches) {
              if ((g.teamA === a && g.teamB === b) || (g.teamA === b && g.teamB === a)) return g;
            }
          }
          return null;
        };
        return (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-slate-700">{label}</div>
              <div className="text-[10px] text-slate-400">积分规则：胜 {winPoints} / 平 {drawPoints} / 负 {lossPoints}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-1.5 bg-slate-50 border border-slate-100 text-slate-500 sticky left-0">队伍</th>
                    {teams.map((t) => <th key={t} className="p-1.5 bg-slate-50 border border-slate-100 text-slate-500 min-w-[56px]">{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {teams.map((row) => (
                    <tr key={row}>
                      <td className="p-1.5 border border-slate-100 text-slate-600 sticky left-0 bg-white font-medium">{row}</td>
                      {teams.map((col) => {
                        if (row === col) return <td key={col} className="p-1.5 border border-slate-100 text-center text-slate-300">-</td>;
                        const g = findGame(row, col);
                        const content = g && g.status === 'completed' && g.scoreA !== undefined && g.scoreB !== undefined
                          ? `${g.teamA === row ? g.scoreA : g.scoreB}:${g.teamA === row ? g.scoreB : g.scoreA}`
                          : (g ? 'VS' : '');
                        return <td key={col} className="p-1.5 border border-slate-100 text-center text-slate-500">{content}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {<StandingPreview
              rounds={groupRounds}
              winPoints={winPoints}
              drawPoints={drawPoints}
              lossPoints={lossPoints}
            />}
          </div>
        );
      })}
    </div>
  );
}

function StandingPreview({ rounds, winPoints, drawPoints, lossPoints }: { rounds: MatchRound[]; winPoints: number; drawPoints: number; lossPoints: number }) {
  const standings = computeRoundRobinStandings(rounds, winPoints, drawPoints, lossPoints);
  if (standings.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-slate-700">积分榜预览</div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {['#', '队伍', '赛', '胜', '平', '负', '积分'].map((h) => (
                <th key={h} className="p-1.5 border border-slate-100 text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr key={s.teamName}>
                <td className="p-1.5 border border-slate-100 text-center text-slate-500">{i + 1}</td>
                <td className="p-1.5 border border-slate-100 text-slate-700 font-medium">{s.teamName}</td>
                <td className="p-1.5 border border-slate-100 text-center text-slate-600">{s.played}</td>
                <td className="p-1.5 border border-slate-100 text-center text-slate-600">{s.wins}</td>
                <td className="p-1.5 border border-slate-100 text-center text-slate-600">{s.draws}</td>
                <td className="p-1.5 border border-slate-100 text-center text-slate-600">{s.losses}</td>
                <td className="p-1.5 border border-slate-100 text-center font-medium text-primary">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EliminationTree({ rounds, label }: { rounds: MatchRound[]; label: string }) {
  const sorted = [...rounds].sort((a, b) => a.roundNumber - b.roundNumber);
  const cardHeight = 56;
  const gapY = 24;
  const colGap = 48;
  const maxMatches = Math.max(...sorted.map((r) => r.matches.length), 1);
  const containerHeight = maxMatches * cardHeight + (maxMatches - 1) * gapY;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="text-xs font-medium text-slate-700">{label}</div>
      <div className="relative flex gap-4 overflow-x-auto pb-2" style={{ minHeight: containerHeight + 40 }}>
        <svg className="absolute top-8 left-0 h-full pointer-events-none" style={{ minWidth: sorted.length * (160 + colGap) }}>
          {sorted.map((round, ri) => {
            if (ri === sorted.length - 1) return null;
            const nextRound = sorted[ri + 1];
            const colWidth = 160;
            const x1 = ri * (colWidth + colGap) + colWidth;
            const x2 = x1 + colGap;
            return round.matches.map((game, gi) => {
              const y1 = round.matches.length === 1 ? containerHeight / 2 : gi * (containerHeight / (round.matches.length || 1)) + cardHeight / 2;
              const nextIndex = Math.floor(gi / 2);
              const y2 = nextRound.matches.length === 1 ? containerHeight / 2 : nextIndex * (containerHeight / (nextRound.matches.length || 1)) + cardHeight / 2;
              return (
                <path
                  key={`${round.roundId}-${game.gameId}`}
                  d={`M${x1},${y1} C${x1 + colGap / 2},${y1} ${x1 + colGap / 2},${y2} ${x2},${y2}`}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth={1.5}
                />
              );
            });
          })}
        </svg>
        {sorted.map((round) => (
          <div
            key={round.roundId}
            className="flex flex-col justify-around shrink-0 z-10"
            style={{ width: 160, minHeight: containerHeight }}
          >
            <div className="text-xs text-center text-slate-500 mb-2">{round.roundName.split(' · ').pop()}</div>
            {round.matches.map((game) => (
              <div
                key={game.gameId}
                className="bg-white border border-slate-200 rounded-lg p-2 space-y-1 shadow-sm"
                style={{ height: cardHeight }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 truncate flex-1">{game.teamA}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-50 px-1 rounded ml-1">{game.seedA || ''}</span>
                </div>
                <div className="text-[10px] text-slate-300 text-center leading-none">VS · {game.format || 'BO?'}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 truncate flex-1">{game.teamB}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-50 px-1 rounded ml-1">{game.seedB || ''}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EliminationPreview({ rounds }: { rounds: MatchRound[] }) {
  const groups = groupRoundsByGroup(rounds);
  return (
    <div className="space-y-6">
      {groups.map(([label, groupRounds]) => (
        <EliminationTree key={label} rounds={groupRounds} label={label} />
      ))}
    </div>
  );
}

function DoubleEliminationPreview({ rounds }: { rounds: MatchRound[] }) {
  const groups = groupRoundsByGroup(rounds);
  return (
    <div className="space-y-6">
      {groups.map(([label, groupRounds]) => {
        const wb = groupRounds.filter((r) => !r.roundName.includes('败者'));
        const lb = groupRounds.filter((r) => r.roundName.includes('败者'));
        return (
          <div key={label} className="space-y-4">
            <div className="text-xs font-medium text-slate-700">{label}</div>
            {wb.length > 0 && <EliminationTree rounds={wb} label="胜者组" />}
            {lb.length > 0 && <EliminationTree rounds={lb} label="败者组" />}
            {wb.length === 0 && lb.length === 0 && <EliminationTree rounds={groupRounds} label="对阵图" />}
          </div>
        );
      })}
    </div>
  );
}

function SwissPreview({ rounds }: { rounds: MatchRound[] }) {
  const groups = groupRoundsByGroup(rounds);
  return (
    <div className="space-y-4">
      {groups.map(([label, groupRounds]) => (
        <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="text-xs font-medium text-slate-700">{label}</div>
          <div className="space-y-3">
            {groupRounds.map((round) => (
              <div key={round.roundId}>
                <div className="text-xs text-slate-500 mb-2">{round.roundName.split(' · ').pop()}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {round.matches.map((game) => (
                    <div key={game.gameId} className="flex items-center justify-between text-xs bg-slate-50 rounded px-2 py-1.5 border border-slate-100">
                      <span className="text-slate-600 truncate flex-1 text-right pr-2">{game.teamA}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">VS</span>
                      <span className="text-slate-600 truncate flex-1 pl-2">{game.teamB}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
