import { useState, useEffect, Component, type ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-sm text-red-800 space-y-2">
          <div className="font-bold">⚠ 渲染错误（请截图发给开发者）</div>
          <pre className="text-xs whitespace-pre-wrap break-all bg-red-100 rounded p-2">
            {(this.state.error as Error).message}
            {'\n'}
            {(this.state.error as Error).stack?.slice(0, 800)}
          </pre>
          <button
            className="text-xs px-3 py-1 bg-red-600 text-white rounded-lg"
            onClick={() => this.setState({ error: null })}
          >重试</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import {
  Trophy,
  Award,
  CalendarDays,
  FileText,
  Shield,
  UsersRound,
  Pencil,
  X,
  Check,
  Gamepad2,
  MapPin,
  Coins,
  Users,
  Upload,
  Settings2,
  Play,
  Square,
  Ban,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import type { MatchItem } from '../../data/mockData';
import { useMatch, useMatchActions } from '../../context/matchHooks';
import MatchSignupAudit from './MatchSignupAudit';
import MatchCompetitionMgmt from './MatchCompetitionMgmt';
import MatchResultInput from './MatchResultInput';
import StageManager from './StageManager';
import UserDrawer from './UserDrawer';
import TeamDrawer from './TeamDrawer';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import Toast from './Toast';
import NumericInput from './NumericInput';

interface MatchDetailProps {
  match: MatchItem;
  onSave: (match: MatchItem) => void;
  onPublish?: (match: MatchItem) => void;
  onStartMatch?: (match: MatchItem) => void;
  onEndMatch?: (match: MatchItem) => void;
  onCancel?: (match: MatchItem) => void;
  onChangeStatus?: (match: MatchItem, status: MatchItem['status']) => void;
  onApprove?: (matchId: string) => void;
  onReject?: (matchId: string, reason?: string) => void;
  onResetToReview?: (matchId: string) => void;
  initialTab?: string;
}


const detailTabs = [
  { key: 'basic', label: '基本信息', icon: FileText },
  { key: 'stages', label: '阶段管理', icon: Settings2 },
  { key: 'signup', label: '报名审核', icon: UsersRound },
  { key: 'competition', label: '比赛管理', icon: Trophy },
  { key: 'ranking', label: '最终排名', icon: Award },
];

const games = ['MLBB', 'Dota 2', 'PUBG', 'eFootball'];

export default function MatchDetail({ match, onSave, onPublish, onStartMatch, onEndMatch, onCancel, onChangeStatus, onApprove, onReject, onResetToReview, initialTab }: MatchDetailProps) {
  const [activeTab, setActiveTab] = useState(initialTab ?? 'basic');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<MatchItem>(match);
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);
  const [drawerTeamName, setDrawerTeamName] = useState<string | null>(null);
  // 状态操作两步确认：第一次点击记录目标状态，第二次才执行
  const [confirmAction, setConfirmAction] = useState<MatchItem['status'] | null>(null);
  const state = useMatch();
  const { hideToast } = useMatchActions();

  // 外部 match 更新时（如审核通过后），非编辑状态下同步 draft
  useEffect(() => {
    if (!isEditing) setDraft(match);
  }, [match]); // eslint-disable-line react-hooks/exhaustive-deps

  // 切换 tab 时不重置确认状态，允许用户查阅其他 tab 后返回继续确认

  const handleCancelEdit = () => {
    setDraft(match);
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave(draft);
    setIsEditing(false);
  };

  const updateField = <K extends keyof MatchItem>(field: K, value: MatchItem[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateMaxTeams = (value: number) => {
    const capped = Math.min(value, 256);
    setDraft((prev) => ({ ...prev, maxTeams: capped, cap: capped }));
  };

  const handleStageSave = (updatedMatch: MatchItem) => {
    onSave({ ...match, stages: updatedMatch.stages });
  };

  // 两步确认执行（支持正向和逆向流转）
  const handleStatusChange = (targetStatus: MatchItem['status']) => {
    if (confirmAction === targetStatus) {
      setConfirmAction(null);
      if (targetStatus === 'open')      onPublish?.(match);
      else if (targetStatus === 'live') onStartMatch?.(match);
      else if (targetStatus === 'ended') onEndMatch?.(match);
      else if (targetStatus === 'cancelled') onCancel?.(match);
      else onChangeStatus?.(match, targetStatus);  // 逆向：draft, 等
    } else {
      setConfirmAction(targetStatus);
    }
  };

  // 状态流转进度步骤
  const flowSteps: { key: MatchItem['status']; label: string }[] = [
    { key: 'draft', label: '未发布' },
    { key: 'open',  label: '报名中' },
    { key: 'live',  label: '进行中' },
    { key: 'ended', label: '已结束' },
  ];
  const flowIndex = match.status === 'closing'
    ? 1
    : flowSteps.findIndex((s) => s.key === match.status);
  const isCancelled = match.status === 'cancelled';

  const isPendingReview = match.source === 'user' && match.approvalStatus === 'pending_review';
  const isApproved = match.source === 'user' && match.approvalStatus === 'approved';
  const isRejected = match.source === 'user' && match.approvalStatus === 'rejected';

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* 用户提交审核横幅 */}
      {isPendingReview && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Shield size={18} className="text-violet-500 shrink-0" />
            <div>
              <div className="text-sm font-medium text-violet-800">用户提交赛事 · 待审核</div>
              <div className="text-xs text-violet-600 mt-0.5">
                由 <span className="font-medium">{match.organizerName}</span> 提交，审核通过后将在 Gainslink 前端展示，报名与赛事管理由其负责。
              </div>
            </div>
          </div>
          {onApprove && onReject && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onReject(match.id, '')}
                className="flex items-center gap-1.5 text-sm px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X size={14} />
                驳回
              </button>
              <button
                onClick={() => onApprove(match.id)}
                className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Check size={14} />
                审核通过
              </button>
            </div>
          )}
        </div>
      )}
      {isApproved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <Check size={16} className="text-emerald-500" />
          <span className="text-sm text-emerald-700">已审核通过 · 由 <span className="font-medium">{match.organizerName}</span> 提交，已在 Gainslink 前端展示</span>
        </div>
      )}
      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <X size={16} className="text-red-400 shrink-0" />
            <span className="text-sm text-red-600">已驳回 · 由 <span className="font-medium">{match.organizerName}</span> 提交{match.rejectionReason ? `，驳回原因：${match.rejectionReason}` : ''}</span>
          </div>
          {onResetToReview && (
            <button
              onClick={() => onResetToReview(match.id)}
              className="shrink-0 text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              重新审核
            </button>
          )}
        </div>
      )}
      {/* 状态进度条 + 操作按钮（始终可见，与编辑模式解耦） */}
      <div
        className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
        onClick={() => confirmAction && setConfirmAction(null)}
      >
        {/* 进度步骤（可点击切换状态） */}
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {isCancelled ? (
            <span className="text-xs text-red-500 font-medium flex items-center gap-1.5">
              <Ban size={13} /> 赛事已取消
            </span>
          ) : (
            flowSteps.map((step, i) => {
              const isCurrent = i === flowIndex;
              const isPast = i < flowIndex;
              const isConfirming = confirmAction === step.key;
              return (
                <div key={step.key} className="flex items-center gap-1 min-w-0">
                  <button
                    disabled={isCurrent}
                    onClick={() => handleStatusChange(step.key as MatchItem['status'])}
                    className={`flex items-center gap-1.5 text-xs whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'text-primary font-semibold cursor-default'
                        : isPast
                        ? 'text-slate-400 hover:text-primary cursor-pointer'
                        : 'text-slate-300 hover:text-slate-500 cursor-pointer'
                    }`}
                    title={isCurrent ? undefined : (isPast ? `回退到「${step.label}」` : `跳转到「${step.label}」`)}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-primary text-white'
                        : isConfirming
                        ? 'bg-amber-400 text-white animate-pulse'
                        : isPast
                        ? 'bg-slate-200 text-slate-500'
                        : 'bg-slate-100 text-slate-300'
                    }`}>
                      {isPast && !isConfirming ? <Check size={10} /> : i + 1}
                    </div>
                    {step.label}
                  </button>
                  {i < flowSteps.length - 1 && (
                    <ChevronRight size={12} className={isPast ? 'text-slate-300' : 'text-slate-200'} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 状态操作按钮（始终显示，加两步确认） */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {confirmAction && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <AlertTriangle size={12} /> 再次点击确认
            </span>
          )}
          {match.status === 'draft' && onPublish && (
            <button
              onClick={() => handleStatusChange('open')}
              className={`flex items-center gap-1 text-xs px-3 py-2 rounded-lg transition-colors ${
                confirmAction === 'open'
                  ? 'bg-amber-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <Upload size={12} /> {confirmAction === 'open' ? '确认发布？' : '发布赛事'}
            </button>
          )}
          {(match.status === 'open' || match.status === 'closing') && onStartMatch && (
            <button
              onClick={() => handleStatusChange('live')}
              className={`flex items-center gap-1 text-xs px-3 py-2 rounded-lg transition-colors ${
                confirmAction === 'live'
                  ? 'bg-amber-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <Play size={12} /> {confirmAction === 'live' ? '确认开始？' : '开始比赛'}
            </button>
          )}
          {match.status === 'live' && onEndMatch && (
            <button
              onClick={() => handleStatusChange('ended')}
              className={`flex items-center gap-1 text-xs px-3 py-2 rounded-lg transition-colors ${
                confirmAction === 'ended'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Square size={12} /> {confirmAction === 'ended' ? '确认结束？' : '结束赛事'}
            </button>
          )}
          {['open', 'closing', 'live'].includes(match.status) && onCancel && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              className={`flex items-center gap-1 text-xs px-3 py-2 rounded-lg border transition-colors ${
                confirmAction === 'cancelled'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white border-slate-200 text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Ban size={12} /> {confirmAction === 'cancelled' ? '确认取消？' : '取消赛事'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex items-center border-b border-slate-200 overflow-x-auto">
          {detailTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.key
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

        <div className="p-5">
          {activeTab === 'basic' && (
            <BasicInfoEditor
              draft={draft}
              isEditing={isEditing}
              onChange={updateField}
              onMaxTeamsChange={updateMaxTeams}
              onEdit={() => { setDraft(match); setIsEditing(true); }}
              onSave={handleSave}
              onCancelEdit={handleCancelEdit}
            />
          )}
          {activeTab === 'stages' && (
            <StageManager
              onSave={handleStageSave}
              onNavigateToCompetition={() => setActiveTab('competition')}
            />
          )}
          {activeTab === 'signup' && (
            <MatchSignupAudit
              matchId={match.id}
              onViewUser={setDrawerUserId}
              onViewTeam={setDrawerTeamName}
            />
          )}
          {activeTab === 'competition' && (
            <ErrorBoundary>
              <MatchCompetitionMgmt onTeamClick={setDrawerTeamName} />
            </ErrorBoundary>
          )}
          {activeTab === 'ranking' && (
            <MatchResultInput matchId={match.id} rounds={state.rounds} stages={state.match?.stages} onViewUser={setDrawerUserId} />
          )}
        </div>
      </div>

      {state.toast && <Toast message={state.toast.message} type={state.toast.type} onClose={hideToast} />}

      {drawerUserId && <UserDrawer userId={drawerUserId} onClose={() => setDrawerUserId(null)} />}
      {drawerTeamName && <TeamDrawer teamName={drawerTeamName} onClose={() => setDrawerTeamName(null)} />}
    </div>
  );
}

function BasicInfoEditor({
  draft,
  isEditing,
  onChange,
  onMaxTeamsChange,
  onEdit,
  onSave,
  onCancelEdit,
}: {
  draft: MatchItem;
  isEditing: boolean;
  onChange: <K extends keyof MatchItem>(field: K, value: MatchItem[K]) => void;
  onMaxTeamsChange: (value: number) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* 编辑工具栏 */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">
          {isEditing ? '修改后点击保存生效' : '点击编辑修改赛事基本信息'}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onCancelEdit}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
              >
                <X size={12} /> 取消
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Check size={12} /> 保存修改
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
            >
              <Pencil size={12} /> 编辑
            </button>
          )}
        </div>
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-1 space-y-5">
        <div className="bg-slate-800 rounded-xl overflow-hidden h-56 flex items-center justify-center relative">
          {draft.coverImage ? (
            <img src={draft.coverImage} alt={draft.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-white/60">
              <Trophy size={40} className="mx-auto mb-2 opacity-50" />
              <div className="text-sm">赛事封面图</div>
            </div>
          )}
          {isEditing && (
            <div className="absolute inset-x-4 bottom-4">
              <ImageUpload
                value={draft.coverImage || ''}
                onChange={(value) => onChange('coverImage', value)}
                placeholder="点击更换封面"
              />
            </div>
          )}
        </div>

        <KeyInfoCard draft={draft} />
      </div>

      <div className="lg:col-span-2 space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">赛事名称</label>
            {isEditing ? (
              <input
                type="text"
                value={draft.name}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            ) : (
              <div className="text-base font-bold text-slate-800">{draft.name}</div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">游戏</label>
              {isEditing ? (
                <select
                  value={draft.game}
                  onChange={(e) => onChange('game', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                >
                  {games.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-slate-800">{draft.game}</div>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">队伍上限</label>
              {isEditing ? (
                <NumericInput
                  value={draft.maxTeams}
                  onChange={(value) => onMaxTeamsChange(value ?? 1)}
                  min={1}
                  max={256}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                />
              ) : (
                <div className="text-sm text-slate-800">{draft.maxTeams} 队</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">报名开始</label>
              {isEditing ? (
                <input
                  type="date"
                  value={draft.signupStart}
                  onChange={(e) => onChange('signupStart', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                />
              ) : (
                <div className="text-sm text-slate-800">{draft.signupStart}</div>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">报名结束</label>
              {isEditing ? (
                <input
                  type="date"
                  value={draft.signupEnd}
                  onChange={(e) => onChange('signupEnd', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                />
              ) : (
                <div className="text-sm text-slate-800">{draft.signupEnd}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">比赛开始</label>
              {isEditing ? (
                <input
                  type="date"
                  value={draft.matchStart}
                  onChange={(e) => onChange('matchStart', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                />
              ) : (
                <div className="text-sm text-slate-800">{draft.matchStart}</div>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">比赛结束</label>
              {isEditing ? (
                <input
                  type="date"
                  value={draft.matchEnd}
                  onChange={(e) => onChange('matchEnd', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                />
              ) : (
                <div className="text-sm text-slate-800">{draft.matchEnd}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">赛事组织方</label>
              {isEditing ? (
                <input
                  type="text"
                  value={draft.organizerName}
                  onChange={(e) => onChange('organizerName', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                />
              ) : (
                <div className="text-sm text-slate-800">{draft.organizerName}</div>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">地点</label>
              {isEditing ? (
                <input
                  type="text"
                  value={draft.location}
                  onChange={(e) => onChange('location', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                />
              ) : (
                <div className="text-sm text-slate-800">{draft.location}</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">赛事奖金</label>
            {isEditing ? (
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
            ) : (
              <div className="text-sm text-slate-800">{draft.prizeAmount || `${draft.pointsPool.toLocaleString()} 积分`}</div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">赛事介绍（含规则、奖励等）</label>
            {isEditing ? (
              <RichTextEditor
                value={draft.description || ''}
                onChange={(value) => onChange('description', value)}
                rows={4}
              />
            ) : (
              <div
                className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: draft.description || '<span class="text-slate-400">暂无赛事介绍</span>' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

function KeyInfoCard({ draft }: { draft: MatchItem }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="text-sm font-medium text-slate-800">关键信息</div>

      <div className="flex items-start gap-3 text-sm">
        <CalendarDays size={14} className="text-slate-400 mt-0.5" />
        <div>
          <div className="text-xs text-slate-500">报名时间</div>
          <div className="text-slate-800">{draft.signupStart} ~ {draft.signupEnd}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm">
        <Trophy size={14} className="text-slate-400 mt-0.5" />
        <div>
          <div className="text-xs text-slate-500">比赛时间</div>
          <div className="text-slate-800">{draft.matchStart} ~ {draft.matchEnd}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm">
        <Shield size={14} className="text-slate-400 mt-0.5" />
        <div>
          <div className="text-xs text-slate-500">主办方</div>
          <div className="text-slate-800">{draft.organizerName}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm">
        <MapPin size={14} className="text-slate-400 mt-0.5" />
        <div>
          <div className="text-xs text-slate-500">地点</div>
          <div className="text-slate-800">{draft.location}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm">
        <Coins size={14} className="text-slate-400 mt-0.5" />
        <div>
          <div className="text-xs text-slate-500">赛事奖金</div>
          <div className="text-slate-800">{draft.prizeAmount || `${draft.pointsPool.toLocaleString()} 积分`}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm">
        <Users size={14} className="text-slate-400 mt-0.5" />
        <div>
          <div className="text-xs text-slate-500">队伍上限</div>
          <div className="text-slate-800">{draft.maxTeams} 队</div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm">
        <Gamepad2 size={14} className="text-slate-400 mt-0.5" />
        <div>
          <div className="text-xs text-slate-500">当前报名</div>
          <div className="text-slate-800">{draft.signed} / {draft.cap}</div>
        </div>
      </div>
    </div>
  );
}
