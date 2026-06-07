import { useState } from 'react';
import { Bell, CalendarDays } from 'lucide-react';
import Sidebar, { type MenuKey } from './components/Sidebar';
import PlatformOverview from './components/PlatformOverview';
import KpiCards from './components/KpiCards';
import TrendChart from './components/TrendChart';
import CoreDashboard from './components/CoreDashboard';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🚧</div>
        <div className="text-lg font-medium text-slate-700">{title}</div>
        <div className="text-sm text-slate-400 mt-1">功能开发中，敬请期待</div>
      </div>
    </div>
  );
}

function MatchBetPage() {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      <KpiCards />
      <TrendChart />
      <CoreDashboard />
      <div className="h-4"></div>
    </div>
  );
}

const pageTitles: Record<MenuKey, string> = {
  'overview': '平台总览',
  'match-bet': '赛事竞猜',
  'match-mgmt': '赛事管理',
  'user-mgmt': '用户管理',
};

function App() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('overview');

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
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                A
              </div>
              <span className="text-xs text-slate-700">Admin</span>
            </div>
          </div>
        </header>

        {/* 内容区 */}
        {activeMenu === 'overview' && <PlatformOverview />}
        {activeMenu === 'match-bet' && <MatchBetPage />}
        {activeMenu === 'match-mgmt' && <PlaceholderPage title="赛事管理" />}
        {activeMenu === 'user-mgmt' && <PlaceholderPage title="用户管理" />}
      </main>
    </div>
  );
}

export default App;
