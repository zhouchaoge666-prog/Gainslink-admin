import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Mail, Phone, Calendar, MapPin, Shield, Ban, Coins, Trophy,
  Crown, GraduationCap, Users, ChevronLeft, ChevronRight,
  Plus, Minus, ClipboardList, UserCog, FileText, Pin, VolumeX, Volume2,
  Heart, MessageSquare, Eye, ChevronDown, Swords, MapPinned,
} from 'lucide-react';
import type { UserItem, UserRole, PointsEventType } from '../../data/mockData';
import { communityPostData, communityUserProfiles, userHostedMatches, BADGE_CONFIG } from '../../data/mockData';
import type { UserHostedMatch } from '../../data/mockData';
import PostDetailDrawer from '../CommunityManagement/PostDetailDrawer';

const POST_STATUS_COLORS: Record<string, string> = {
  normal:  'bg-emerald-50 text-emerald-600',
  hidden:  'bg-yellow-50 text-yellow-600',
  deleted: 'bg-red-50 text-red-500',
};
const POST_STATUS_LABELS: Record<string, string> = {
  normal: '正常', hidden: '已隐藏', deleted: '已删除',
};

// ── 角色配置 ─────────────────────────────────────────────────────────────────
const roleConfig: Record<UserRole, { label: string; cls: string }> = {
  admin:     { label: '管理员', cls: 'bg-purple-50 text-purple-700' },
  organizer: { label: '组织方', cls: 'bg-blue-50 text-blue-700' },
  player:    { label: '玩家',   cls: 'bg-slate-100 text-slate-600' },
};

// ── 积分事件图标 ──────────────────────────────────────────────────────────────
const eventIcon: Record<PointsEventType, string> = {
  checkin:           '📅',
  match_win:         '🏆',
  match_participate: '🎮',
  admin_adjust:      '⚙️',
  referral:          '🔗',
  signup_reward:     '🎁',
  other:             '📌',
};

// ── 参赛结果 ──────────────────────────────────────────────────────────────────
const resultConfig: Record<string, { label: string; cls: string }> = {
  champion:   { label: '冠军', cls: 'bg-yellow-50 text-yellow-700' },
  runner_up:  { label: '亚军', cls: 'bg-slate-100 text-slate-600' },
  top4:       { label: '前4', cls: 'bg-blue-50 text-blue-600' },
  top8:       { label: '前8', cls: 'bg-blue-50 text-blue-500' },
  eliminated: { label: '已淘汰', cls: 'bg-red-50 text-red-400' },
  ongoing:    { label: '进行中', cls: 'bg-emerald-50 text-emerald-600' },
};

const ITEMS_PER_PAGE = 8;

interface Props {
  user: UserItem;
  onClose: () => void;
  onToggleBan: (userId: string, reason?: string) => void;
  onAdjustPoints: (userId: string, delta: number, reason: string) => void;
  onChangeRole: (userId: string, role: UserRole) => void;
  onToggleMute: (userId: string, reason?: string) => void;
}

export default function UserDetailDrawer({ user, onClose, onToggleBan, onAdjustPoints, onChangeRole, onToggleMute }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'points' | 'matches' | 'logs' | 'posts' | 'events'>('info');

  // 积分流水翻页
  const [pointsPage, setPointsPage] = useState(1);
  // 参赛记录翻页
  const [matchPage, setMatchPage] = useState(1);
  // 发帖记录翻页
  const [postsPage, setPostsPage] = useState(1);

  const userPosts = communityPostData.filter(p => p.authorName === user.nickname);
  const postsTotalPages = Math.max(1, Math.ceil(userPosts.length / ITEMS_PER_PAGE));
  const postsItems = userPosts.slice((postsPage - 1) * ITEMS_PER_PAGE, postsPage * ITEMS_PER_PAGE);
  const communityProfile = communityUserProfiles.find(p => p.name === user.nickname);
  const hostedMatches: UserHostedMatch[] = userHostedMatches[user.id] ?? [];

  const [communitySpacePost, setCommunitySpacePost] = useState<typeof communityPostData[0] | null>(null);

  // 封禁确认
  const [banConfirm, setBanConfirm] = useState(false);
  const [banReason, setBanReason] = useState('');

  // 积分调整
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustDelta, setAdjustDelta] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustType, setAdjustType] = useState<'+' | '-'>('+');

  // 角色修改
  const [showRoleEdit, setShowRoleEdit] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>(user.role);

  // 社区禁言
  const [muteConfirm, setMuteConfirm] = useState(false);
  const [muteReason, setMuteReason] = useState('');

  const tabs = [
    { key: 'info',    label: '基本信息' },
    { key: 'points',  label: '代币流水' },
    { key: 'matches', label: '参赛记录' },
    { key: 'logs',    label: '操作记录' },
    { key: 'posts',   label: '社区空间' },
    ...(user.role === 'organizer' || user.role === 'admin'
      ? [{ key: 'events', label: '举办赛事' }]
      : []),
  ] as const;

  const handleBanConfirm = () => {
    if (user.status === 'active' && !banReason.trim()) return;
    onToggleBan(user.id, banReason.trim() || undefined);
    setBanConfirm(false);
    setBanReason('');
  };

  const handleAdjustSubmit = () => {
    const n = parseInt(adjustDelta, 10);
    if (!n || !adjustReason.trim()) return;
    onAdjustPoints(user.id, adjustType === '+' ? n : -n, adjustReason.trim());
    setShowAdjust(false);
    setAdjustDelta('');
    setAdjustReason('');
  };

  const handleRoleSubmit = () => {
    onChangeRole(user.id, newRole);
    setShowRoleEdit(false);
  };

  // 分页数据
  const pointsTotalPages = Math.max(1, Math.ceil(user.pointsLog.length / ITEMS_PER_PAGE));
  const pointsItems = user.pointsLog.slice((pointsPage - 1) * ITEMS_PER_PAGE, pointsPage * ITEMS_PER_PAGE);

  const matchTotalPages = Math.max(1, Math.ceil(user.matchHistory.length / ITEMS_PER_PAGE));
  const matchItems = user.matchHistory.slice((matchPage - 1) * ITEMS_PER_PAGE, matchPage * ITEMS_PER_PAGE);

  function MiniPager({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
    return (
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
        <span className="text-xs text-slate-400">第 {page} / {total} 页</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
            className="p-1 rounded text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-colors">
            <ChevronLeft size={13} />
          </button>
          <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total}
            className="p-1 rounded text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-colors">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  const mainDrawer = createPortal(
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* 顶部 */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-5 flex-shrink-0">
          <span className="font-medium text-slate-800">用户详情</span>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* 用户头部信息 */}
        <div className="px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {user.nickname.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800 text-base">{user.nickname}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleConfig[user.role].cls}`}>
                  {roleConfig[user.role].label}
                </span>
                {user.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />正常
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                    <Ban size={10} />封禁
                  </span>
                )}
                {user.communityMuted && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                    <VolumeX size={10} />社区禁言
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{user.id} · @{user.username}</div>
            </div>
          </div>
        </div>

        {/* Tab 导航 */}
        <div className="flex border-b border-slate-100 flex-shrink-0">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 内容 */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Tab 1：基本信息 ──────────────────────────────────────────── */}
          {activeTab === 'info' && (
            <div className="p-5 space-y-4">
              {/* 账户信息 */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">账户信息</div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <InfoRow icon={<Mail size={14} />} label="邮箱" value={user.email} />
                  {user.phone && <InfoRow icon={<Phone size={14} />} label="手机" value={user.phone} />}
                  <InfoRow icon={<Calendar size={14} />} label="注册时间" value={user.regTime} />
                  <InfoRow icon={<MapPin size={14} />} label="来源"
                    value={user.source === 'invite' ? '邀请注册' : '自然流量'} />
                </div>
              </div>

              {/* 个人信息 */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">个人信息</div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  {user.birthday && (
                    <InfoRow icon={<Calendar size={14} />} label="生日" value={user.birthday} />
                  )}
                  {user.gender && (
                    <InfoRow icon={<Shield size={14} />} label="性别"
                      value={user.gender === 'male' ? '男' : user.gender === 'female' ? '女' : '其他'} />
                  )}
                  <InfoRow icon={<MapPin size={14} />} label="国家/地区" value={user.country} />
                  {user.school && (
                    <InfoRow icon={<GraduationCap size={14} />} label="学校" value={user.school} />
                  )}
                </div>
              </div>

              {/* 战队信息 */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">战队信息</div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <InfoRow icon={<Users size={14} />} label="所在战队"
                    value={user.teamName ?? '—'} />
                  <InfoRow icon={<Crown size={14} />} label="创建的战队"
                    value={user.createdTeamName ?? '—'} />
                </div>
              </div>

              {/* 勋章 */}
              {user.badges && user.badges.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">勋章</div>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map(badge => {
                      const cfg = BADGE_CONFIG[badge];
                      return (
                        <span key={badge} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-medium ${cfg.bg} ${cfg.color}`}>
                          <span>{cfg.emoji}</span>{cfg.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 角色管理 */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">角色管理</div>
                <div className="bg-slate-50 rounded-xl p-4">
                  {showRoleEdit ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {(['player', 'organizer', 'admin'] as UserRole[]).map((r) => (
                          <button key={r} onClick={() => setNewRole(r)}
                            className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${newRole === r ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:border-primary/50'}`}>
                            {roleConfig[r].label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleRoleSubmit}
                          className="flex-1 text-xs py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                          确认修改
                        </button>
                        <button onClick={() => { setShowRoleEdit(false); setNewRole(user.role); }}
                          className="flex-1 text-xs py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCog size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700">当前角色：</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${roleConfig[user.role].cls}`}>
                          {roleConfig[user.role].label}
                        </span>
                      </div>
                      <button onClick={() => setShowRoleEdit(true)}
                        className="text-xs text-primary hover:underline">修改</button>
                    </div>
                  )}
                </div>
              </div>

              {/* 封禁信息 / 封禁操作 */}
              {user.status === 'banned' && user.banReason && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-1">
                  <div className="text-xs font-semibold text-red-600">封禁原因</div>
                  <div className="text-sm text-red-700">{user.banReason}</div>
                  {user.banTime && <div className="text-xs text-red-400">封禁时间：{user.banTime}</div>}
                </div>
              )}

              <div className="pt-1">
                {!banConfirm ? (
                  <button onClick={() => setBanConfirm(true)}
                    className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${
                      user.status === 'active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}>
                    {user.status === 'active' ? '封禁用户' : '解除封禁'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    {user.status === 'active' && (
                      <input value={banReason} onChange={(e) => setBanReason(e.target.value)}
                        placeholder="请输入封禁原因（必填）"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300" />
                    )}
                    <div className="flex gap-2">
                      <button onClick={handleBanConfirm}
                        disabled={user.status === 'active' && !banReason.trim()}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                          user.status === 'active'
                            ? 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }`}>
                        确认{user.status === 'active' ? '封禁' : '解封'}
                      </button>
                      <button onClick={() => { setBanConfirm(false); setBanReason(''); }}
                        className="flex-1 py-2 rounded-xl text-sm border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Tab 2：积分流水 ──────────────────────────────────────────── */}
          {activeTab === 'points' && (
            <div className="p-5 space-y-4">
              {/* 当前积分 + 调整按钮 */}
              <div className="bg-primary/5 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">当前代币余额</div>
                  <div className="flex items-center gap-1.5">
                    <Coins size={18} className="text-primary" />
                    <span className="text-2xl font-bold text-slate-800">{user.points.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setShowAdjust(!showAdjust)}
                  className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  调整代币
                </button>
              </div>

              {/* 代币调整表单 */}
              {showAdjust && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600">代币调整</div>
                  <div className="flex gap-2">
                    <button onClick={() => setAdjustType('+')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs border transition-colors ${adjustType === '+' ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200 text-slate-600'}`}>
                      <Plus size={12} />增加
                    </button>
                    <button onClick={() => setAdjustType('-')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs border transition-colors ${adjustType === '-' ? 'bg-red-500 text-white border-red-500' : 'border-slate-200 text-slate-600'}`}>
                      <Minus size={12} />扣除
                    </button>
                  </div>
                  <input type="number" min={1} value={adjustDelta} onChange={(e) => setAdjustDelta(e.target.value)}
                    placeholder="输入数量"
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="操作原因（必填）"
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="flex gap-2">
                    <button onClick={handleAdjustSubmit}
                      disabled={!adjustDelta || !adjustReason.trim()}
                      className="flex-1 py-1.5 bg-primary text-white rounded-lg text-xs hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      确认提交
                    </button>
                    <button onClick={() => setShowAdjust(false)}
                      className="flex-1 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-100 transition-colors">
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* 流水列表 */}
              {user.pointsLog.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">暂无代币记录</div>
              ) : (
                <>
                  <div className="space-y-2">
                    {pointsItems.map((log) => (
                      <div key={log.id} className="flex items-start justify-between bg-slate-50 rounded-xl px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          <span className="text-base mt-0.5">{eventIcon[log.event]}</span>
                          <div>
                            <div className="text-sm text-slate-800 font-medium">{log.eventLabel}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{log.reason}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{log.time}</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <div className={`text-sm font-bold ${log.type === 'earn' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {log.type === 'earn' ? '+' : '-'}{log.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">余额 {log.balance.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <MiniPager page={pointsPage} total={pointsTotalPages} onChange={setPointsPage} />
                </>
              )}
            </div>
          )}

          {/* ── Tab 3：参赛记录 ──────────────────────────────────────────── */}
          {activeTab === 'matches' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-primary" />
                  <span className="text-sm font-medium text-slate-700">共参赛 {user.matchCount} 场</span>
                </div>
              </div>

              {user.matchHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">暂无参赛记录</div>
              ) : (
                <>
                  <div className="space-y-2">
                    {matchItems.map((m) => {
                      const rc = resultConfig[m.result];
                      return (
                        <div key={m.matchId} className="bg-slate-50 rounded-xl px-4 py-3 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium text-sm text-slate-800 leading-snug">{m.matchName}</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${rc.cls}`}>{rc.label}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>🎮 {m.game}</span>
                            <span>📅 {m.joinTime}</span>
                            {m.pointsEarned > 0 && (
                              <span className="text-emerald-600">+{m.pointsEarned} 代币</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{m.matchId}</div>
                        </div>
                      );
                    })}
                  </div>
                  <MiniPager page={matchPage} total={matchTotalPages} onChange={setMatchPage} />
                </>
              )}
            </div>
          )}

          {/* ── Tab 4：操作记录 ──────────────────────────────────────────── */}
          {activeTab === 'logs' && (
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">管理操作记录</span>
              </div>

              {user.adminLog.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">暂无操作记录</div>
              ) : (
                <div className="space-y-2">
                  {user.adminLog.map((log) => {
                    const actionConfig: Record<string, { label: string; cls: string }> = {
                      ban:           { label: '封禁用户', cls: 'bg-red-50 text-red-600' },
                      unban:         { label: '解除封禁', cls: 'bg-emerald-50 text-emerald-600' },
                      adjust_points: { label: '代币调整', cls: 'bg-blue-50 text-blue-600' },
                      change_role:   { label: '角色变更', cls: 'bg-purple-50 text-purple-600' },
                      mute:          { label: '社区禁言', cls: 'bg-orange-50 text-orange-600' },
                      unmute:        { label: '解除禁言', cls: 'bg-teal-50 text-teal-600' },
                    };
                    const ac = actionConfig[log.action] ?? { label: log.action, cls: 'bg-slate-100 text-slate-600' };
                    return (
                      <div key={log.id} className="bg-slate-50 rounded-xl px-4 py-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ac.cls}`}>{ac.label}</span>
                          <span className="text-xs text-slate-400">{log.time}</span>
                        </div>
                        <div className="text-sm text-slate-700">{log.reason}</div>
                        <div className="text-xs text-slate-400">操作人：{log.operator}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Tab 5：社区空间 ───────────────────────────────────────────── */}
          {activeTab === 'posts' && (
            <div className="p-5 space-y-4">

              {/* 社区档案卡片 */}
              {communityProfile ? (
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-xl p-4 space-y-3">
                  {/* Bio */}
                  {communityProfile.bio
                    ? <p className="text-xs text-slate-600 leading-relaxed">{communityProfile.bio}</p>
                    : <p className="text-xs text-slate-400">暂无简介</p>
                  }
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-lg p-2.5 text-center">
                      <div className="text-sm font-bold text-slate-800">{communityProfile.totalPosts}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">帖子</div>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 text-center">
                      <div className="text-sm font-bold text-slate-800">{communityProfile.followers.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">粉丝</div>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 text-center">
                      <div className="text-sm font-bold text-slate-800">{communityProfile.totalLikes.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">获赞</div>
                    </div>
                  </div>
                  {/* Risk badge */}
                  {communityProfile.riskLevel !== 'normal' && (
                    <div className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      communityProfile.riskLevel === 'banned'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {communityProfile.riskLevel === 'banned' ? '社区封禁' : '⚠ 风险用户'} · 累计举报 {communityProfile.reportCount} 次
                    </div>
                  )}
                  {/* Space images grid */}
                  {communityProfile.spaceImages && communityProfile.spaceImages.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">空间图片</div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {communityProfile.spaceImages.map((url, i) => (
                          <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center text-xs text-slate-400">
                  该用户暂无社区主页数据
                </div>
              )}

              {/* 社区禁言管理 */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">社区权限</div>
                {user.communityMuted && user.muteReason && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-2.5 space-y-0.5">
                    <div className="text-xs font-semibold text-orange-600">禁言原因</div>
                    <div className="text-xs text-orange-700">{user.muteReason}</div>
                    {user.muteTime && <div className="text-[10px] text-orange-400">禁言时间：{user.muteTime}</div>}
                  </div>
                )}
                {!muteConfirm ? (
                  <button
                    onClick={() => setMuteConfirm(true)}
                    className={`w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      user.communityMuted
                        ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    {user.communityMuted ? <><Volume2 size={12} />解除社区禁言</> : <><VolumeX size={12} />社区禁言</>}
                  </button>
                ) : (
                  <div className="space-y-2">
                    {!user.communityMuted && (
                      <input
                        value={muteReason}
                        onChange={(e) => setMuteReason(e.target.value)}
                        placeholder="请输入禁言原因（必填）"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!user.communityMuted && !muteReason.trim()) return;
                          onToggleMute(user.id, muteReason.trim() || undefined);
                          setMuteConfirm(false);
                          setMuteReason('');
                        }}
                        disabled={!user.communityMuted && !muteReason.trim()}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          user.communityMuted
                            ? 'bg-teal-500 text-white hover:bg-teal-600'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        确认{user.communityMuted ? '解除禁言' : '禁言'}
                      </button>
                      <button
                        onClick={() => { setMuteConfirm(false); setMuteReason(''); }}
                        className="flex-1 py-1.5 rounded-lg text-xs border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 发布的帖子 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={13} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    发布的帖子 {userPosts.length > 0 && `(${userPosts.length})`}
                  </span>
                </div>
                {postsItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">该用户暂无社区发帖</div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {postsItems.map(post => (
                        <button
                          key={post.id}
                          onClick={() => setCommunitySpacePost(post)}
                          className="w-full text-left bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 space-y-1.5 hover:bg-slate-100/60 hover:border-primary/20 transition-colors"
                        >
                          <div className="flex items-start gap-1.5">
                            {post.isPinned && <Pin size={11} className="text-primary mt-0.5 flex-shrink-0" />}
                            {post.isOfficial && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-bold flex-shrink-0">官方</span>
                            )}
                            <span className="text-sm text-slate-800 font-medium leading-snug flex-1">{post.title}</span>
                            <ChevronDown size={13} className="text-slate-300 flex-shrink-0 mt-0.5" />
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${POST_STATUS_COLORS[post.status]}`}>
                              {POST_STATUS_LABELS[post.status]}
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded-full">{post.category}</span>
                            <span className="flex items-center gap-0.5 text-xs text-slate-500"><Heart size={10} /> {post.likes}</span>
                            <span className="flex items-center gap-0.5 text-xs text-slate-500"><MessageSquare size={10} /> {post.comments}</span>
                            <span className="flex items-center gap-0.5 text-xs text-slate-400"><Eye size={10} /> {post.views}</span>
                            {post.reportCount > 0 && (
                              <span className="text-xs text-red-500">⚠ {post.reportCount}</span>
                            )}
                            <span className="text-xs text-slate-400 ml-auto">{post.createdAt.slice(0, 10)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <MiniPager page={postsPage} total={postsTotalPages} onChange={setPostsPage} />
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Tab 6：举办赛事 ───────────────────────────────────────────── */}
          {activeTab === 'events' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Swords size={15} className="text-primary" />
                  <span className="text-sm font-medium text-slate-700">共举办 {hostedMatches.length} 场赛事</span>
                </div>
              </div>

              {hostedMatches.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">该用户暂未举办赛事</div>
              ) : (
                <div className="space-y-2">
                  {hostedMatches.map(m => {
                    const statusMap: Record<string, { label: string; cls: string }> = {
                      draft:     { label: '草稿',   cls: 'bg-slate-100 text-slate-500' },
                      open:      { label: '报名中', cls: 'bg-emerald-50 text-emerald-600' },
                      closing:   { label: '即将截止', cls: 'bg-yellow-50 text-yellow-600' },
                      live:      { label: '进行中', cls: 'bg-blue-50 text-blue-600' },
                      ended:     { label: '已结束', cls: 'bg-slate-100 text-slate-500' },
                      cancelled: { label: '已取消', cls: 'bg-red-50 text-red-400' },
                    };
                    const approvalMap: Record<string, { label: string; cls: string }> = {
                      pending_review: { label: '审核中', cls: 'bg-yellow-50 text-yellow-600' },
                      approved:       { label: '已通过', cls: 'bg-emerald-50 text-emerald-600' },
                      rejected:       { label: '已驳回', cls: 'bg-red-50 text-red-500' },
                    };
                    const sc = statusMap[m.status];
                    const ac = m.approvalStatus ? approvalMap[m.approvalStatus] : null;
                    return (
                      <div key={m.id} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-slate-800 leading-snug flex-1">{m.name}</span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {ac && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${ac.cls}`}>{ac.label}</span>}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500">
                          <span>🎮 {m.game}</span>
                          <span>🏆 {m.prize}</span>
                          <span className="flex items-center gap-1"><MapPinned size={10} />{m.location}</span>
                          <span>👥 {m.signed}/{m.cap}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{m.matchStart} ~ {m.matchEnd}</span>
                          <span>创建于 {m.createdAt}</span>
                        </div>
                        {m.approvalStatus === 'rejected' && m.rejectionReason && (
                          <div className="bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5 text-xs text-red-600">
                            驳回原因：{m.rejectionReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
  return (
    <>
      {mainDrawer}
      {communitySpacePost && (
        <PostDetailDrawer
          post={communitySpacePost}
          zIndex="z-[70]"
          onClose={() => setCommunitySpacePost(null)}
          onUpdateStatus={(id, status) => setCommunitySpacePost(prev => prev ? { ...prev, status } : prev)}
          onTogglePin={(id) => setCommunitySpacePost(prev => prev ? { ...prev, isPinned: !prev.isPinned } : prev)}
        />
      )}
    </>
  );
}

// ── 信息行组件 ────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm text-slate-800">{value}</div>
      </div>
    </div>
  );
}
