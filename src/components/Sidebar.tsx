import { useState } from 'react';
import { LayoutDashboard, Trophy, Users, LogOut, HelpCircle, ChevronDown } from 'lucide-react';

export type MenuKey = 'overview' | 'match-bet' | 'match-mgmt' | 'user-mgmt';

interface SidebarProps {
  active: MenuKey;
  onChange: (key: MenuKey) => void;
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  const [dashboardOpen, setDashboardOpen] = useState(true);

  return (
    <aside className="w-52 bg-sidebar text-white flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-5 border-b border-slate-700">
        <div className="font-bold text-lg tracking-wide">Gainslink管理后台</div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {/* 数据看板 - 可展开 */}
        <div>
          <button
            onClick={() => setDashboardOpen(!dashboardOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
              active === 'overview' || active === 'match-bet'
                ? 'bg-primary text-white'
                : 'text-slate-400 hover:bg-sidebar-hover hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="flex-1">数据看板</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${dashboardOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {dashboardOpen && (
            <div className="mt-1 ml-6 space-y-0.5">
              <button
                onClick={() => onChange('overview')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  active === 'overview'
                    ? 'bg-primary/20 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover'
                }`}
              >
                平台总览
              </button>
              <button
                onClick={() => onChange('match-bet')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  active === 'match-bet'
                    ? 'bg-primary/20 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover'
                }`}
              >
                赛事竞猜
              </button>
            </div>
          )}
        </div>

        {/* 赛事管理 */}
        <button
          onClick={() => onChange('match-mgmt')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
            active === 'match-mgmt'
              ? 'bg-primary text-white'
              : 'text-slate-400 hover:bg-sidebar-hover hover:text-slate-200'
          }`}
        >
          <Trophy size={18} />
          <span className="flex-1">赛事管理</span>
        </button>

        {/* 用户管理 */}
        <button
          onClick={() => onChange('user-mgmt')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
            active === 'user-mgmt'
              ? 'bg-primary text-white'
              : 'text-slate-400 hover:bg-sidebar-hover hover:text-slate-200'
          }`}
        >
          <Users size={18} />
          <span className="flex-1">用户管理</span>
        </button>
      </nav>

      <div className="p-3 border-t border-slate-700 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-sidebar-hover hover:text-slate-200 transition-colors text-left">
          <HelpCircle size={18} />
          <span>帮助中心</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-sidebar-hover hover:text-slate-200 transition-colors text-left">
          <LogOut size={18} />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
