import { useState, useMemo } from 'react';
import { Search, Pin, Trash2, X, ChevronUp, ChevronDown, MessageSquare, Heart, ShieldCheck, ShieldX, Clock, PenSquare, Flame } from 'lucide-react';
import { communityPostData, communityUserProfiles, userListData, CommunityPost, UserItem } from '../../data/mockData';
import UserDetailDrawer from '../UserManagement/UserDetailDrawer';
import PostDetailDrawer from './PostDetailDrawer';
import OfficialPostModal, { OfficialPostData } from './OfficialPostModal';

type SortKey = 'createdAt' | 'likes' | 'comments' | 'reportCount' | 'views' | 'heat';
type SortDir = 'asc' | 'desc';
type QuickFilter = 'all' | 'pinned' | 'hot' | 'official' | 'failed';

const STATUS_LABELS: Record<CommunityPost['status'], string> = { normal: '正常', hidden: '已隐藏', deleted: '已删除' };
const STATUS_COLORS: Record<CommunityPost['status'], string> = {
  normal: 'bg-emerald-50 text-emerald-600',
  hidden: 'bg-yellow-50 text-yellow-600',
  deleted: 'bg-red-50 text-red-500',
};
const AUTO_REVIEW_CONFIG = {
  passed: { label: '已通过', Icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  failed: { label: '未通过', Icon: ShieldX, color: 'text-red-500', bg: 'bg-red-50' },
  pending: { label: '审核中', Icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
};
const TOPICS = ['全部话题', 'League of Legends', 'Valorant', 'Mobile Legends', 'Dota 2', 'CS2', 'General', 'Announcement'];
const PAGE_SIZE = 10;

// KPI card used in the stats header
function KpiCard({ label, value, sub, color, onClick }: {
  label: string; value: number | string; sub?: string; color: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-4 text-left transition-colors ${onClick ? 'hover:border-primary/40 cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`text-xl font-bold ${color}`}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </button>
  );
}

function heatScore(p: CommunityPost) { return p.likes + p.comments * 2 + p.views * 0.1; }

export default function PostManagement() {
  const [posts, setPosts] = useState<CommunityPost[]>(communityPostData);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | CommunityPost['status']>('all');
  const [filterTopic, setFilterTopic] = useState('全部话题');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [drawerPost, setDrawerPost] = useState<CommunityPost | null>(null);
  const [drawerUser, setDrawerUser] = useState<UserItem | null>(null);
  const [showOfficialPost, setShowOfficialPost] = useState(false);
  const [hotPosts, setHotPosts] = useState<Set<number>>(new Set());
  const [confirmPending, setConfirmPending] = useState<{ postId: number; action: 'pin' | 'hot' | 'delete' } | null>(null);

  const hotThreshold = useMemo(() => {
    const scores = posts.filter(p => p.status === 'normal').map(heatScore);
    if (!scores.length) return 0;
    return scores.sort((a, b) => b - a)[Math.floor(scores.length * 0.3)] ?? 0;
  }, [posts]);

  // KPI stats
  const statsActive = useMemo(() => posts.filter(p => p.status === 'normal' && (p.likes > 50 || p.comments > 10)).length, [posts]);
  const statsFailed = useMemo(() => posts.filter(p => p.autoReview === 'failed' && p.status !== 'deleted').length, [posts]);
  const statsHot = useMemo(() => posts.filter(p => p.status === 'normal' && heatScore(p) >= hotThreshold).length, [posts, hotThreshold]);
  const statsPinned = useMemo(() => posts.filter(p => p.isPinned).length, [posts]);

  const filtered = useMemo(() => {
    let data = posts;
    if (quickFilter === 'pinned') data = data.filter(p => p.isPinned);
    else if (quickFilter === 'failed') data = data.filter(p => p.autoReview === 'failed');
    else if (quickFilter === 'hot') data = data.filter(p => p.status === 'normal' && heatScore(p) >= hotThreshold);
    else if (quickFilter === 'official') data = data.filter(p => p.isOfficial);

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p => p.title.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') data = data.filter(p => p.status === filterStatus);
    if (filterTopic !== '全部话题') data = data.filter(p => p.category === filterTopic);

    data = [...data].sort((a, b) => {
      const va = sortKey === 'heat' ? heatScore(a) : a[sortKey] as string | number;
      const vb = sortKey === 'heat' ? heatScore(b) : b[sortKey] as string | number;
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return data;
  }, [posts, quickFilter, search, filterStatus, filterTopic, sortKey, sortDir, hotThreshold]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };
  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)
    : <ChevronDown size={12} className="opacity-30" />;

  const updateStatus = (ids: number[], status: CommunityPost['status']) => {
    setPosts(prev => prev.map(p => ids.includes(p.id) ? { ...p, status } : p));
    if (drawerPost && ids.includes(drawerPost.id)) setDrawerPost(prev => prev ? { ...prev, status } : prev);
  };
  const toggleHot = (id: number) => {
    setHotPosts(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const togglePin = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
    if (drawerPost?.id === id) setDrawerPost(prev => prev ? { ...prev, isPinned: !prev.isPinned } : prev);
  };


  const openUserDrawer = (authorId: string) => {
    const profile = communityUserProfiles.find(u => u.id === authorId);
    const name = profile?.name ?? authorId;
    const existing = userListData.find(u => u.nickname === name);
    if (existing) {
      setDrawerUser(existing);
    } else {
      setDrawerUser({
        id: profile?.id ?? authorId,
        nickname: name,
        username: name.toLowerCase().replace(/\s/g, '_'),
        email: '—', country: '—',
        regTime: profile?.joinedAt ?? '—',
        points: profile?.totalLikes ?? 0,
        matchCount: 0, source: 'organic', role: 'player',
        status: profile?.riskLevel === 'banned' ? 'banned' : 'active',
        banReason: profile?.riskLevel === 'banned' ? '社区违规' : undefined,
        pointsLog: [], matchHistory: [], adminLog: [],
      });
    }
    setDrawerPost(null);
  };

  const handleOfficialPost = (data: OfficialPostData) => {
    const newPost: CommunityPost = {
      id: Date.now(),
      authorId: 'official',
      authorName: 'Gainslink Official',
      authorAvatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80',
      title: data.title || '官方公告',
      content: data.content,
      category: data.category,
      likes: 0, comments: 0, shares: 0, views: 0, reportCount: 0,
      isPinned: data.isPinned,
      isOfficial: true,
      status: 'normal',
      autoReview: 'passed',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  // Confirm execute
  const executeConfirm = (post: CommunityPost) => {
    if (!confirmPending || confirmPending.postId !== post.id) return;
    if (confirmPending.action === 'pin') togglePin(post.id);
    else if (confirmPending.action === 'hot') toggleHot(post.id);
    else if (confirmPending.action === 'delete') updateStatus([post.id], 'deleted');
    setConfirmPending(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">

      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="全部帖子" value={posts.length} sub={`正常 ${posts.filter(p => p.status === 'normal').length} 篇`} color="text-slate-800" />
        <KpiCard label="活跃互动" value={statsActive} sub="点赞或评论活跃" color="text-emerald-500" />
        <KpiCard label="热门帖子" value={statsHot} sub="热度 Top 30%" color="text-orange-500"
          onClick={() => { setQuickFilter('hot'); setPage(1); }} />
        <KpiCard label="审核未通过" value={statsFailed} sub={statsFailed > 0 ? '点击查看' : '无异常'} color={statsFailed > 0 ? 'text-red-500' : 'text-emerald-500'}
          onClick={statsFailed > 0 ? () => { setQuickFilter('failed'); setPage(1); } : undefined} />
      </div>

      {/* 快捷筛选 + 发布按钮 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {([
            { key: 'all' as QuickFilter, label: '全部' },
            { key: 'pinned' as QuickFilter, label: '置顶', Icon: Pin },
            { key: 'hot' as QuickFilter, label: '热门', Icon: Flame },
            { key: 'official' as QuickFilter, label: '官方', Icon: PenSquare },
          ]).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { setQuickFilter(key); setPage(1); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                quickFilter === key
                  ? key === 'hot' ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {Icon && <Icon size={12} />}
              {label}
            </button>
          ))}
          {/* 审核未通过 — 弱化为警示筛选 */}
          {statsFailed > 0 && (
            <button
              onClick={() => { setQuickFilter(quickFilter === 'failed' ? 'all' : 'failed'); setPage(1); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                quickFilter === 'failed'
                  ? 'bg-red-500 text-white border-red-500 shadow-sm'
                  : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
              }`}
            >
              <ShieldX size={12} />
              审核未通过 {statsFailed}
            </button>
          )}
        </div>
        <button
          onClick={() => setShowOfficialPost(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex-shrink-0"
        >
          <PenSquare size={14} />
          发布官方帖子
        </button>
      </div>

      {/* Sub-filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="搜索帖子标题 / 作者名…"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setPage(1); }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-slate-600"
          >
            <option value="all">全部状态</option>
            <option value="normal">正常</option>
            <option value="hidden">已隐藏</option>
            <option value="deleted">已删除</option>
          </select>
          <select
            value={filterTopic}
            onChange={e => { setFilterTopic(e.target.value); setPage(1); }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-slate-600"
          >
            {TOPICS.map(c => <option key={c}>{c}</option>)}
          </select>
          {(filterStatus !== 'all' || filterTopic !== '全部话题' || search) && (
            <button
              onClick={() => { setFilterStatus('all'); setFilterTopic('全部话题'); setSearch(''); setPage(1); }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <X size={12} /> 清除筛选
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[200px]" />
            <col className="w-[130px]" />
            <col className="w-[110px]" />
            <col className="w-[90px]" />
            <col className="w-[70px]" />
            <col className="w-[90px]" />
            <col className="w-[80px]" />
            <col className="w-[60px]" />
            <col className="w-[72px]" />
            <col className="w-[100px]" />
            <col className="w-[220px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">帖子标题</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">作者</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">话题</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">自动审核</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('views')}>
                <span className="flex items-center gap-1">浏览 <SortIcon k="views" /></span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('likes')}>
                <span className="flex items-center gap-1">互动 <SortIcon k="likes" /></span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('heat')}>
                <span className="flex items-center gap-1 text-orange-500">热度 <SortIcon k="heat" /></span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('reportCount')}>
                <span className="flex items-center gap-1">举报 <SortIcon k="reportCount" /></span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('createdAt')}>
                <span className="flex items-center gap-1">发布时间 <SortIcon k="createdAt" /></span>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pageData.map(post => {
              const ar = AUTO_REVIEW_CONFIG[post.autoReview];
              const ArIcon = ar.Icon;
              return (
                <tr key={post.id} className={`hover:bg-slate-50/50 transition-colors ${post.autoReview === 'failed' ? 'bg-red-50/20' : post.autoReview === 'pending' ? 'bg-yellow-50/20' : ''}`}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {post.isPinned && <Pin size={12} className="text-primary flex-shrink-0" />}
                      {post.isOfficial && <span className="px-1.5 py-0.5 bg-primary-light text-primary text-[10px] font-bold rounded flex-shrink-0">官方</span>}
                      <button onClick={() => setDrawerPost(post)} className="text-slate-800 font-medium hover:text-primary transition-colors text-left truncate">
                        {post.title}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => openUserDrawer(post.authorId)} className="flex items-center gap-1.5 group min-w-0">
                      <img src={post.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                      <span className="text-xs text-slate-600 group-hover:text-primary transition-colors truncate">{post.authorName}</span>
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full truncate block w-fit max-w-full">{post.category}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${ar.bg} ${ar.color}`}>
                      <ArIcon size={11} />{ar.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap">{post.views.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-0.5"><Heart size={10} /> {post.likes}</span>
                      <span className="text-slate-200">·</span>
                      <span className="flex items-center gap-0.5"><MessageSquare size={10} /> {post.comments}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {(() => {
                      const score = Math.round(heatScore(post));
                      const isHot = score >= hotThreshold && hotThreshold > 0;
                      return (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isHot ? 'bg-orange-50 text-orange-500' : 'text-slate-400'
                        }`}>
                          {isHot && <Flame size={10} />}{score}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-3">
                    {post.reportCount > 0
                      ? <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{post.reportCount}</span>
                      : <span className="text-xs text-slate-300">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[post.status]}`}>
                      {STATUS_LABELS[post.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-400 whitespace-nowrap">{post.createdAt}</td>
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    {confirmPending?.postId === post.id ? (
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {confirmPending.action === 'delete' ? '确认删除？'
                            : confirmPending.action === 'pin' ? (post.isPinned ? '确认取消置顶？' : '确认置顶？')
                            : (hotPosts.has(post.id) ? '确认取消热门？' : '确认上热门？')}
                        </span>
                        <button
                          onClick={() => executeConfirm(post)}
                          className={`text-xs px-2 py-0.5 rounded-lg text-white ${confirmPending.action === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'} transition-colors`}
                        >
                          确认
                        </button>
                        <button
                          onClick={() => setConfirmPending(null)}
                          className="text-xs px-2 py-0.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <button
                          onClick={() => setConfirmPending({ postId: post.id, action: 'pin' })}
                          className={`text-xs px-2 py-1 border rounded-lg transition-colors whitespace-nowrap w-[56px] text-center ${
                            post.isPinned ? 'border-primary/30 bg-primary-light text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {post.isPinned ? '取消置顶' : '置顶'}
                        </button>
                        <button
                          onClick={() => setConfirmPending({ postId: post.id, action: 'hot' })}
                          className={`text-xs px-2 py-1 border rounded-lg transition-colors flex items-center justify-center gap-0.5 whitespace-nowrap w-[60px] ${
                            hotPosts.has(post.id)
                              ? 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Flame size={10} />{hotPosts.has(post.id) ? '取消热门' : '上热门'}
                        </button>
                        <button
                          onClick={() => setConfirmPending({ postId: post.id, action: 'delete' })}
                          className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                        >
                          删除
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {pageData.length === 0 && (
              <tr><td colSpan={12} className="text-center py-12 text-slate-400 text-sm">没有符合条件的帖子</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">共 {filtered.length} 条</span>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">上一页</button>
            {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-2.5 py-1.5 text-xs border rounded-lg transition-colors ${page === p ? 'bg-primary text-white border-primary' : 'border-slate-200 hover:bg-slate-50'}`}>{p}</button>
            ))}
            <button disabled={page >= totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">下一页</button>
          </div>
        </div>
      </div>

      {/* Post detail drawer (overlay) */}
      {drawerPost && (
        <PostDetailDrawer
          post={drawerPost}
          isHot={hotPosts.has(drawerPost.id)}
          onClose={() => setDrawerPost(null)}
          onUpdateStatus={(id, status) => updateStatus([id], status)}
          onTogglePin={togglePin}
          onToggleHot={toggleHot}
          onOpenUser={openUserDrawer}
        />
      )}

      {/* User drawer */}
      {drawerUser && (
        <UserDetailDrawer
          user={drawerUser}
          onClose={() => setDrawerUser(null)}
          onToggleBan={() => setDrawerUser(prev => prev ? { ...prev, status: prev.status === 'active' ? 'banned' : 'active' } : prev)}
          onAdjustPoints={() => {}}
          onChangeRole={(_, role) => setDrawerUser(prev => prev ? { ...prev, role } : prev)}
          onToggleMute={() => setDrawerUser(prev => prev ? { ...prev, communityMuted: !prev.communityMuted } : prev)}
        />
      )}

      {/* Official post modal */}
      {showOfficialPost && (
        <OfficialPostModal
          onClose={() => setShowOfficialPost(false)}
          onPost={handleOfficialPost}
        />
      )}
    </div>
  );
}
