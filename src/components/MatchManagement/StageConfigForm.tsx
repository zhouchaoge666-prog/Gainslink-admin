import type { TournamentStage, StageFormat, AdvancementType, NextStageSeedingPolicy, AssignmentMode } from '../../data/mockData';
import { syncLegacyStageFields, formatRulesForType, defaultAdvancementForStage } from '../../data/mockData';
import NumericInput from './NumericInput';

interface StageConfigFormProps {
  stage: TournamentStage;
  stages: TournamentStage[];
  maxTeams: number;
  onChange: (stage: TournamentStage) => void;
}

const stageTypeOptions: { value: StageFormat; label: string }[] = [
  { value: 'ROUND_ROBIN', label: '循环赛' },
  { value: 'SINGLE_ELIMINATION', label: '单败淘汰赛' },
  { value: 'DOUBLE_ELIMINATION', label: '双败淘汰赛' },
  { value: 'SWISS', label: '瑞士轮' },
];

const boOptions: Array<1 | 2 | 3 | 5 | 7> = [1, 2, 3, 5, 7];
const assignmentModeOptions: { value: AssignmentMode; label: string }[] = [
  { value: 'MANUAL', label: '手动分组' },
  { value: 'RANDOM', label: '随机分组' },
  { value: 'BY_SEED_SNAKE', label: '蛇形分组' },
  { value: 'BY_SEED_BALANCED', label: '平衡种子' },
];
const advancementTypeOptions: { value: AdvancementType; label: string }[] = [
  { value: 'NONE', label: '无晋级（最终赛段）' },
  { value: 'TOP_N_PER_GROUP', label: '每组前 N 名' },
  { value: 'GLOBAL_TOP_N', label: '全局前 N 名' },
];
const seedingPolicyOptions: { value: NextStageSeedingPolicy; label: string }[] = [
  { value: 'PREVIOUS_STAGE_RANK', label: '按上一赛段排名' },
  { value: 'GROUP_CROSS', label: '跨组交叉' },
  { value: 'SNAKE_BY_RANK', label: '蛇形排入' },
  { value: 'MANUAL', label: '手动排入' },
];
const MAX_TEAMS_PER_GROUP = 32;

export default function StageConfigForm({ stage, stages, maxTeams, onChange }: StageConfigFormProps) {
  const stageIndex = stages.findIndex((s) => s.stageId === stage.stageId);
  const isFirstStage = stageIndex <= 0;
  const isLastStage = stageIndex === stages.length - 1;
  const nextStage = stages[stageIndex + 1];

  const update = (partial: Partial<TournamentStage>) => {
    const next: TournamentStage = { ...stage, ...partial };
    onChange(syncLegacyStageFields(next));
  };

  const updateEntrant = (partial: Partial<TournamentStage['entrant']>) => {
    update({ entrant: { ...stage.entrant, ...partial } });
  };

  const updateGroup = (partial: Partial<TournamentStage['group']>) => {
    const nextGroup = { ...stage.group, ...partial };
    if (nextGroup.enabled && partial.groupCount && !partial.teamsPerGroup) {
      nextGroup.teamsPerGroup = Math.max(2, Math.floor(stage.entrant.entrantCount / nextGroup.groupCount));
    }
    if (nextGroup.enabled && partial.teamsPerGroup && !partial.groupCount) {
      nextGroup.groupCount = Math.max(1, Math.floor(stage.entrant.entrantCount / nextGroup.teamsPerGroup));
    }
    update({ group: nextGroup });
  };

  const updateMatch = (partial: Partial<TournamentStage['match']>) => {
    const nextMatch = { ...stage.match, ...partial };
    const canDraw = stage.type === 'ROUND_ROBIN' || stage.type === 'SWISS';
    if (partial.defaultBestOf !== undefined) {
      // BO2 默认允许平局，其他 BO 不允许
      nextMatch.allowDraw = partial.defaultBestOf === 2 && canDraw;
    } else if (nextMatch.allowDraw && (!canDraw || nextMatch.defaultBestOf !== 2)) {
      nextMatch.allowDraw = false;
    }
    update({ match: nextMatch });
  };

  const updateScoring = (partial: Partial<NonNullable<TournamentStage['scoring']>>) => {
    update({ scoring: { ...(stage.scoring || { winPoints: 1, drawPoints: 0, lossPoints: 0, forfeitWinPoints: 1, forfeitLossPoints: 0 }), ...partial } });
  };

  const updateFormatRules = (partial: Partial<TournamentStage['formatRules']>) => {
    update({ formatRules: { ...stage.formatRules, ...partial } });
  };

  const updateAdvancement = (partial: Partial<NonNullable<TournamentStage['advancement']>>) => {
    const base = stage.advancement || { type: 'NONE', nextStageSeedingPolicy: 'MANUAL' };
    update({ advancement: { ...base, ...partial } as TournamentStage['advancement'] });
  };

  const handleTypeChange = (type: StageFormat) => {
    const formatRules = formatRulesForType(type, stage.formatRules);
    const canDraw = type === 'ROUND_ROBIN' || type === 'SWISS';
    const allowDraw = canDraw && stage.match.defaultBestOf === 2 ? true : false;
    const scoring = type === 'ROUND_ROBIN' || type === 'SWISS' ? stage.scoring : undefined;
    const advancement = isLastStage
      ? { type: 'NONE' as const, nextStageSeedingPolicy: 'MANUAL' as const }
      : defaultAdvancementForStage({ ...stage, type } as TournamentStage, false, nextStage?.stageId, nextStage?.entrant.entrantCount);
    update({
      type,
      match: { ...stage.match, allowDraw },
      scoring,
      formatRules,
      advancement,
    });
  };

  const handleEntrantCountChange = (value: number) => {
    const entrantCount = value;
    const group = { ...stage.group };
    if (group.enabled) {
      group.teamsPerGroup = Math.max(2, Math.floor(entrantCount / group.groupCount));
    } else {
      group.teamsPerGroup = entrantCount;
      group.groupCount = 1;
    }
    update({ entrant: { ...stage.entrant, entrantCount: value }, group });
  };

  const handleSyncAdvancement = () => {
    if (!nextStage) return;
    const target = nextStage.entrant.entrantCount;
    const groupCount = stage.group.enabled ? stage.group.groupCount : 1;
    if (stage.type === 'SWISS') {
      updateAdvancement({ type: 'GLOBAL_TOP_N', totalCount: target, countPerGroup: undefined });
    } else {
      const countPerGroup = Math.min(stage.group.teamsPerGroup, Math.max(1, Math.ceil(target / groupCount)));
      updateAdvancement({ type: 'TOP_N_PER_GROUP', countPerGroup, totalCount: undefined });
    }
  };

  const recommendedRounds = Math.max(1, Math.ceil(Math.log2(stage.entrant.entrantCount)));

  const totalAdvance =
    stage.advancement?.type === 'TOP_N_PER_GROUP'
      ? (stage.group.enabled ? stage.group.groupCount : 1) * (stage.advancement.countPerGroup || 0)
      : stage.advancement?.type === 'GLOBAL_TOP_N'
      ? stage.advancement.totalCount || 0
      : 0;

  const advanceCountMismatch = !isLastStage && nextStage && totalAdvance !== nextStage.entrant.entrantCount;

  return (
    <div className="p-3 space-y-4 border-t border-slate-100">
      <div>
        <label className="block text-xs text-slate-500 mb-1">赛段名称</label>
        <input
          type="text"
          value={stage.name}
          onChange={(e) => update({ name: e.target.value })}
          className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">赛制</label>
          <select
            value={stage.type}
            onChange={(e) => handleTypeChange(e.target.value as StageFormat)}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
          >
            {stageTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">BO 几</label>
          <select
            value={stage.match.defaultBestOf}
            onChange={(e) => updateMatch({ defaultBestOf: Number(e.target.value) as 1 | 2 | 3 | 5 | 7 })}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
          >
            {boOptions.map((f) => (
              <option key={f} value={f}>BO{f}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">参赛队伍数</label>
          <NumericInput
            value={stage.entrant.entrantCount}
            onChange={(value) => handleEntrantCountChange(value ?? maxTeams)}
            min={2}
            max={maxTeams}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">队伍来源</label>
          <select
            value={stage.entrant.source.type}
            disabled={isFirstStage}
            onChange={(e) => {
              const type = e.target.value as TournamentStage['entrant']['source']['type'];
              if (type === 'FROM_PREVIOUS_STAGE') {
                const prev = stages[stageIndex - 1];
                updateEntrant({ source: { type, previousStageId: prev?.stageId || '' } });
              } else {
                updateEntrant({ source: { type } });
              }
            }}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent disabled:bg-slate-50"
          >
            {isFirstStage ? (
              <>
                <option value="REGISTRATION">报名队伍</option>
                <option value="MANUAL">手动导入</option>
              </>
            ) : (
              <option value="FROM_PREVIOUS_STAGE">上一赛段晋级</option>
            )}
          </select>
        </div>
      </div>

      <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-700">分组配置</div>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={stage.group.enabled}
              onChange={(e) => updateGroup({ enabled: e.target.checked })}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            启用分组
          </label>
        </div>
        {stage.group.enabled && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">分组数</label>
              <NumericInput
                value={stage.group.groupCount}
                onChange={(value) => updateGroup({ groupCount: value ?? 1 })}
                min={1}
                max={Math.floor(stage.entrant.entrantCount / 2)}
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">每组队伍</label>
              <NumericInput
                value={stage.group.teamsPerGroup}
                onChange={(value) => updateGroup({ teamsPerGroup: value ?? 2 })}
                min={2}
                max={Math.min(MAX_TEAMS_PER_GROUP, stage.entrant.entrantCount)}
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] text-slate-500 mb-1">分组方式</label>
              <select
                value={stage.group.assignmentMode}
                onChange={(e) => updateGroup({ assignmentMode: e.target.value as AssignmentMode })}
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              >
                {assignmentModeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
        <div className="text-xs font-medium text-slate-700">比赛规则</div>
        {stage.match.defaultBestOf === 2 && (
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={stage.match.allowDraw}
              onChange={(e) => updateMatch({ allowDraw: e.target.checked })}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            允许平局
          </label>
        )}
        {(stage.type === 'ROUND_ROBIN' || stage.type === 'SWISS') && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">胜场积分</label>
              <NumericInput
                value={stage.scoring?.winPoints ?? 1}
                onChange={(value) => updateScoring({ winPoints: value ?? 1 })}
                min={0}
                className="w-full text-sm px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">平局积分</label>
              <NumericInput
                value={stage.scoring?.drawPoints ?? 0}
                onChange={(value) => updateScoring({ drawPoints: value ?? 0 })}
                min={0}
                className="w-full text-sm px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">败场积分</label>
              <NumericInput
                value={stage.scoring?.lossPoints ?? 0}
                onChange={(value) => updateScoring({ lossPoints: value ?? 0 })}
                min={0}
                className="w-full text-sm px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {stage.type === 'ROUND_ROBIN' && (
        <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
          <div className="text-xs font-medium text-slate-700">循环赛规则</div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">循环方式</label>
            <select
              value={stage.formatRules.roundRobin?.mode || 'SINGLE'}
              onChange={(e) =>
                updateFormatRules({
                  roundRobin: {
                    format: 'ROUND_ROBIN',
                    mode: e.target.value as 'SINGLE' | 'DOUBLE',
                  },
                })
              }
              className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
            >
              <option value="SINGLE">单循环</option>
              <option value="DOUBLE">双循环</option>
            </select>
          </div>
        </div>
      )}

      {stage.type === 'SWISS' && (
        <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
          <div className="text-xs font-medium text-slate-700">瑞士轮规则</div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">瑞士轮轮数（推荐 {recommendedRounds}）</label>
            <NumericInput
              value={stage.formatRules.swiss?.rounds || recommendedRounds}
              onChange={(value) =>
                updateFormatRules({
                  swiss: {
                    format: 'SWISS',
                    rounds: value ?? recommendedRounds,
                    round1Pairing: stage.formatRules.swiss?.round1Pairing || 'SEED_HIGH_LOW',
                    avoidRepeatOpponent: stage.formatRules.swiss?.avoidRepeatOpponent ?? true,
                    byePolicy: stage.formatRules.swiss?.byePolicy || 'LOWEST_SCORE_NO_PREVIOUS_BYE',
                  },
                })
              }
              min={1}
              className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">首轮配对</label>
            <select
              value={stage.formatRules.swiss?.round1Pairing || 'SEED_HIGH_LOW'}
              onChange={(e) =>
                updateFormatRules({
                  swiss: {
                    format: 'SWISS',
                    rounds: stage.formatRules.swiss?.rounds || recommendedRounds,
                    round1Pairing: e.target.value as 'RANDOM' | 'SEED_HIGH_LOW' | 'SEED_ADJACENT',
                    avoidRepeatOpponent: stage.formatRules.swiss?.avoidRepeatOpponent ?? true,
                    byePolicy: stage.formatRules.swiss?.byePolicy || 'LOWEST_SCORE_NO_PREVIOUS_BYE',
                  },
                })
              }
              className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
            >
              <option value="SEED_HIGH_LOW">高种子对低种子</option>
              <option value="SEED_ADJACENT">相邻种子</option>
              <option value="RANDOM">随机</option>
            </select>
          </div>
        </div>
      )}

      {stage.type === 'SINGLE_ELIMINATION' && (
        <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
          <div className="text-xs font-medium text-slate-700">单败淘汰规则</div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={stage.formatRules.singleElimination?.thirdPlaceMatch || false}
              onChange={(e) =>
                updateFormatRules({
                  singleElimination: {
                    format: 'SINGLE_ELIMINATION',
                    bracketSizePolicy: 'NEXT_POWER_OF_TWO',
                    thirdPlaceMatch: e.target.checked,
                    placementRankingPolicy: {
                      sortBy: stage.formatRules.singleElimination?.placementRankingPolicy?.sortBy || 'ELIMINATION_ROUND_THEN_SEED',
                    },
                  },
                })
              }
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            包含季军赛
          </label>
        </div>
      )}

      {stage.type === 'DOUBLE_ELIMINATION' && (
        <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
          <div className="text-xs font-medium text-slate-700">双败淘汰规则</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">总决赛 BO</label>
              <select
                value={stage.formatRules.doubleElimination?.grandFinalBestOf || 5}
                onChange={(e) =>
                  updateFormatRules({
                    doubleElimination: {
                      format: 'DOUBLE_ELIMINATION',
                      bracketSizePolicy: 'NEXT_POWER_OF_TWO',
                      grandFinalBestOf: Number(e.target.value) as 3 | 5 | 7,
                      grandFinalReset: stage.formatRules.doubleElimination?.grandFinalReset ?? false,
                      placementRankingPolicy: {
                        sortBy: stage.formatRules.doubleElimination?.placementRankingPolicy?.sortBy || 'ELIMINATION_ROUND_THEN_SEED',
                      },
                    },
                  })
                }
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              >
                <option value={3}>BO3</option>
                <option value={5}>BO5</option>
                <option value={7}>BO7</option>
              </select>
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={stage.formatRules.doubleElimination?.grandFinalReset || false}
                  onChange={(e) =>
                    updateFormatRules({
                      doubleElimination: {
                        format: 'DOUBLE_ELIMINATION',
                        bracketSizePolicy: 'NEXT_POWER_OF_TWO',
                        grandFinalBestOf: stage.formatRules.doubleElimination?.grandFinalBestOf || 5,
                        grandFinalReset: e.target.checked,
                        placementRankingPolicy: {
                          sortBy: stage.formatRules.doubleElimination?.placementRankingPolicy?.sortBy || 'ELIMINATION_ROUND_THEN_SEED',
                        },
                      },
                    })
                  }
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                总决赛重置局
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
        <div className="text-xs font-medium text-slate-700">晋级配置</div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">晋级方式</label>
          <select
            value={stage.advancement?.type || 'NONE'}
            disabled={isLastStage}
            onChange={(e) => {
              const type = e.target.value as AdvancementType;
              if (type === 'NONE') {
                updateAdvancement({ type, nextStageId: undefined });
              } else {
                updateAdvancement({
                  type,
                  nextStageId: nextStage?.stageId,
                  countPerGroup: type === 'TOP_N_PER_GROUP' ? 1 : undefined,
                  totalCount: type === 'GLOBAL_TOP_N' ? Math.max(2, Math.floor(stage.entrant.entrantCount / 2)) : undefined,
                });
              }
            }}
            className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent disabled:bg-slate-50"
          >
            {advancementTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {stage.advancement?.type === 'TOP_N_PER_GROUP' && (
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">每组晋级数</label>
            <NumericInput
              value={stage.advancement.countPerGroup || 1}
              onChange={(value) => updateAdvancement({ countPerGroup: value ?? 1 })}
              min={1}
              max={stage.group.teamsPerGroup}
              className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
            />
          </div>
        )}

        {stage.advancement?.type === 'GLOBAL_TOP_N' && (
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">总晋级数</label>
            <NumericInput
              value={stage.advancement.totalCount || 1}
              onChange={(value) => updateAdvancement({ totalCount: value ?? 1 })}
              min={1}
              max={stage.entrant.entrantCount}
              className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
            />
          </div>
        )}

        {stage.advancement && stage.advancement.type !== 'NONE' && (
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">晋级后种子排入方式</label>
            <select
              value={stage.advancement.nextStageSeedingPolicy || 'MANUAL'}
              onChange={(e) => updateAdvancement({ nextStageSeedingPolicy: e.target.value as NextStageSeedingPolicy })}
              className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
            >
              {seedingPolicyOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="text-[10px] text-slate-500 space-y-1">
          <div>本赛段晋级总数：<span className="font-medium text-slate-700">{totalAdvance} 队</span></div>
          {!isLastStage && nextStage && (
            <div className={advanceCountMismatch ? 'text-red-600' : 'text-emerald-600'}>
              下一赛段需要：{nextStage.entrant.entrantCount} 队
              {advanceCountMismatch && '（不一致，请调整晋级数）'}
              {advanceCountMismatch && (
                <button
                  type="button"
                  onClick={handleSyncAdvancement}
                  className="ml-2 text-[10px] px-1.5 py-0.5 bg-primary text-white rounded hover:bg-primary/90"
                >
                  自动同步
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
