import { useState, useMemo, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  CalendarDays,
  Users,
  MapPin,
  Coins,
  ImageIcon,
  Award,
  CheckCircle2,
  AlertCircle,
  Save,
  Upload,
  X,
  Play,
} from 'lucide-react';
import type { MatchItem, MatchRound, TournamentStage } from '../../data/mockData';
import { organizerData, generateMatchRounds, applyTemplate, validateStages, createDefaultStage } from '../../data/mockData';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import StageConfigForm from './StageConfigForm';

interface MatchCreateFlowProps {
  onSave: (match: MatchItem, publish: boolean) => void;
  onCancel: () => void;
}

const games = ['MLBB', 'Dota 2', 'PUBG', 'eFootball'];
const brackets = ['单败淘汰', '小组赛+淘汰', '循环赛', '双败淘汰', '瑞士轮'];
const teamSizeOptions = [4, 8, 16, 32, 64, 128, 256];

function parseDateInput(value: string): Date | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const year = new Date().getFullYear();
  let date: Date | undefined;
  if (/^\d{2}-\d{2}$/.test(trimmed)) {
    date = new Date(`${year}-${trimmed.slice(0, 2)}-${trimmed.slice(3, 5)}T00:00:00`);
  } else if (/^\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(trimmed)) {
    date = new Date(`${year}-${trimmed.slice(0, 2)}-${trimmed.slice(3, 5)}T${trimmed.slice(6, 8)}:${trimmed.slice(9, 11)}:00`);
  } else if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    date = new Date(trimmed);
  }
  return date && !Number.isNaN(date.getTime()) ? date : undefined;
}

const stageTypeOptions: { value: TournamentStage['type']; label: string }[] = [
  { value: 'ROUND_ROBIN', label: '循环赛' },
  { value: 'SINGLE_ELIMINATION', label: '单败淘汰赛' },
  { value: 'DOUBLE_ELIMINATION', label: '双败淘汰赛' },
  { value: 'SWISS', label: '瑞士轮' },
  { value: 'FREE', label: '自由排布' },
];

const templateCards = [
  { key: '单败淘汰', title: '单败淘汰', desc: 'N 队单场定胜负，快速决出冠军' },
  { key: '小组赛+淘汰', title: '小组赛+淘汰', desc: '先分组循环，再晋级淘汰赛' },
  { key: '循环赛', title: '循环赛', desc: '全组互相交手，按积分排名' },
  { key: '双败淘汰', title: '双败淘汰', desc: '胜者组+败者组，容错率更高' },
  { key: '瑞士轮', title: '瑞士轮', desc: '同战绩匹配，公平筛选强手' },
];

const MAX_STAGES = 3;

const emptyDraft: Partial<MatchItem> = {
  game: games[0],
  bracket: brackets[0],
  status: 'draft',
  signed: 0,
  pendingAudit: 0,
  approved: 0,
  rejected: 0,
  auditRequired: false,
  entryFee: 0,
  pointsPool: 0,
  prizeAmount: '',
  location: '线上',
  tags: [],
  maxTeams: 16,
  cap: 16,
  stages: applyTemplate(brackets[0], 16),
};

export default function MatchCreateFlow({ onSave, onCancel }: MatchCreateFlowProps) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Partial<MatchItem>>(emptyDraft);
  // 稳定的草稿 ID，整个创建流程共用一个，避免多次保存产生重复条目
  const draftIdRef = useRef(`#M${Math.floor(1000 + Math.random() * 9000)}`);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const [previewRounds, setPreviewRounds] = useState<MatchRound[]>([]);

  const updateField = <K extends keyof MatchItem>(field: K, value: MatchItem[K]) => {
    setDraft((prev) => {
      const next: Partial<MatchItem> = { ...prev, [field]: value };
      if (field === 'maxTeams' || field === 'bracket') {
        const maxTeams = field === 'maxTeams' ? Number(value) : (next.maxTeams || 16);
        const bracket = field === 'bracket' ? String(value) : (next.bracket || brackets[0]);
        next.stages = applyTemplate(bracket, maxTeams);
      }
      return next;
    });
    if (field === 'maxTeams' || field === 'bracket') {
      setPreviewRounds([]);
    }
  };

  const handleGeneratePreview = useCallback(() => {
    if (!draft.maxTeams || !draft.matchStart) return;
    const fakeMatch = { ...draft, id: '#NEW', cap: draft.maxTeams || 16 } as MatchItem;
    const rounds = generateMatchRounds(fakeMatch, draft.stages);
    setPreviewRounds(rounds);
  }, [draft]);

  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!draft.name?.trim()) errors.push('赛事标题必填');
    if (!draft.signupStart || !draft.signupEnd) errors.push('报名时间必填');
    if (!draft.matchStart || !draft.matchEnd) errors.push('比赛时间必填');
    if (!draft.organizerName?.trim()) errors.push('赛事组织方必填');
    const signupEndDate = parseDateInput(draft.signupEnd || '');
    const matchStartDate = parseDateInput(draft.matchStart || '');
    if (signupEndDate && matchStartDate && signupEndDate > matchStartDate) {
      errors.push('报名结束时间不能晚于比赛开始时间');
    }
    if (!draft.stages || draft.stages.length === 0) {
      errors.push('请配置至少一个排阵阶段');
    } else {
      const stageError = validateStages(draft.stages, draft.maxTeams || 16);
      if (stageError) errors.push(stageError);
    }
    if (!draft.coverImage?.trim()) warnings.push('未上传封面，将使用默认封面');
    return { valid: errors.length === 0, errors, warnings };
  }, [
    draft.name,
    draft.signupStart,
    draft.signupEnd,
    draft.matchStart,
    draft.matchEnd,
    draft.organizerName,
    draft.coverImage,
    draft.stages,
    draft.maxTeams,
  ]);

  const buildMatch = (publish: boolean): MatchItem => {
    const now = new Date().toISOString().slice(0, 10);
    // 发布时生成新 ID；草稿保存复用 draftIdRef 避免重复
    const id = publish ? `#M${Math.floor(1000 + Math.random() * 9000)}` : draftIdRef.current;
    // safe defaults so the detail view never crashes on undefined fields
    const defaults: Partial<MatchItem> = {
      game: games[0],
      bracket: brackets[0],
      maxTeams: 16,
      cap: 16,
      signed: 0,
      pendingAudit: 0,
      approved: 0,
      rejected: 0,
      auditRequired: false,
      entryFee: 0,
      pointsPool: 0,
      prizeAmount: '',
      location: '线上',
      tags: [],
      source: 'admin' as const,
      signupStart: '',
      signupEnd: '',
      matchStart: '',
      matchEnd: '',
      organizerName: '',
    };
    return {
      ...defaults,
      ...(draft as MatchItem),
      id,
      cap: draft.maxTeams || 16,
      status: publish ? 'open' : 'draft',
      createdAt: now,
      stages: draft.stages || applyTemplate(draft.bracket || brackets[0], draft.maxTeams || 16),
    } as MatchItem;
  };

  const handleSave = (publish: boolean) => {
    if (!validation.valid) return;
    onSave(buildMatch(publish), publish);
  };

  const handleSaveDraft = () => {
    // 允许随时保存草稿，名称为空时自动生成占位名
    const autoName = draft.name?.trim() || `草稿 ${new Date().toLocaleDateString('zh-CN')}`;
    const m = { ...buildMatch(false), name: autoName };
    onSave(m, false);
    setLastSavedTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="fixed inset-0 z-[60] bg-bg flex flex-col">
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={16} />
          取消创建
        </button>
        <div className="text-sm font-medium text-slate-800">创办赛事 · Step {step}/3</div>
        <div className="w-20" />
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-5xl mx-auto">
          {step === 1 && <Step1 draft={draft} onChange={updateField} />}
          {step === 2 && (
            <Step2
              draft={draft}
              onStagesChange={(stages) => setDraft((prev) => ({ ...prev, stages }))}
              previewRounds={previewRounds}
              onGeneratePreview={handleGeneratePreview}
            />
          )}
          {step === 3 && (
            <Step3
              draft={draft}
              validation={validation}
              previewRounds={previewRounds}
            />
          )}
        </div>
      </div>

      <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-5">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-1 text-xs px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronLeft size={13} />
          上一步
        </button>

        {step < 3 ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-1 text-xs px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
            >
              <Save size={13} />
              {lastSavedTime ? `已保存 ${lastSavedTime}` : '保存草稿'}
            </button>
            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              className="flex items-center gap-1 text-xs px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              下一步
              <ChevronRight size={13} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={!validation.valid}
              className="flex items-center gap-1 text-xs px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              <Save size={13} />
              保存为草稿
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={!validation.valid}
              className="flex items-center gap-1 text-xs px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Upload size={13} />
              发布赛事
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Step1({
  draft,
  onChange,
}: {
  draft: Partial<MatchItem>;
  onChange: <K extends keyof MatchItem>(field: K, value: MatchItem[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <div className="text-sm font-medium text-slate-800 pb-3 border-b border-slate-100">赛事信息</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="lg:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">赛事封面</label>
            <ImageUpload
              value={draft.coverImage || ''}
              onChange={(value) => onChange('coverImage', value)}
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">赛事标题 *</label>
            <input
              type="text"
              value={draft.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="请输入赛事标题"
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">游戏 *</label>
            <select
              value={draft.game}
              onChange={(e) => onChange('game', e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
            >
              {games.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">参赛队伍数量 *</label>
            <select
              value={draft.maxTeams}
              onChange={(e) => {
                const value = Number(e.target.value);
                onChange('maxTeams', value);
                onChange('cap', value);
              }}
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
            >
              {teamSizeOptions.map((n) => (
                <option key={n} value={n}>{n} 队</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">报名开始 *</label>
              <input
                type="date"
                value={draft.signupStart || ''}
                onChange={(e) => onChange('signupStart', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">报名结束 *</label>
              <input
                type="date"
                value={draft.signupEnd || ''}
                onChange={(e) => onChange('signupEnd', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">比赛开始 *</label>
              <input
                type="date"
                value={draft.matchStart || ''}
                onChange={(e) => onChange('matchStart', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">比赛结束 *</label>
              <input
                type="date"
                value={draft.matchEnd || ''}
                onChange={(e) => onChange('matchEnd', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">赛事组织方 *</label>
            <input
              type="text"
              list="organizer-list"
              value={draft.organizerName || ''}
              onChange={(e) => {
                const name = e.target.value;
                const org = organizerData.find((o) => o.name === name);
                onChange('organizerName', name);
                if (org) onChange('organizerId', org.id);
              }}
              placeholder="输入或选择组织方名称"
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
            />
            <datalist id="organizer-list">
              {organizerData.map((o) => (
                <option key={o.id} value={o.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">赛事奖金</label>
            <div className="flex items-center gap-2">
              <Coins size={14} className="text-slate-400" />
              <input
                type="text"
                value={draft.prizeAmount || ''}
                onChange={(e) => onChange('prizeAmount', e.target.value)}
                placeholder="例如 1000 USDT / 5000 积分"
                className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">地点</label>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-slate-400" />
              <input
                type="text"
                value={draft.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <div className="text-sm font-medium text-slate-800 pb-3 border-b border-slate-100">赛事说明</div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">赛事介绍（含规则、奖励等）</label>
            <RichTextEditor
              value={draft.description || ''}
              onChange={(value) => onChange('description', value)}
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2({
  draft,
  onStagesChange,
  previewRounds,
  onGeneratePreview,
}: {
  draft: Partial<MatchItem>;
  onStagesChange: (stages: TournamentStage[]) => void;
  previewRounds: MatchRound[];
  onGeneratePreview: () => void;
}) {
  const stages = useMemo(() => draft.stages || [], [draft.stages]);
  const [activeStageId, setActiveStageId] = useState<string | null>(stages[0]?.stageId || null);
  const [expandedId, setExpandedId] = useState<string | null>(stages[0]?.stageId || null);

  const maxTeams = draft.maxTeams || 16;
  const validationError = useMemo(() => validateStages(stages, maxTeams), [stages, maxTeams]);

  const activeStage = stages.find((s) => s.stageId === activeStageId) || stages[0];
  const activeRounds = activeStage
    ? previewRounds.filter((r) => r.roundName.startsWith(`${activeStage.name} ·`))
    : previewRounds;

  const handleUpdateStage = (stageId: string, updates: Partial<TournamentStage>) => {
    onStagesChange(
      stages.map((s) => (s.stageId === stageId ? { ...s, ...updates } : s))
    );
  };

  const handleAddStage = () => {
    if (stages.length >= MAX_STAGES) return;
    const order = stages.length + 1;
    const previousStageId = stages.length > 0 ? stages[stages.length - 1].stageId : undefined;
    const entrantCount = previousStageId ? stages[stages.length - 1].teamsOut : maxTeams;
    const newStage = createDefaultStage(order, entrantCount, previousStageId);
    const next = [...stages, newStage];
    onStagesChange(next);
    setActiveStageId(newStage.stageId);
    setExpandedId(newStage.stageId);
  };

  const handleRemoveStage = (stageId: string) => {
    const next = stages.filter((s) => s.stageId !== stageId);
    onStagesChange(next);
    if (activeStageId === stageId) setActiveStageId(next[0]?.stageId || null);
    if (expandedId === stageId) setExpandedId(next[0]?.stageId || null);
  };

  const handleMoveStage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= stages.length) return;
    const next = [...stages];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    next.forEach((s, i) => (s.order = i + 1));
    onStagesChange(next);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="text-sm font-medium text-slate-800">轮次设置</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{stages.length}/{MAX_STAGES}</span>
            <select
              id="quick-template"
              className="text-xs px-2 py-1.5 border border-slate-200 rounded-lg bg-transparent outline-none focus:border-primary disabled:opacity-50"
              disabled={stages.length >= MAX_STAGES}
              onChange={(e) => {
                const key = e.target.value;
                if (!key) return;
                const newStages = applyTemplate(key, maxTeams);
                const remaining = MAX_STAGES - stages.length;
                const trimmed = newStages.slice(0, remaining);
                onStagesChange([...stages, ...trimmed]);
                setActiveStageId(trimmed[trimmed.length - 1]?.stageId || null);
                setExpandedId(trimmed[trimmed.length - 1]?.stageId || null);
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
              + 添加轮次
            </button>
          </div>
        </div>

        {stages.length === 0 && (
          <div className="text-sm text-slate-400 py-6 text-center">点击「添加轮次」或选择上方快捷组合开始配置</div>
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
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveStage(index, -1);
                      }}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveStage(index, 1);
                      }}
                      disabled={index === stages.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStage(stage.stageId);
                      }}
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
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {validationError}
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 space-y-1">
          <div className="font-medium text-slate-700">说明</div>
          <div>· 点击上方模板快速生成默认阶段</div>
          <div>· 每个阶段可独立设置赛制与参数</div>
          <div>· 阶段间参赛队伍数需衔接</div>
          <div>· 实际队伍在「比赛管理」中拖拽分配</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="text-sm font-medium text-slate-800">对阵预览</div>
          <button
            onClick={onGeneratePreview}
            disabled={stages.length === 0}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Play size={12} />
            生成对阵图
          </button>
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
          ) : activeStage.type === 'FREE' ? (
            <div className="text-sm text-slate-400 text-center pt-20">
              自由排布阶段不提供对阵预览<br />
              <span className="text-xs">可在比赛管理中手动创建任意对阵</span>
            </div>
          ) : previewRounds.length === 0 ? (
            <div className="text-sm text-slate-400 text-center pt-20">
              配置完成后点击右上角「生成对阵图」预览
            </div>
          ) : activeRounds.length === 0 ? (
            <div className="text-sm text-slate-400">当前参数无法生成对阵，请检查阶段配置</div>
          ) : (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-700">
                  {activeStage.name} · {stageTypeOptions.find((o) => o.value === activeStage.type)?.label}
                </div>
                <div className="text-xs text-slate-500">
                  {activeStage.teamsIn} 队 → {activeStage.teamsOut} 队晋级 · 默认 {activeStage.defaultFormat}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                <StagePreview stage={activeStage} rounds={activeRounds} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

function StagePreview({ stage, rounds }: { stage: TournamentStage; rounds: MatchRound[] }) {
  if (rounds.length === 0) return <div className="text-sm text-slate-400">无对阵数据</div>;
  const groups = groupRoundsByGroup(rounds);
  switch (stage.type) {
    case 'ROUND_ROBIN':
      return <RoundRobinPreview groups={groups} />;
    case 'SINGLE_ELIMINATION':
      return <SingleEliminationPreview groups={groups} />;
    case 'DOUBLE_ELIMINATION':
      return <DoubleEliminationPreview groups={groups} />;
    case 'SWISS':
      return <SwissPreview groups={groups} />;
    default:
      return null;
  }
}

function RoundRobinPreview({ groups }: { groups: [string, MatchRound[]][] }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {groups.map(([label, rounds]) => {
        const teamSet = new Set<string>();
        rounds.forEach((r) => r.matches.forEach((g) => { teamSet.add(g.teamA); teamSet.add(g.teamB); }));
        const teams = Array.from(teamSet);
        const findGame = (a: string, b: string) => {
          for (const r of rounds) {
            for (const g of r.matches) {
              if ((g.teamA === a && g.teamB === b) || (g.teamA === b && g.teamB === a)) return g;
            }
          }
          return null;
        };
        return (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="text-xs font-medium text-slate-700">{label}</div>
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
            <div className="text-[10px] text-slate-400">积分榜将在比赛录入结果后自动计算</div>
          </div>
        );
      })}
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

function SingleEliminationPreview({ groups }: { groups: [string, MatchRound[]][] }) {
  return (
    <div className="space-y-6">
      {groups.map(([label, rounds]) => (
        <EliminationTree key={label} rounds={rounds} label={label} />
      ))}
    </div>
  );
}

function DoubleEliminationPreview({ groups }: { groups: [string, MatchRound[]][] }) {
  return (
    <div className="space-y-6">
      {groups.map(([label, rounds]) => {
        const wb = rounds.filter((r) => !r.roundName.includes('败者'));
        const lb = rounds.filter((r) => r.roundName.includes('败者'));
        return (
          <div key={label} className="space-y-4">
            <div className="text-xs font-medium text-slate-700">{label}</div>
            {wb.length > 0 && <EliminationTree rounds={wb} label="胜者组" />}
            {lb.length > 0 && <EliminationTree rounds={lb} label="败者组" />}
            {!lb.length && <EliminationTree rounds={rounds} label="对阵图" />}
          </div>
        );
      })}
    </div>
  );
}

function SwissPreview({ groups }: { groups: [string, MatchRound[]][] }) {
  return (
    <div className="space-y-4">
      {groups.map(([label, rounds]) => (
        <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="text-xs font-medium text-slate-700">{label}</div>
          <div className="space-y-3">
            {rounds.map((round) => (
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
          <div className="text-[10px] text-slate-400">积分榜将在比赛录入结果后自动计算</div>
        </div>
      ))}
    </div>
  );
}

function Step3({
  draft,
  validation,
  previewRounds,
}: {
  draft: Partial<MatchItem>;
  validation: { valid: boolean; errors: string[]; warnings: string[] };
  previewRounds: MatchRound[];
}) {
  const totalGames = previewRounds.reduce((sum, r) => sum + r.matches.length, 0);
  const stages = draft.stages || [];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-medium text-slate-800 pb-3 border-b border-slate-100">赛事预览</div>
        <div className="mt-4 flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-48 h-32 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
            {draft.coverImage ? (
              <img src={draft.coverImage} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <ImageIcon size={32} />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-lg font-bold text-slate-800">{draft.name || '未命名赛事'}</div>
            <div className="text-sm text-slate-500">
              {draft.game} · {draft.bracket} · {draft.maxTeams} 队
              {stages.length > 0 && ` · ${stages.length} 个阶段`}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <CalendarDays size={14} className="text-slate-400" />
                报名 {draft.signupStart} ~ {draft.signupEnd}
              </div>
              <div className="flex items-center gap-1">
                <Trophy size={14} className="text-slate-400" />
                比赛 {draft.matchStart} ~ {draft.matchEnd}
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} className="text-slate-400" />
                {draft.organizerName}
              </div>
              <div className="flex items-center gap-1">
                <Award size={14} className="text-slate-400" />
                奖金 {draft.prizeAmount || '未填写'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-medium text-slate-800 pb-3 border-b border-slate-100">排阵摘要</div>
        <div className="mt-4 text-sm text-slate-600 space-y-1">
          {stages.map((stage, index) => (
            <div key={stage.stageId}>
              阶段 {index + 1}（{stage.name}）：
              {stage.type === 'FREE'
                ? `自由排布${stage.entrant.entrantCount ? ` · ${stage.entrant.entrantCount} 队参赛` : ''}${Array.isArray(stage.advancement) && stage.advancement[0]?.totalCount ? ` · ${stage.advancement[0].totalCount} 队晋出` : ''}`
                : `${stage.teamsIn} 队进 → ${stage.teamsOut} 队出 · ${stageTypeOptions.find((o) => o.value === stage.type)?.label} · 默认 ${stage.defaultFormat}`}
            </div>
          ))}
          {previewRounds.map((round) => (
            <div key={round.roundId}>
              {round.roundName}：{round.matches.length} 场比赛
            </div>
          ))}
          <div className="font-medium text-slate-800 pt-2">总计 {totalGames} 场比赛</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-medium text-slate-800 pb-3 border-b border-slate-100">发布检查</div>
        <div className="mt-4 space-y-2">
          {validation.errors.map((err) => (
            <div key={err} className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={14} />
              {err}
            </div>
          ))}
          {validation.warnings.map((warn) => (
            <div key={warn} className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle size={14} />
              {warn}
            </div>
          ))}
          {validation.valid && validation.errors.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 size={14} />
              信息完整，可以发布
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
