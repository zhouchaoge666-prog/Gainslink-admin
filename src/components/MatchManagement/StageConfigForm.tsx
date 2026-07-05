import type { TournamentStage, StageFormat, AdvancementType, NextStageSeedingPolicy, AssignmentMode, AdvancementConfig } from '../../data/mockData';
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
  { value: 'FREE', label: '自由排布' },
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
    update({ scoring: { ...(stage.scoring || { winPoints: 3, drawPoints: 1, lossPoints: 0, forfeitWinPoints: 3, forfeitLossPoints: 0 }), ...partial } });
  };

  const updateFormatRules = (partial: Partial<TournamentStage['formatRules']>) => {
    update({ formatRules: { ...stage.formatRules, ...partial } });
  };

  const handleTypeChange = (type: StageFormat) => {
    const formatRules = formatRulesForType(type, stage.formatRules);
    const canDraw = type === 'ROUND_ROBIN' || type === 'SWISS';
    const allowDraw = canDraw && stage.match.defaultBestOf === 2 ? true : false;
    const scoring = type === 'ROUND_ROBIN' || type === 'SWISS' || type === 'FREE' ? stage.scoring : undefined;
    const advancement = isLastStage
      ? (stage.advancement || [])
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

  const recommendedRounds = Math.max(1, Math.ceil(Math.log2(stage.entrant.entrantCount)));

  // 兼容旧格式：确保 advancement 始终是数组，并过滤掉 NONE 类型
  const routes = Array.isArray(stage.advancement)
    ? stage.advancement.filter((r) => r.type !== 'NONE')
    : [];
  const gc = stage.group.enabled ? stage.group.groupCount : 1;
  const totalAdvance = routes.reduce((sum, r) => {
    if (r.type === 'TOP_N_PER_GROUP') return sum + gc * (r.countPerGroup || 0);
    if (r.type === 'GLOBAL_TOP_N') return sum + (r.totalCount || 0);
    return sum;
  }, 0);

  const updateRoute = (idx: number, partial: Partial<AdvancementConfig>) => {
    const next = [...routes];
    next[idx] = { ...next[idx], ...partial };
    update({ advancement: next });
  };

  const addRoute = () => {
    const defaultNextStageId = !isLastStage ? nextStage?.stageId : undefined;
    const newRoute: AdvancementConfig = stage.type === 'SWISS'
      ? { type: 'GLOBAL_TOP_N', nextStageId: defaultNextStageId, totalCount: Math.max(2, Math.floor(stage.entrant.entrantCount / 2)), nextStageSeedingPolicy: 'PREVIOUS_STAGE_RANK' }
      : { type: 'TOP_N_PER_GROUP', nextStageId: defaultNextStageId, countPerGroup: Math.max(1, Math.floor(stage.group.teamsPerGroup / 2)), nextStageSeedingPolicy: 'PREVIOUS_STAGE_RANK' };
    update({ advancement: [...routes, newRoute] });
  };

  const removeRoute = (idx: number) => {
    const next = [...routes];
    next.splice(idx, 1);
    update({ advancement: next });
  };

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

      {stage.type === 'FREE' && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
          <span className="mt-0.5 shrink-0">ℹ️</span>
          <span>自由排布模式：无固定赛制结构，可在比赛管理中手动创建任意对阵。默认 BO 将作为新建比赛的初始值。</span>
        </div>
      )}

      {stage.type === 'FREE' && (
        <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className="block text-xs text-slate-500 mb-1">参赛人数（可选）</label>
            <NumericInput
              value={stage.entrant.entrantCount || 0}
              onChange={(value) => updateEntrant({ entrantCount: value ?? 0 })}
              min={0}
              className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
            />
            <div className="text-[10px] text-slate-400 mt-0.5">0 = 不限</div>
          </div>
        </div>
      )}


      {stage.type !== 'FREE' && <div className="grid grid-cols-2 gap-3">
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
      </div>}

      {stage.type !== 'FREE' && <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
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
      </div>}

      {(stage.type === 'FREE' || stage.match.defaultBestOf === 2 || stage.type === 'ROUND_ROBIN' || stage.type === 'SWISS') && (
        <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
          <div className="text-xs font-medium text-slate-700">比赛规则</div>
          {stage.match.defaultBestOf === 2 && stage.type !== 'FREE' && (
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
          {(stage.type === 'ROUND_ROBIN' || stage.type === 'SWISS' || stage.type === 'FREE') && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">胜场积分</label>
                <NumericInput
                  value={stage.scoring?.winPoints ?? 3}
                  onChange={(value) => updateScoring({ winPoints: value ?? 3 })}
                  min={0}
                  className="w-full text-sm px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">平局积分</label>
                <NumericInput
                  value={stage.scoring?.drawPoints ?? 1}
                  onChange={(value) => updateScoring({ drawPoints: value ?? 1 })}
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
      )}

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

      {!isLastStage && (() => {
        const route = routes[0] || null;
        const currentType = route ? route.type : 'NONE';
        const routeCount = route
          ? (route.type === 'TOP_N_PER_GROUP' ? gc * (route.countPerGroup || 0) : (route.totalCount || 0))
          : 0;
        const targetStage = route ? stages.find((s) => s.stageId === route.nextStageId) : null;
        const mismatch = targetStage && routeCount !== targetStage.entrant.entrantCount;

        const handleTypeChange = (type: string) => {
          if (type === 'NONE') {
            update({ advancement: [] });
          } else {
            const defaultNextStageId = nextStage?.stageId;
            if (!route) {
              const newRoute: AdvancementConfig = type === 'TOP_N_PER_GROUP'
                ? { type: 'TOP_N_PER_GROUP', nextStageId: defaultNextStageId, countPerGroup: 1, nextStageSeedingPolicy: 'PREVIOUS_STAGE_RANK' }
                : { type: 'GLOBAL_TOP_N', nextStageId: defaultNextStageId, totalCount: 2, nextStageSeedingPolicy: 'PREVIOUS_STAGE_RANK' };
              update({ advancement: [newRoute] });
            } else {
              updateRoute(0, { type: type as AdvancementType });
            }
          }
        };

        return (
          <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/50">
            <div className="text-xs font-medium text-slate-700">晋级管理</div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">晋级方式</label>
                <select
                  value={currentType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full text-sm px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                >
                  <option value="NONE">不设定晋级</option>
                  {stage.type !== 'FREE' && <option value="TOP_N_PER_GROUP">每组前 N 名</option>}
                  <option value="GLOBAL_TOP_N">全局前 N 名</option>
                </select>
              </div>
              {route && (
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">
                    {route.type === 'TOP_N_PER_GROUP' ? '每组名额' : '总名额'}
                  </label>
                  <NumericInput
                    value={route.type === 'TOP_N_PER_GROUP' ? (route.countPerGroup ?? 1) : (route.totalCount ?? 1)}
                    onChange={(value) => updateRoute(0, route.type === 'TOP_N_PER_GROUP'
                      ? { countPerGroup: value ?? 1 }
                      : { totalCount: value ?? 1 })}
                    min={1}
                    max={route.type === 'TOP_N_PER_GROUP' ? stage.group.teamsPerGroup : (stage.entrant.entrantCount || 999)}
                    className="w-full text-sm px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>

            {route && (
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">目标赛段</label>
                <select
                  value={route.nextStageId || ''}
                  onChange={(e) => updateRoute(0, { nextStageId: e.target.value || undefined })}
                  className="w-full text-sm px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                >
                  <option value="">— 选择目标赛段 —</option>
                  {stages.filter((s) => s.stageId !== stage.stageId).map((s) => (
                    <option key={s.stageId} value={s.stageId}>
                      {s.name}{s.order <= stage.order ? ' ↩ 较早阶段' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {route && (
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">种子排入方式</label>
                <select
                  value={route.nextStageSeedingPolicy || 'MANUAL'}
                  onChange={(e) => updateRoute(0, { nextStageSeedingPolicy: e.target.value as NextStageSeedingPolicy })}
                  className="w-full text-sm px-2 py-1 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                >
                  {seedingPolicyOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}

            {route && (
              <div className={`text-[10px] ${mismatch ? 'text-amber-600' : 'text-slate-400'}`}>
                {route.type === 'TOP_N_PER_GROUP'
                  ? `每组前 ${route.countPerGroup ?? 1} 名，共 ${routeCount} 队`
                  : `全局前 ${routeCount} 队`}
                {targetStage && ` → ${targetStage.name}（需 ${targetStage.entrant.entrantCount} 队${mismatch ? '，数量不一致' : ''}）`}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
