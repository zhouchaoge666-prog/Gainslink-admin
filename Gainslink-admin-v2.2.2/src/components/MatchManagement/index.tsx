import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { generateMatchRounds, signupAuditData } from '../../data/mockData';
import type { MatchItem } from '../../data/mockData';
import { storage } from '../../lib/storage';
import { MatchProvider } from '../../context/MatchContext';
import type { TeamPoolItem } from './TeamPool';
import MatchDashboard from './MatchDashboard';
import MatchCardList from './MatchCardList';
import MatchDetail from './MatchDetail';
import MatchCreateFlow from './MatchCreateFlow';
import OrganizerManagement from './OrganizerManagement';

interface MatchManagementProps {
  activeSubTab: 'dashboard' | 'matches' | 'organizers';
}

export default function MatchManagement({ activeSubTab }: MatchManagementProps) {
  const [lastSubTab, setLastSubTab] = useState(activeSubTab);
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [initialDetailTab, setInitialDetailTab] = useState<string | undefined>(undefined);
  const [matches, setMatches] = useState<MatchItem[]>(() => storage.getMatches());

  useEffect(() => { storage.saveMatches(matches); }, [matches]);

  if (activeSubTab !== lastSubTab) {
    setLastSubTab(activeSubTab);
    setView('list');
    setSelectedMatch(null);
  }

  const handleViewMatch = (match: MatchItem, tab?: string) => {
    setSelectedMatch(match);
    setInitialDetailTab(tab);
    setView('detail');
  };

  const handleBack = () => {
    setView('list');
    setSelectedMatch(null);
  };

  const handleSaveMatch = (updated: MatchItem) => {
    setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setSelectedMatch(updated);
  };

  const handlePublish = (match: MatchItem) => {
    handleSaveMatch({ ...match, status: 'open' });
  };

  const handleStartMatch = (match: MatchItem) => {
    handleSaveMatch({ ...match, status: 'live' });
  };

  const handleEndMatch = (match: MatchItem) => {
    handleSaveMatch({ ...match, status: 'ended' });
  };

  const handleCancel = (match: MatchItem) => {
    handleSaveMatch({ ...match, status: 'cancelled' });
  };

  const handleChangeStatus = (match: MatchItem, status: MatchItem['status']) => {
    handleSaveMatch({ ...match, status });
  };

  const handleApproveMatch = (matchId: string) => {
    const updated = (m: MatchItem) => m.id === matchId ? { ...m, approvalStatus: 'approved' as const } : m;
    setMatches((prev) => prev.map(updated));
    setSelectedMatch((prev) => prev ? updated(prev) : prev);
  };

  const handleRejectMatch = (matchId: string, reason?: string) => {
    const updated = (m: MatchItem) => m.id === matchId ? { ...m, approvalStatus: 'rejected' as const, rejectionReason: reason } : m;
    setMatches((prev) => prev.map(updated));
    setSelectedMatch((prev) => prev ? updated(prev) : prev);
  };

  const handleResetToReview = (matchId: string) => {
    const updated = (m: MatchItem) => m.id === matchId ? { ...m, approvalStatus: 'pending_review' as const, rejectionReason: undefined } : m;
    setMatches((prev) => prev.map(updated));
    setSelectedMatch((prev) => prev ? updated(prev) : prev);
  };

  const handleCreateMatch = () => {
    setView('create');
  };

  const handleSaveCreatedMatch = (match: MatchItem, publish: boolean) => {
    const finalMatch: MatchItem = { ...match, status: publish ? 'open' : 'draft' };
    const rounds = generateMatchRounds(finalMatch, finalMatch.stages);
    storage.saveRounds(finalMatch.id, rounds);
    // 草稿用相同 ID 多次保存时做 upsert，避免列表重复
    setMatches((prev) => {
      const idx = prev.findIndex((m) => m.id === finalMatch.id);
      return idx >= 0
        ? prev.map((m) => (m.id === finalMatch.id ? finalMatch : m))
        : [finalMatch, ...prev];
    });
    // 发布时跳回列表；保存草稿时留在创建页面继续编辑
    if (publish) setView('list');
  };

  const getApprovedTeams = (matchId: string): TeamPoolItem[] => {
    // 优先读 localStorage 里用户实际审核的数据，回退到 mock 数据
    const saved = storage.getSignup(matchId);
    const source = saved.length > 0 ? saved : signupAuditData.filter((i) => i.matchId === matchId);
    return source
      .filter((item) => item.status === 'approved')
      .map((item) => ({
        userId: item.userId,
        userNickname: item.userNickname,
        teamName: item.teamName,
      }));
  };

  const selectedApprovedTeams = useMemo(() => selectedMatch ? getApprovedTeams(selectedMatch.id) : [], [selectedMatch]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {view === 'create' ? (
        <MatchProvider>
          <MatchCreateFlow
            onSave={handleSaveCreatedMatch}
            onCancel={() => setView('list')}
          />
        </MatchProvider>
      ) : view === 'detail' && selectedMatch ? (
        <MatchProvider initialMatch={selectedMatch} initialTeams={selectedApprovedTeams}>
          <div className="flex-1 overflow-y-auto bg-bg">
            <div className="sticky top-0 z-10 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft size={16} />
                返回赛事列表
              </button>
              <div className="text-sm font-medium text-slate-800">{selectedMatch.name}</div>
              <div className="w-20" />
            </div>
            <div className="p-5">
              <MatchDetail
                match={selectedMatch}
                onSave={handleSaveMatch}
                onPublish={handlePublish}
                onStartMatch={handleStartMatch}
                onEndMatch={handleEndMatch}
                onCancel={handleCancel}
                onChangeStatus={handleChangeStatus}
                onApprove={handleApproveMatch}
                onReject={handleRejectMatch}
                onResetToReview={handleResetToReview}
                initialTab={initialDetailTab}
              />
            </div>
          </div>
        </MatchProvider>
      ) : (
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeSubTab === 'dashboard' && (
            <MatchDashboard
              matches={matches}
              onViewMatch={handleViewMatch}
              onApprove={handleApproveMatch}
              onReject={handleRejectMatch}
            />
          )}
          {activeSubTab === 'matches' && (
            <MatchCardList
              matches={matches}
              onViewMatch={handleViewMatch}
              onCreateMatch={handleCreateMatch}
              onApprove={handleApproveMatch}
              onReject={handleRejectMatch}
              onResetToReview={handleResetToReview}
            />
          )}
          {activeSubTab === 'organizers' && <OrganizerManagement />}
          <div className="h-4" />
        </div>
      )}
    </div>
  );
}
