import { useState } from 'react';
import { LayoutDashboard, Trophy, Users, LogOut, HelpCircle, ChevronDown, Shield } from 'lucide-react';

export type MenuKey = 'overview' | 'match-dashboard' | 'match-list' | 'match-organizer' | 'user-mgmt' | 'team-mgmt';

const matchMgmtKeys: MenuKey[] = ['match-dashboard', 'match-list', 'match-organizer', 'team-mgmt'];

interface SidebarProps {
  active: MenuKey;
  onChange: (key: MenuKey) => void;
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  const [matchMgmtOpen, setMatchMgmtOpen] = useState(true);

  const isMatchMgmtActive = matchMgmtKeys.includes(active);

  const subItem = (key: MenuKey, label: string) => (
    <button
      onClick={() => onChange(key)}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
        active === key
          ? 'bg-primary/20 text-white'
          : 'text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-52 bg-sidebar text-white flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-5 border-b border-slate-700">
        <div className="font-bold text-lg tracking-wide">Gainslink管理后台</div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {/* 数据看板 — 平级直链 */}
        <button
          onClick={() => onChange('overview')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
            active === 'overview'
              ? 'bg-primary text-white'
              : 'text-slate-400 hover:bg-sidebar-hover hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="flex-1">数据看板</span>
        </button>

        {/* 赛事管理 — 可展开，包含战队管理 */}
        <div>
          <button
            onClick={() => setMatchMgmtOpen(!matchMgmtOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
              isMatchMgmtActive
                ? 'bg-primary text-white'
                : 'text-slate-400 hover:bg-sidebar-hover hover:text-slate-200'
            }`}
          >
            <Trophy size={18} />
            <span className="flex-1">赛事管理</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${matchMgmtOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {matchMgmtOpen && (
            <div className="mt-1 ml-6 space-y-0.5">
              {subItem('match-dashboard', '赛事运营看板')}
              {subItem('match-list', '赛事管理')}
              {subItem('match-organizer', '机构授权')}
              {subItem('team-mgmt', '战队管理')}
            </div>
          )}
        </div>

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
