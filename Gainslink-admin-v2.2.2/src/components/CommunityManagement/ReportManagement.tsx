import { useState, useMemo } from 'react';
import { Search, CheckCircle, XCircle, ChevronDown, ChevronUp, X, RotateCcw, FileText } from 'lucide-react';
import { communityReportData, communityPostData, communityCommentData, communityUserProfiles, userListData, CommunityReport, CommunityPost, UserItem } from '../../data/mockData';
import UserDetailDrawer from '../UserManagement/UserDetailDrawer';
import PostDetailDrawer from './PostDetailDrawer';

type SortKey = 'submittedAt';
type SortDir = 'asc' | 'desc';

const STATUS_LABELS: Record<CommunityReport['status'], string> = { pending: '待处理', resolved: '已处理', dismissed: '已驳回' };
const STATUS_COLORS: Record<CommunityReport['status'], string> = {
  pending: 'bg-warning-light text-warning',
  resolved: 'bg-success-light text-success',
  dismissed: 'bg-slate-100 text-slate-500',
};
const TYPE_LABELS: Record<CommunityReport['type'], string> = { post: '帖子', comment: '评论' };
const PAGE_SIZE = 10;

export default function ReportManagement() {
  const [reports, setReports] = useState<CommunityReport[]>(communityReportData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | CommunityReport['status']>('all');
  const [filterType, setFilterType] = useState<'all' | CommunityReport['type']>('all');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [drawerReport, setDrawerReport] = useState<CommunityReport | null>(null);
  const [drawerUser, setDrawerUser] = useState<UserItem | null>(null);
  const [drawerPost, setDrawerPost] = useState<CommunityPost | null>(null);

  const openContentDrawer = (report: CommunityReport) => {
    if (report.type === 'post') {
      const post = communityPostData.find(p => p.id === report.targetId);
      if (post) { setDrawerPost(post); setDrawerReport(null); }
    } else {
      // comment type: find the parent post
      const comment = communityCommentData.find(c => c.id === report.targetId);
      const postId = comment?.postId;
      const post = postId ? communityPostData.find(p => p.id === postId) : communityPostData.find(p => p.title === report.postTitle);
      if (post) { setDrawerPost(post); setDrawerReport(null); }
    }
  };

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
    let data = reports;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.targetContent.toLowerCase().includes(q) ||
        r.targetAuthorName.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') data = data.filter(r => r.status === filterStatus);
    if (filterType !== 'all') data = data.filter(r => r.type === filterType);
    data = [...data].sort((a, b) => {
      return sortDir === 'asc'
        ? a.submittedAt.localeCompare(b.submittedAt)
        : b.submittedAt.localeCompare(a.submittedAt);
    });
    return data;
  }, [reports, search, filterStatus, filterType, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const updateStatus = (id: number, status: CommunityReport['status']) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (drawerReport?.id === id) setDrawerReport(prev => prev ? { ...prev, status } : prev);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Pending Alert */}
        {pendingCount > 0 && (
          <div className="bg-warning-light border border-warning/30 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-warning font-bold text-lg">{pendingCount}</span>
            <span className="text-sm text-warning font-medium">条举报待处理，请及时审核</span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="搜索举报内容 / 被举报人 / 举报原因…"
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value as typeof filterType); setPage(1); }}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-slate-600"
            >
              <option value="all">全部类型</option>
              <option value="post">帖子</option>
              <option value="comment">评论</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setPage(1); }}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-slate-600"
            >
              <option value="all">全部状态</option>
              <option value="pending">待处理</option>
              <option value="resolved">已处理</option>
              <option value="dismissed">已驳回</option>
            </select>
            <button
              onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1.5 text-sm text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
            >
              时间 {sortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-8">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">被举报内容</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">类型</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">被举报人</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">举报人</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">原因</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">提交时间</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pageData.map((report, idx) => (
                <tr key={report.id} className={`hover:bg-slate-50 transition-colors ${report.status === 'pending' ? 'bg-warning-light/30' : ''}`}>
                  <td className="px-4 py-3 text-xs text-slate-400">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <button
                      onClick={() => openContentDrawer(report)}
                      className="text-left group"
                    >
                      <p className="text-slate-600 text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">{report.targetContent}</p>
                      {report.type === 'comment' && report.postTitle && (
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <FileText size={10} className="flex-shrink-0" />
                          <span className="truncate">{report.postTitle}</span>
                        </p>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${report.type === 'post' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {TYPE_LABELS[report.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => openUserDrawer(report.targetAuthorName)} className="text-sm text-slate-600 hover:text-primary transition-colors">
                      {report.targetAuthorName}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => openUserDrawer(report.reporterName)} className="text-sm text-slate-500 hover:text-primary transition-colors">
                      {report.reporterName}
                    </button>
                  </td>
                  <td className="px-4 py-3 max-w-[150px]">
                    <p className="text-xs text-slate-500 line-clamp-1">{report.reason}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[report.status]}`}>
                      {STATUS_LABELS[report.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{report.submittedAt}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button onClick={() => setDrawerReport(report)} className="text-xs px-2 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">详情</button>
                      <button onClick={() => openContentDrawer(report)} className="text-xs px-2 py-1 border border-primary/30 text-primary rounded-lg hover:bg-primary-light transition-colors">查看帖子</button>
                      {report.status === 'pending' ? (
                        <>
                          <button onClick={() => updateStatus(report.id, 'resolved')} className="text-xs px-2 py-1 border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">通过</button>
                          <button onClick={() => updateStatus(report.id, 'dismissed')} className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">驳回</button>
                        </>
                      ) : (
                        <button onClick={() => updateStatus(report.id, 'pending')} className="text-xs px-2 py-1 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors">重审</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-slate-400 text-sm">没有符合条件的举报</td></tr>
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
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">下一页</button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {drawerReport && (
        <div className="w-80 border-l border-slate-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">举报详情</h3>
            <button onClick={() => setDrawerReport(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[drawerReport.status]}`}>
                {STATUS_LABELS[drawerReport.status]}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${drawerReport.type === 'post' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                {TYPE_LABELS[drawerReport.type]}
              </span>
            </div>
            {/* Target Content */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">被举报内容</p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                {drawerReport.type === 'comment' && drawerReport.postTitle && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                    <FileText size={11} className="text-slate-400 flex-shrink-0" />
                    <span className="font-medium text-slate-600">所属帖子：</span>
                    <span className="truncate">{drawerReport.postTitle}</span>
                  </div>
                )}
                <p className="text-sm text-slate-600 leading-relaxed">{drawerReport.targetContent}</p>
                <button onClick={() => openUserDrawer(drawerReport.targetAuthorName)} className="text-xs text-slate-400 hover:text-primary transition-colors">
                  作者：{drawerReport.targetAuthorName}
                </button>
              </div>
            </div>
            {/* Report Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">举报人</span>
                <button onClick={() => openUserDrawer(drawerReport.reporterName)} className="text-slate-700 font-medium hover:text-primary transition-colors">
                  {drawerReport.reporterName}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">举报原因</span>
                <span className="text-slate-700 font-medium text-right max-w-[160px]">{drawerReport.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">提交时间</span>
                <span className="text-slate-700">{drawerReport.submittedAt}</span>
              </div>
            </div>
            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">内容处理</p>
              <button
                onClick={() => openContentDrawer(drawerReport)}
                className="w-full flex items-center gap-2 px-3 py-2 border border-primary/30 text-primary rounded-lg text-sm font-medium transition-colors hover:bg-primary-light"
              >
                <FileText size={14} /> 查看所属帖子完整内容
              </button>
              {drawerReport.type === 'post' ? (
                <button
                  onClick={() => {
                    // Mark post as deleted in communityPostData (local state)
                    updateStatus(drawerReport.id, 'resolved');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium transition-colors hover:bg-red-50"
                >
                  <XCircle size={14} /> 删除该帖子
                </button>
              ) : (
                <button
                  onClick={() => updateStatus(drawerReport.id, 'resolved')}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium transition-colors hover:bg-red-50"
                >
                  <XCircle size={14} /> 删除该评论
                </button>
              )}
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">举报审核</p>
              {drawerReport.status === 'pending' ? (
                <>
                  <button
                    onClick={() => updateStatus(drawerReport.id, 'resolved')}
                    className="w-full flex items-center gap-2 px-3 py-2 border border-emerald-200 text-emerald-600 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-50"
                  >
                    <CheckCircle size={14} /> 确认违规（举报成立）
                  </button>
                  <button
                    onClick={() => updateStatus(drawerReport.id, 'dismissed')}
                    className="w-full flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors hover:bg-slate-50"
                  >
                    <XCircle size={14} /> 驳回举报（内容合规）
                  </button>
                </>
              ) : (
                <button
                  onClick={() => updateStatus(drawerReport.id, 'pending')}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-yellow-200 text-yellow-600 rounded-lg text-sm font-medium transition-colors hover:bg-yellow-50"
                >
                  <RotateCcw size={14} /> 重新审核（撤销当前决定）
                </button>
              )}
            </div>
          </div>
        </div>
      )}
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
          onUpdateStatus={(id, status) => setDrawerPost(prev => prev ? { ...prev, status } : prev)}
          onTogglePin={(id) => setDrawerPost(prev => prev ? { ...prev, isPinned: !prev.isPinned } : prev)}
        />
      )}
    </div>
  );
}
