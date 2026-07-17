import { useState, useMemo } from 'react';
import { Search, X, Heart, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { communityCommentData, communityPostData, communityUserProfiles, userListData, CommunityComment, CommunityPost, UserItem } from '../../data/mockData';
import UserDetailDrawer from '../UserManagement/UserDetailDrawer';
import PostDetailDrawer from './PostDetailDrawer';

type SortKey = 'createdAt' | 'likes' | 'reportCount';
type SortDir = 'asc' | 'desc';

const STATUS_LABELS: Record<CommunityComment['status'], string> = { normal: '正常', hidden: '已隐藏', deleted: '已删除' };
const STATUS_COLORS: Record<CommunityComment['status'], string> = {
  normal: 'bg-success-light text-success',
  hidden: 'bg-warning-light text-warning',
  deleted: 'bg-danger-light text-danger',
};
const PAGE_SIZE = 10;

export default function CommentManagement() {
  const [comments, setComments] = useState<CommunityComment[]>(communityCommentData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | CommunityComment['status']>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [drawerPost, setDrawerPost] = useState<CommunityPost | null>(null);
  const [drawerUser, setDrawerUser] = useState<UserItem | null>(null);
  const [confirmPending, setConfirmPending] = useState<{ commentId: number; action: 'hide' | 'delete' } | null>(null);

  const openUserDrawer = (name: string) => {
    const existing = userListData.find(u => u.nickname === name);
    if (existing) { setDrawerUser(existing); return; }
    const profile = communityUserProfiles.find(u => u.name === name);
    setDrawerUser({
      id: profile?.id ?? name,
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
  };

  const filtered = useMemo(() => {
    let data = comments;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(c => c.content.toLowerCase().includes(q) || c.authorName.toLowerCase().includes(q) || c.postTitle.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') data = data.filter(c => c.status === filterStatus);
    data = [...data].sort((a, b) => {
      const va = a[sortKey] as string | number;
      const vb = b[sortKey] as string | number;
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return data;
  }, [comments, search, filterStatus, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = pageData.length > 0 && pageData.every(c => selected.has(c.id));

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };
  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)
    : <ChevronDown size={12} className="opacity-30" />;

  const updateStatus = (ids: number[], status: CommunityComment['status']) => {
    setComments(prev => prev.map(c => ids.includes(c.id) ? { ...c, status } : c));
    setSelected(new Set());
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAll = () => {
    setSelected(prev => {
      const n = new Set(prev);
      allSelected ? pageData.forEach(c => n.delete(c.id)) : pageData.forEach(c => n.add(c.id));
      return n;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="搜索评论内容 / 作者 / 帖子标题…"
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
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="bg-primary-light border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm">
          <span className="text-primary font-medium">已选 {selected.size} 条</span>
          {confirmPending?.commentId === -1 ? (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-600">确认批量{confirmPending.action === 'delete' ? '删除' : '隐藏'} {selected.size} 条评论？</span>
              <button
                onClick={() => { updateStatus([...selected], confirmPending.action === 'delete' ? 'deleted' : 'hidden'); setConfirmPending(null); }}
                className={`text-xs px-2.5 py-1 rounded-lg text-white ${confirmPending.action === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} transition-colors`}
              >确认</button>
              <button onClick={() => setConfirmPending(null)} className="text-xs px-2.5 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setConfirmPending({ commentId: -1, action: 'hide' })} className="text-xs px-2.5 py-1 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors">批量隐藏</button>
              <button onClick={() => setConfirmPending({ commentId: -1, action: 'delete' })} className="text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">批量删除</button>
              <button onClick={() => setSelected(new Set())} className="text-slate-400 hover:text-slate-600 ml-1"><X size={16} /></button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left w-8">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">评论内容</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">作者</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">所属帖子</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('likes')}>
                <span className="flex items-center gap-1">点赞 <SortIcon k="likes" /></span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('reportCount')}>
                <span className="flex items-center gap-1">举报 <SortIcon k="reportCount" /></span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('createdAt')}>
                <span className="flex items-center gap-1">时间 <SortIcon k="createdAt" /></span>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pageData.map(comment => (
              <>
                <tr key={comment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(comment.id)} onChange={() => toggleSelect(comment.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <div>
                      <p className="text-slate-700 line-clamp-1 text-sm">{comment.content}</p>
                      <button
                        onClick={() => setExpandedId(expandedId === comment.id ? null : comment.id)}
                        className="text-xs text-primary hover:underline mt-0.5 flex items-center gap-0.5"
                      >
                        {expandedId === comment.id ? <><ChevronUp size={10} />收起</> : <><ChevronDown size={10} />展开</>}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openUserDrawer(comment.authorName)} className="flex items-center gap-2 group">
                      <img src={comment.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                      <span className="text-slate-600 text-sm whitespace-nowrap group-hover:text-primary transition-colors">{comment.authorName}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <button
                      onClick={() => {
                        const post = communityPostData.find(p => p.id === comment.postId);
                        if (post) setDrawerPost(post);
                      }}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors text-left"
                    >
                      <FileText size={10} className="flex-shrink-0" />
                      <span className="line-clamp-1">{comment.postTitle}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-slate-500"><Heart size={11} /> {comment.likes}</span>
                  </td>
                  <td className="px-4 py-3">
                    {comment.reportCount > 0
                      ? <span className="text-xs font-semibold text-danger bg-danger-light px-2 py-0.5 rounded-full">{comment.reportCount}</span>
                      : <span className="text-xs text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[comment.status]}`}>
                      {STATUS_LABELS[comment.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{comment.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    {confirmPending?.commentId === comment.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {confirmPending.action === 'delete' ? '确认删除？' : '确认隐藏？'}
                        </span>
                        <button
                          onClick={() => { updateStatus([comment.id], confirmPending.action === 'delete' ? 'deleted' : 'hidden'); setConfirmPending(null); }}
                          className={`text-xs px-2 py-0.5 rounded-lg text-white ${confirmPending.action === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} transition-colors`}
                        >确认</button>
                        <button onClick={() => setConfirmPending(null)} className="text-xs px-2 py-0.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        {comment.status === 'normal'
                          ? <button onClick={() => setConfirmPending({ commentId: comment.id, action: 'hide' })} className="text-xs px-2 py-1 border border-yellow-200 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors">隐藏</button>
                          : <button onClick={() => updateStatus([comment.id], 'normal')} className="text-xs px-2 py-1 border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">恢复</button>
                        }
                        {comment.status !== 'deleted' && (
                          <button onClick={() => setConfirmPending({ commentId: comment.id, action: 'delete' })} className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">删除</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
                {expandedId === comment.id && (
                  <tr key={`${comment.id}-expanded`} className="bg-slate-50">
                    <td colSpan={9} className="px-4 pb-3 pt-0">
                      <div className="ml-8 p-3 bg-white border border-slate-100 rounded-lg text-sm text-slate-600 leading-relaxed">
                        {comment.content}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {pageData.length === 0 && (
              <tr><td colSpan={9} className="text-center py-12 text-slate-400 text-sm">没有符合条件的评论</td></tr>
            )}
          </tbody>
        </table>
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
        {drawerPost && (
          <PostDetailDrawer
            post={drawerPost}
            onClose={() => setDrawerPost(null)}
            onUpdateStatus={(id, status) => {
              setDrawerPost(prev => prev ? { ...prev, status } : prev);
            }}
            onTogglePin={(id) => {
              setDrawerPost(prev => prev ? { ...prev, isPinned: !prev.isPinned } : prev);
            }}
          />
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">共 {filtered.length} 条</span>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">上一页</button>
            {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-2.5 py-1.5 text-xs border rounded-lg transition-colors ${page === p ? 'bg-primary text-white border-primary' : 'border-slate-200 hover:bg-slate-50'}`}>{p}</button>
            ))}
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
