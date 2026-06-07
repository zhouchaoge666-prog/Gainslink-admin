import { useState, useCallback } from 'react';
import { Users, Ticket, Coins, TrendingUp, UserPlus, Activity, Trophy, Gift, RefreshCw } from 'lucide-react';
import { kpiData } from '../data/mockData';

const iconMap: Record<string, React.ElementType> = {
  '实时在线': Users,
  '今日投注笔数': Ticket,
  '今日投注流水': Coins,
  '今日结算盈亏': TrendingUp,
  '新增投注用户': UserPlus,
  '进行中赛事': Activity,
  '竞猜胜利/失败人次': Trophy,
  '今日投放积分': Gift,
};

const statusStyles = {
  normal: { bg: 'bg-white', border: 'border-slate-200', change: 'text-emerald-600' },
  danger: { bg: 'bg-red-50', border: 'border-red-200', change: 'text-red-600' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', change: 'text-amber-600' },
};

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function KpiCards() {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setSpinning(false);
    }, 600);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">实时看板</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            更新时间：{formatTime(lastRefresh)}
          </span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={spinning ? 'animate-spin' : ''} />
            刷新
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((item) => {
          const Icon = iconMap[item.label] || Activity;
          const style = statusStyles[item.status];
          const isNegative = item.value.startsWith('-');
          return (
            <div
              key={item.label}
              className={`${style.bg} border ${style.border} rounded-xl p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Icon size={14} />
                  <span>{item.label}</span>
                </div>
                {item.status === 'danger' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded">预警</span>
                )}
                {item.status === 'warning' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded">关注</span>
                )}
              </div>
              {item.value === '' && item.subValues && item.subValues.length > 0 ? (
                <div className="flex items-center gap-3 mb-1">
                  {item.subValues.map((sub, idx) => (
                    <div key={sub.label} className="flex items-center gap-3">
                      {idx > 0 && <div className="w-px h-8 bg-slate-200" />}
                      <div>
                        <div className="text-[10px] text-slate-400">{sub.label}</div>
                        <div className="text-xl font-bold text-slate-800">{sub.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-2xl font-bold mb-1 ${isNegative ? 'text-red-600' : 'text-slate-800'}`}>
                  {item.value}
                </div>
              )}
              {item.value !== '' && item.subValues && item.subValues.length > 0 && (
                <div className="flex flex-col gap-0.5 mb-1.5">
                  {item.subValues.map((sub) => {
                    const subIsPositive = sub.change && sub.change.startsWith('+');
                    const subIsNegative = sub.change && sub.change.startsWith('-');
                    return (
                      <div key={sub.label} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{sub.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 font-medium">{sub.value}</span>
                          {sub.change && (
                            <span
                              className={`text-[10px] font-medium ${
                                subIsPositive ? 'text-emerald-500' : subIsNegative ? 'text-red-500' : 'text-slate-400'
                              }`}
                            >
                              {sub.change}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <span className={style.change}>{item.change}</span>
                {item.changeValue && (
                  <span className="text-slate-400">{item.changeValue}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
