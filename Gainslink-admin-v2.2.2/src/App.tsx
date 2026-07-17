import { useState } from 'react';
import { Bell, CalendarDays, ChevronDown, KeyRound, LogOut } from 'lucide-react';
import Sidebar, { type MenuKey } from './components/Sidebar';
import PlatformOverview from './components/PlatformOverview';
import MatchManagement from './components/MatchManagement';
import UserManagement from './components/UserManagement';
import TeamManagement from './components/TeamManagement';
import CommunityManagement, { type CommunitySubTab } from './components/CommunityManagement';
import LoginPage from './components/LoginPage';
import ChangePasswordModal from './components/ChangePasswordModal';
import { AuthProvider, useAuth } from './context/AuthContext';

const pageTitles: Record<MenuKey, string> = {
  'overview': '平台总览',
  'match-dashboard': '赛事运营看板',
  'match-list': '赛事管理',
  'match-organizer': '机构授权',
  'user-mgmt': '用户管理',
  'team-mgmt': '战队管理',
  'community-overview': '社区总览',
  'community-posts': '帖子管理',
  'community-comments': '评论管理',
  'community-reports': '举报审核',
};

function AdminApp() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<MenuKey>('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);

  if (!user) return <LoginPage />;

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar active={activeMenu} onChange={setActiveMenu} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>首页</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">{pageTitles[activeMenu]}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              <CalendarDays size={14} />
              今日
              <span className="text-slate-400">▼</span>
            </button>
            <button className="relative p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-xs text-slate-700">{user.username}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 w-40 overflow-hidden">
                    <button
                      onClick={() => { setShowChangePwd(true); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                      修改密码
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-danger hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      退出登录
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 内容区 */}
        {activeMenu === 'overview' && <PlatformOverview />}
        {(activeMenu === 'match-dashboard' || activeMenu === 'match-list' || activeMenu === 'match-organizer') && (
          <MatchManagement
            activeSubTab={
              activeMenu === 'match-dashboard'
                ? 'dashboard'
                : activeMenu === 'match-list'
                ? 'matches'
                : 'organizers'
            }
          />
        )}
        {activeMenu === 'user-mgmt' && <UserManagement />}
        {activeMenu === 'team-mgmt' && <TeamManagement />}
        {(activeMenu === 'community-overview' || activeMenu === 'community-posts' || activeMenu === 'community-comments' || activeMenu === 'community-reports') && (
          <CommunityManagement
            activeSubTab={activeMenu.replace('community-', '') as CommunitySubTab}
          />
        )}
      </main>

      {showChangePwd && <ChangePasswordModal onClose={() => setShowChangePwd(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminApp />
    </AuthProvider>
  );
}

export default App;
