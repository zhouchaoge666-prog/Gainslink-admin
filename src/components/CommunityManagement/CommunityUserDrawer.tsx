import { useState } from 'react';
import { X, Calendar, AlertTriangle, Shield, FileText, Ban, ShieldCheck, ChevronLeft, ChevronRight, VolumeX, Volume2 } from 'lucide-react';
import { CommunityUserProfile, CommunityPost, communityPostData } from '../../data/mockData';

const RISK_CONFIG: Record<CommunityUserProfile['riskLevel'], { label: string; cls: string }> = {
  normal:  { label: '正常',   cls: 'bg-emerald-50 text-emerald-600' },
  warning: { label: '风险用户', cls: 'bg-warning-light text-warning' },
  banned:  { label: '已封禁',  cls: 'bg-red-50 text-red-600' },
};

const POST_STATUS_COLORS: Record<CommunityPost['status'], string> = {
  normal:  'bg-success-light text-success',
  hidden:  'bg-warning-light text-warning',
  deleted: 'bg-danger-light text-danger',
};
const POST_STATUS_LABELS: Record<CommunityPost['status'], string> = {
  normal: '正常', hidden: '已隐藏', deleted: '已删除',
};

const ITEMS_PER_PAGE = 8;

interface Props {
  user: CommunityUserProfile;
  onClose: () => void;
  onOpenPost?: (post: CommunityPost) => void;
  onToggleMute?: (userId: string) => void;
}

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

export default function CommunityUserDrawer({ user, onClose, onOpenPost, onToggleMute }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'posts'>('info');
  const [postsPage, setPostsPage] = useState(1);

  const userPosts = communityPostData.filter(p => p.authorId === user.id);
  const postsTotalPages = Math.max(1, Math.ceil(userPosts.length / ITEMS_PER_PAGE));
  const postsItems = userPosts.slice((postsPage - 1) * ITEMS_PER_PAGE, postsPage * ITEMS_PER_PAGE);

  const riskCfg = RISK_CONFIG[user.riskLevel];

  const tabs = [
    { key: 'info' as const,  label: '基本信息' },
    { key: 'posts' as const, label: `发布的帖子 (${userPosts.length})` },
  ];

  return (
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
            <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800 text-base">{user.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${riskCfg.cls}`}>
                  {user.riskLevel === 'banned' && <Ban size={10} />}
                  {user.riskLevel === 'normal' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  {riskCfg.label}
                </span>
                {user.isMuted && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">
                    <VolumeX size={10} />禁言中
                  </span>
                )}
                {user.reportCount > 0 && (
                  <span className="text-xs text-danger flex items-center gap-1">
                    <AlertTriangle size={10} /> 被举报 {user.reportCount} 次
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{user.id}</div>
            </div>
          </div>
          {user.bio && (
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">{user.bio}</p>
          )}
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

          {/* ── 基本信息 ── */}
          {activeTab === 'info' && (
            <div className="p-5 space-y-4">
              {/* 账户信息 */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">账户信息</div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <InfoRow icon={<Calendar size={14} />} label="加入时间" value={user.joinedAt} />
                  <InfoRow icon={<Shield size={14} />} label="风险等级" value={riskCfg.label} />
                  <InfoRow icon={<AlertTriangle size={14} />} label="累计被举报" value={`${user.reportCount} 次`} />
                </div>
              </div>

              {/* 社区数据 */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">社区数据</div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <InfoRow icon={<FileText size={14} />} label="发帖总数" value={`${user.totalPosts} 篇`} />
                  <InfoRow icon={<span className="text-xs">👍</span>} label="获赞总数" value={user.totalLikes.toLocaleString()} />
                  <InfoRow icon={<span className="text-xs">👥</span>} label="粉丝数量" value={user.followers.toLocaleString()} />
                </div>
              </div>

              {/* 管理操作 */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">管理操作</div>
                <div className="space-y-2">
                  {user.riskLevel === 'normal' && (
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-warning-light text-warning hover:bg-warning hover:text-white rounded-xl text-sm font-medium transition-colors">
                      <AlertTriangle size={14} /> 标记为风险用户
                    </button>
                  )}
                  {user.riskLevel === 'warning' && (
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-success-light text-success hover:bg-success hover:text-white rounded-xl text-sm font-medium transition-colors">
                      <ShieldCheck size={14} /> 解除风险标记
                    </button>
                  )}
                  <button
                    onClick={() => onToggleMute?.(user.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      user.isMuted
                        ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    {user.isMuted ? <><Volume2 size={14} />解除社区禁言</> : <><VolumeX size={14} />社区禁言</>}
                  </button>
                  {user.riskLevel !== 'banned' ? (
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors">
                      <Ban size={14} /> 封禁账号
                    </button>
                  ) : (
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-medium transition-colors">
                      <ShieldCheck size={14} /> 解除封禁
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── 发布的帖子 ── */}
          {activeTab === 'posts' && (
            <div className="p-5 space-y-3">
              {postsItems.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">该用户暂无帖子</div>
              )}
              <div className="space-y-2">
                {postsItems.map(post => (
                  <button
                    key={post.id}
                    onClick={() => onOpenPost?.(post)}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-3 transition-colors"
                  >
                    <p className="text-sm text-slate-800 font-medium line-clamp-2 leading-snug">{post.title}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${POST_STATUS_COLORS[post.status]}`}>
                        {POST_STATUS_LABELS[post.status]}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded-full">{post.category}</span>
                      <span className="text-xs text-slate-400">👍 {post.likes}</span>
                      <span className="text-xs text-slate-400">💬 {post.comments}</span>
                      <span className="text-xs text-slate-400 ml-auto">{post.createdAt.slice(0, 10)}</span>
                    </div>
                  </button>
                ))}
              </div>
              {postsTotalPages > 1 && (
                <MiniPager page={postsPage} total={postsTotalPages} onChange={setPostsPage} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
