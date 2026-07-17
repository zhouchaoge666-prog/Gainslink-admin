import { useMemo, useState } from 'react';
import { Search, RotateCcw, LayoutGrid, List, Trophy, Plus, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import type { MatchItem } from '../../data/mockData';
import MatchCard from './MatchCard';

interface MatchCardListProps {
  matches: MatchItem[];
  onViewMatch: (match: MatchItem) => void;
  onCreateMatch?: () => void;
  onApprove?: (matchId: string) => void;
  onReject?: (matchId: string, reason?: string) => void;
  onResetToReview?: (matchId: string) => void;
}

const statusTabs: { key: string; label: string }[] = [
  { key: 'pending_review', label: '待审核' },
  { key: 'open',           label: '报名中' },
  { key: 'live',           label: '进行中' },
  { key: 'draft',          label: '未发布' },
  { key: 'ended',          label: '已结束' },
  { key: 'cancelled',      label: '已取消' },
  { key: 'all',            label: '全部' },
];

const games = ['MLBB', 'Dota 2', 'PUBG', 'eFootball'];

export default function MatchCardList({ matches, onViewMatch, onCreateMatch, onApprove, onReject, onResetToReview }: MatchCardListProps) {
  const [statusTab, setStatusTab]       = useState('open');
  const [gameFilter, setGameFilter]     = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');   // all | admin | user
  const [orgFilter, setOrgFilter]       = useState('all');
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    statusTabs.forEach(({ key }) => {
      if (key === 'pending_review') {
        counts[key] = matches.filter((m) => m.source === 'user' && m.approvalStatus === 'pending_review').length;
      } else if (key === 'all') {
        counts[key] = matches.length;
      } else if (key === 'draft') {
        counts[key] = matches.filter((m) => m.status === 'draft' && !(m.source === 'user' && m.approvalStatus === 'pending_review')).length;
      } else if (key === 'open') {
        counts[key] = matches.filter((m) => m.status === 'open' || m.status === 'closing').length;
      } else {
        counts[key] = matches.filter((m) => m.status === key).length;
      }
    });
    return counts;
  }, [matches]);

  // 动态举办方列表
  const organizers = useMemo(() => {
    const names = Array.from(new Set(matches.map((m) => m.organizerName))).sort();
    return names;
  }, [matches]);

  const filteredMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return matches.filter((item) => {
      // ── Tab 过滤 ──
      let matchTab: boolean;
      if (statusTab === 'pending_review') {
        matchTab = item.source === 'user' && item.approvalStatus === 'pending_review';
      } else if (statusTab === 'all') {
        matchTab = true;
      } else if (statusTab === 'draft') {
        // 未发布 tab 不包含待审核赛事（它们在"待审核"tab）
        matchTab = item.status === 'draft' && !(item.source === 'user' && item.approvalStatus === 'pending_review');
      } else {
        matchTab =
          item.status === statusTab ||
          (statusTab === 'open' && (item.status === 'open' || item.status === 'closing'));
      }

      // ── 游戏 ──
      const matchGame = gameFilter === 'all' || item.game === gameFilter;

      // ── 来源 ──
      const matchSource =
        sourceFilter === 'all' ||
        (sourceFilter === 'admin' && item.source === 'admin') ||
        (sourceFilter === 'user'  && item.source === 'user');

      // ── 举办方 ──
      const matchOrg = orgFilter === 'all' || item.organizerName === orgFilter;

      // ── 时间范围（赛事开始日期）──
      const matchDate =
        (!dateFrom || item.matchStart >= dateFrom) &&
        (!dateTo   || item.matchStart <= dateTo);

      // ── 搜索 ──
      const matchSearch =
        query === '' ||
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.organizerName.toLowerCase().includes(query) ||
        item.game.toLowerCase().includes(query);

      return matchTab && matchGame && matchSource && matchOrg && matchDate && matchSearch;
    });
  }, [matches, statusTab, gameFilter, sourceFilter, orgFilter, dateFrom, dateTo, searchQuery]);

  const hasAdvancedFilter = sourceFilter !== 'all' || orgFilter !== 'all' || dateFrom || dateTo;

  const handleReset = () => {
    setStatusTab('open');
    setGameFilter('all');
    setSourceFilter('all');
    setOrgFilter('all');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };

  // 待审核 tab 的卡片才传审核操作；全部 tab 也传（以防有 pending_review 混入）
  const showReviewActions = statusTab === 'pending_review' || statusTab === 'all';

  return (
    <div className="space-y-4">
      {/* ── 状态 Tabs ── */}
      <div className="flex flex-wrap items-center gap-2">
        {statusTabs.map((tab) => {
          const count = tabCounts[tab.key] ?? 0;
          const isActive = statusTab === tab.key;
          const isPendingReview = tab.key === 'pending_review';
          return (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`relative flex items-center gap-1.5 px-4 py-2 text-xs rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`inline-flex items-center justify-center text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full ${
                  isPendingReview
                    ? isActive ? 'bg-white text-primary' : 'bg-violet-500 text-white'
                    : isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 筛选栏 ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
        {/* 主行 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 搜索 */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-[160px]">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索赛事名称 / ID / 举办方"
              className="text-sm text-slate-700 outline-none bg-transparent w-full placeholder:text-slate-400"
            />
          </div>

          {/* 游戏 */}
          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="text-sm px-3 py-1.5 border border-slate-200 rounded-lg outline-none bg-transparent text-slate-700 cursor-pointer"
          >
            <option value="all">全部游戏</option>
            {games.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          {/* 来源 */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className={`text-sm px-3 py-1.5 border rounded-lg outline-none bg-transparent cursor-pointer ${
              sourceFilter !== 'all' ? 'border-primary text-primary' : 'border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">全部来源</option>
            <option value="admin">平台创建</option>
            <option value="user">授权方举办</option>
          </select>

          {/* 高级筛选切换 */}
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 border rounded-lg transition-colors ${
              hasAdvancedFilter
                ? 'border-primary text-primary bg-primary/5'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            高级筛选
            {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {hasAdvancedFilter && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw size={12} />
              重置
            </button>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                <List size={14} />
              </button>
            </div>
            {onCreateMatch && (
              <button
                onClick={onCreateMatch}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} />
                创办赛事
              </button>
            )}
          </div>
        </div>

        {/* 高级筛选展开行 */}
        {showAdvanced && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            {/* 举办方 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 shrink-0">举办方</span>
              <select
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                className={`text-sm px-3 py-1.5 border rounded-lg outline-none bg-transparent cursor-pointer ${
                  orgFilter !== 'all' ? 'border-primary text-primary' : 'border-slate-200 text-slate-700'
                }`}
              >
                <option value="all">全部举办方</option>
                {organizers.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* 赛事时间范围 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 shrink-0">赛事时间</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`text-sm px-3 py-1.5 border rounded-lg outline-none bg-transparent cursor-pointer ${
                  dateFrom ? 'border-primary text-primary' : 'border-slate-200 text-slate-700'
                }`}
              />
              <span className="text-xs text-slate-400">至</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`text-sm px-3 py-1.5 border rounded-lg outline-none bg-transparent cursor-pointer ${
                  dateTo ? 'border-primary text-primary' : 'border-slate-200 text-slate-700'
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 结果摘要 ── */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>共 <span className="font-medium text-slate-700">{filteredMatches.length}</span> 场赛事</span>
        {statusTab === 'pending_review' && (
          <div className="flex items-center gap-1.5 text-violet-600">
            <ShieldCheck size={13} />
            审核通过后赛事将在 Gainslink 前端展示，报名及赛事管理由授权方负责
          </div>
        )}
      </div>

      {/* ── 赛事卡片 ── */}
      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
          <Trophy size={48} className="mb-3 opacity-30" />
          <div className="text-sm">暂无符合条件的赛事</div>
          {(hasAdvancedFilter || gameFilter !== 'all' || sourceFilter !== 'all' || searchQuery) && (
            <button onClick={handleReset} className="mt-3 text-xs text-primary hover:underline">清除筛选条件</button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onView={onViewMatch}
              onApprove={showReviewActions ? onApprove : undefined}
              onReject={showReviewActions ? onReject : undefined}
              onResetToReview={showReviewActions ? onResetToReview : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
