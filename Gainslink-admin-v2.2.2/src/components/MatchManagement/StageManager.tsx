import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, AlertCircle, Play, ArrowRight } from 'lucide-react';
import type { MatchItem, MatchRound, TournamentStage } from '../../data/mockData';
import { applyTemplate, validateStages, generateMatchRounds, createDefaultStage } from '../../data/mockData';
import { useMatch, useMatchActions } from '../../context/matchHooks';
import StageConfigForm from './StageConfigForm';
import EliminationBracket from './bracket/EliminationBracket';
import RoundRobinBracket from './bracket/RoundRobinBracket';
import SwissBracket from './bracket/SwissBracket';

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

// 预览直接复用比赛管理的对阵图组件，保证两者完全一致
const NOOP = () => {};

function StagePreview({ stage, rounds }: { stage: TournamentStage; rounds: MatchRound[] }) {
  if (rounds.length === 0) return <div className="text-sm text-slate-400">无对阵数据</div>;

  switch (stage.type) {
    case 'ROUND_ROBIN':
      return (
        <div className="pointer-events-none">
          <RoundRobinBracket
            rounds={rounds}
            availableTeams={[]}
            onUpdateGame={NOOP}
            winPoints={stage.config.winPoints ?? 3}
            drawPoints={stage.config.drawPoints ?? 1}
            lossPoints={stage.config.lossPoints ?? 0}
          />
        </div>
      );
    case 'SINGLE_ELIMINATION':
      return (
        <div className="pointer-events-none">
          <EliminationBracket
            rounds={rounds}
            availableTeams={[]}
            onUpdateGame={NOOP}
            onAssignTeam={NOOP}
            previewMode
          />
        </div>
      );
    case 'DOUBLE_ELIMINATION':
      return (
        <div className="pointer-events-none">
          <EliminationBracket
            rounds={rounds}
            availableTeams={[]}
            onUpdateGame={NOOP}
            onAssignTeam={NOOP}
            variant="double"
            previewMode
          />
        </div>
      );
    case 'SWISS':
      return (
        <div className="pointer-events-none">
          <SwissBracket
            rounds={rounds}
            availableTeams={[]}
            stage={stage}
            onUpdateGame={NOOP}
            onPairNextRound={NOOP}
          />
        </div>
      );
    default:
      return null;
  }
}
