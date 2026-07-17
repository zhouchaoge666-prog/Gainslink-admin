import { LayoutDashboard, FileText, MessageSquare, AlertTriangle } from 'lucide-react';
import CommunityOverview from './CommunityOverview';
import PostManagement from './PostManagement';
import CommentManagement from './CommentManagement';
import ReportManagement from './ReportManagement';
import { communityReportData } from '../../data/mockData';

export type CommunitySubTab = 'overview' | 'posts' | 'comments' | 'reports';

interface Props {
  activeSubTab: CommunitySubTab;
}

const pendingReports = communityReportData.filter(r => r.status === 'pending').length;

const TABS: { key: CommunitySubTab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: '社区总览', icon: LayoutDashboard },
  { key: 'posts', label: '帖子管理', icon: FileText },
  { key: 'comments', label: '评论管理', icon: MessageSquare },
  { key: 'reports', label: '举报审核', icon: AlertTriangle },
];

export default function CommunityManagement({ activeSubTab }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {activeSubTab === 'overview' && <CommunityOverview />}
      {activeSubTab === 'posts' && <PostManagement />}
      {activeSubTab === 'comments' && <CommentManagement />}
      {activeSubTab === 'reports' && <ReportManagement />}
    </div>
  );
}
