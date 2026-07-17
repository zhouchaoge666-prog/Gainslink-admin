import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FileText, MessageSquare, AlertTriangle, TrendingUp, Eye, Flame, ShieldCheck, ShieldX, Clock, ThumbsUp } from 'lucide-react';
import {
  communityTrendData, communityPostData, communityReportData,
  communityDailyStats, communityHourlyData, communityCategoryData,
  communityWeeklyData, communityMonthlyData, communityPeriodStats,
  communityAutoReviewLog, CommunityPost,
} from '../../data/mockData';
import PostDetailDrawer from './PostDetailDrawer';

type Period = 'day' | 'week' | 'month';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

const pendingReports = communityReportData.filter(r => r.status === 'pending').length;
const normalPosts = communityPostData.filter(p => p.status === 'normal').length;
const hiddenPosts = communityPostData.filter(p => p.status === 'hidden').length;
const deletedPosts = communityPostData.filter(p => p.status === 'deleted').length;
const totalViews = communityPostData.reduce((s, p) => s + p.views, 0);
const totalLikes = communityPostData.reduce((s, p) => s + p.likes, 0);

const topPostsData = [...communityPostData]
  .filter(p => p.status === 'normal')
  .sort((a, b) => (b.likes + b.comments * 2 + b.views * 0.1) - (a.likes + a.comments * 2 + a.views * 0.1))
  .slice(0, 5);

const AR_CONFIG = {
  passed: { label: '已通过', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: ShieldCheck },
  failed: { label: '未通过', color: 'text-red-500', bg: 'bg-red-50', Icon: ShieldX },
  pending: { label: '审核中', color: 'text-yellow-600', bg: 'bg-yellow-50', Icon: Clock },
};

function delta(now: number, prev: number) {
  const d = now - prev;
  const pct = prev > 0 ? Math.round((d / prev) * 100) : 0;
  return { delta: d, pct, up: d >= 0 };
}

function KpiCard({ label, value, icon: Icon, iconBg, iconColor, trend, trendLabel, sub }: {
  label: string; value: string | number;
  icon: React.ElementType; iconBg: string; iconColor: string;
  trend?: { up: boolean; pct: number; delta: number }; trendLabel?: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon size={16} className={iconColor} />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      {trend && (
        <div className={`text-xs mt-1 flex items-center gap-1 ${trend.up ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend.up ? '↑' : '↓'} {Math.abs(trend.pct)}%
          <span className="text-slate-400 ml-1">{trendLabel ?? '较上期'} ({trend.up ? '+' : ''}{trend.delta})</span>
        </div>
      )}
      {sub && !trend && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

const PERIOD_LABELS: Record<Period, string> = { day: '今日', week: '本周', month: '本月' };

export default function CommunityOverview() {
  const [period, setPeriod] = useState<Period>('day');
  const [drawerPost, setDrawerPost] = useState<CommunityPost | null>(null);
  const [posts, setPosts] = useState(communityPostData);

  const stats = communityPeriodStats[period];
  const postsDelta = delta(stats.posts, stats.prevPosts);
  const commentsDelta = delta(stats.comments, stats.prevComments);
  const viewsDelta = delta(stats.views, stats.prevViews);
  const likesDelta = stats.prevLikes > 0 ? delta(stats.likes, stats.prevLikes) : undefined;

  const autoReviewPassRate = Math.round(
    (stats.autoReviewPassed / (stats.autoReviewPassed + stats.autoReviewFailed)) * 100
  );

  const trendLabel = period === 'day' ? '较昨日' : period === 'week' ? '较上周' : '较上月';

  const chartData = period === 'day' ? communityHourlyData : period === 'week' ? communityWeeklyData : communityMonthlyData;
  const chartXKey = period === 'day' ? 'hour' : period === 'week' ? 'week' : 'month';

  const topPosts = [...posts]
    .filter(p => p.status === 'normal')
    .sort((a, b) => (b.likes + b.comments * 2 + b.views * 0.1) - (a.likes + a.comments * 2 + a.views * 0.1))
    .slice(0, 5);

  const handleUpdateStatus = (id: number, status: CommunityPost['status']) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    if (drawerPost?.id === id) setDrawerPost(prev => prev ? { ...prev, status } : prev);
  };
  const handleTogglePin = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
    if (drawerPost?.id === id) setDrawerPost(prev => prev ? { ...prev, isPinned: !prev.isPinned } : prev);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">

      {/* Period toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">社区数据看板</h2>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(['day', 'week', 'month'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                period === p ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label={`${PERIOD_LABELS[period]}新帖`} value={stats.posts.toLocaleString()}
          icon={FileText} iconBg="bg-primary-light" iconColor="text-primary"
          trend={postsDelta} trendLabel={trendLabel}
        />
        <KpiCard
          label={`${PERIOD_LABELS[period]}评论`} value={stats.comments.toLocaleString()}
          icon={MessageSquare} iconBg="bg-purple-50" iconColor="text-purple-500"
          trend={commentsDelta} trendLabel={trendLabel}
        />
        <KpiCard
          label={`${PERIOD_LABELS[period]}浏览量`} value={stats.views.toLocaleString()}
          icon={Eye} iconBg="bg-sky-50" iconColor="text-sky-500"
          trend={viewsDelta} trendLabel={trendLabel}
        />
        <KpiCard
          label={`${PERIOD_LABELS[period]}点赞`} value={stats.likes.toLocaleString()}
          icon={ThumbsUp} iconBg="bg-rose-50" iconColor="text-rose-500"
          trend={likesDelta} trendLabel={trendLabel}
          sub={likesDelta ? undefined : '当期点赞总量'}
        />
      </div>

      {/* Auto-review */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{PERIOD_LABELS[period]}自动审核</h2>
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            label="审核通过" value={stats.autoReviewPassed}
            icon={ShieldCheck} iconBg="bg-emerald-50" iconColor="text-emerald-500"
            sub="自动放行，正常发布"
          />
          <KpiCard
            label="审核拒绝" value={stats.autoReviewFailed}
            icon={ShieldX} iconBg="bg-red-50" iconColor="text-red-500"
            sub="触发规则，已自动隐藏"
          />
          <KpiCard
            label="待审核" value={stats.autoReviewPending}
            icon={Clock} iconBg="bg-yellow-50" iconColor="text-yellow-600"
            sub="正在队列中处理"
          />
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">{PERIOD_LABELS[period]}通过率</span>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{autoReviewPassRate}%</div>
            <div className="mt-2">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${autoReviewPassRate}%` }} />
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-1.5">
              累计拦截违规帖 {communityDailyStats.totalAutoReviewFailed} 篇
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Trend chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">
            {period === 'day' ? '今日发帖分时趋势' : period === 'week' ? '近4周发帖趋势' : '近6月发帖趋势'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {period === 'day' ? '每2小时一段' : period === 'week' ? '按自然周统计' : '按月汇总'}
          </p>
          <ResponsiveContainer width="100%" height={160}>
            {period === 'day' ? (
              <AreaChart data={communityHourlyData}>
                <defs>
                  <linearGradient id="postGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickFormatter={h => `${h}:00`} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip labelFormatter={h => `${h}:00`} />
                <Area type="monotone" dataKey="posts" name="新帖" stroke="#3b82f6" strokeWidth={2} fill="url(#postGrad)" />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey={chartXKey} tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="posts" name="帖子" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Posts/comments line chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">
            {period === 'day' ? '近7天帖子/评论趋势' : period === 'week' ? '近4周帖子/评论' : '近6月帖子/评论'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">含今日截至当前数据</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={period === 'day' ? communityTrendData : chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={period === 'day' ? 'date' : chartXKey} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="posts" name="帖子" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="comments" name="评论" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">内容分类分布</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={communityCategoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                {communityCategoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val) => `${val}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {communityCategoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-slate-500 truncate max-w-[110px]">{item.name}</span>
                </div>
                <span className="text-slate-700 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: content health + hot posts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Content health */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">内容健康状态（全量）</h3>
          <div className="space-y-3">
            {[
              { label: '正常发布', value: normalPosts, color: '#10b981', text: 'text-emerald-600' },
              { label: '已隐藏', value: hiddenPosts, color: '#f59e0b', text: 'text-yellow-600' },
              { label: '已删除', value: deletedPosts, color: '#ef4444', text: 'text-red-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{item.label}</span>
                  <span className={`font-semibold ${item.text}`}>{item.value}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.round(item.value / communityPostData.length * 100)}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">累计数据</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: '总浏览量', value: totalViews.toLocaleString() },
                { label: '总点赞数', value: totalLikes.toLocaleString() },
                { label: '待处理举报', value: pendingReports, danger: pendingReports > 0 },
                { label: '帖子总数', value: communityPostData.length },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-2.5">
                  <div className="text-slate-400">{item.label}</div>
                  <div className={`font-bold mt-0.5 ${item.danger ? 'text-red-500' : 'text-slate-700'}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hot posts */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-slate-700">热门帖子 Top 5</h3>
            <span className="ml-auto text-xs text-slate-400">热度 = 点赞×1 + 评论×2 + 浏览×0.1</span>
          </div>
          <div className="space-y-3">
            {topPosts.map((post, i) => {
              const heat = Math.round(post.likes + post.comments * 2 + post.views * 0.1);
              const maxHeat = Math.round(topPosts[0].likes + topPosts[0].comments * 2 + topPosts[0].views * 0.1);
              return (
                <div key={post.id} className="flex items-center gap-3 group">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    i === 0 ? 'bg-orange-500 text-white' : i === 1 ? 'bg-orange-400 text-white' : i === 2 ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setDrawerPost(post)}
                      className="text-sm text-slate-700 truncate font-medium hover:text-primary transition-colors block w-full text-left"
                    >
                      {post.title}
                    </button>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400">{post.authorName}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400 flex items-center gap-0.5"><Eye size={10} /> {post.views.toLocaleString()}</span>
                      <span className="text-xs text-slate-400">👍 {post.likes}</span>
                      <span className="text-xs text-slate-400">💬 {post.comments}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        post.category === 'League of Legends' ? 'bg-blue-50 text-blue-600' :
                        post.category === 'Valorant' ? 'bg-red-50 text-red-500' :
                        post.category === 'Announcement' ? 'bg-primary-light text-primary' :
                        'bg-slate-100 text-slate-500'
                      }`}>{post.category}</span>
                    </div>
                    <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-200" style={{ width: `${Math.round(heat / maxHeat * 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-bold text-orange-500">{heat.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">热度值</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Auto-review log */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <AlertTriangle size={15} className="text-yellow-500" />
          <h3 className="text-sm font-semibold text-slate-700">近期自动审核记录</h3>
          <span className="ml-auto text-xs text-slate-400">API 审核服务记录</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">帖子</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">发帖人</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">审核结果</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">置信度</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">拦截原因</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">审核时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {communityAutoReviewLog.map(log => {
              const cfg = AR_CONFIG[log.result];
              const CfgIcon = cfg.Icon;
              return (
                <tr key={log.id} className={`hover:bg-slate-50 transition-colors ${log.result === 'failed' ? 'bg-red-50/30' : log.result === 'pending' ? 'bg-yellow-50/30' : ''}`}>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-slate-700 font-medium text-xs truncate">{log.postTitle}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{log.authorName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <CfgIcon size={10} />{cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {log.confidence > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${log.confidence >= 95 ? 'bg-emerald-500' : log.confidence >= 80 ? 'bg-yellow-400' : 'bg-slate-300'}`}
                            style={{ width: `${log.confidence}%` }}
                          />
                        </div>
                        <span>{log.confidence}%</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[260px]">
                    {log.reason
                      ? <p className="text-xs text-red-500 truncate">{log.reason}</p>
                      : <span className="text-xs text-slate-300">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{log.reviewedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Post detail drawer */}
      {drawerPost && (
        <PostDetailDrawer
          post={drawerPost}
          onClose={() => setDrawerPost(null)}
          onUpdateStatus={handleUpdateStatus}
          onTogglePin={handleTogglePin}
        />
      )}
    </div>
  );
}
