import { X, Mail, Trophy, Calendar, MapPin, Shield, Ban, Coins } from 'lucide-react';
import { userListData } from '../../data/mockData';

interface UserDrawerProps {
  userId: string;
  onClose: () => void;
}

export default function UserDrawer({ userId, onClose }: UserDrawerProps) {
  const user = userListData.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="fixed inset-0 z-[60] flex">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
          <div className="h-14 border-b border-slate-200 flex items-center justify-between px-5">
            <span className="font-medium text-slate-800">用户信息</span>
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">未找到用户</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-5">
          <span className="font-medium text-slate-800">用户信息</span>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
              {user.nickname.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800">{user.nickname}</div>
              <div className="text-sm text-slate-500">{user.id}</div>
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${
                  user.status === 'active'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {user.status === 'active' ? <Shield size={11} /> : <Ban size={11} />}
                {user.status === 'active' ? '正常' : '已封禁'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">国家/地区</div>
                <div className="text-sm text-slate-800">{user.country}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">注册时间</div>
                <div className="text-sm text-slate-800">{user.regTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">来源</div>
                <div className="text-sm text-slate-800">{user.source === 'invite' ? '邀请注册' : '自然流量'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Coins size={16} />
                <span className="text-sm font-medium">积分余额</span>
              </div>
              <div className="text-xl font-bold text-slate-800">{user.points.toLocaleString()}</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                <Trophy size={16} />
                <span className="text-sm font-medium">参与赛事</span>
              </div>
              <div className="text-xl font-bold text-slate-800">{user.matchCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
