import { useState } from 'react';
import { AlertTriangle, UserX, BarChart3, CheckCircle2, Clock, AlertOctagon } from 'lucide-react';
import { riskAlerts, matchConcentration, churnUsers, recentMatches } from '../data/mockData';

const tabs = [
  { key: 'risk', label: '风控监控', icon: AlertTriangle },
  { key: 'churn', label: '流失预警', icon: UserX },
  { key: 'review', label: '赛事复盘', icon: BarChart3 },
];

function RiskPanel() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <AlertOctagon size={14} className="text-danger" />
          异常投注预警
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="text-left px-3 py-2 rounded-l-lg">用户ID</th>
                <th className="text-left px-3 py-2">异常类型</th>
                <th className="text-left px-3 py-2">赛事</th>
                <th className="text-right px-3 py-2">投注额</th>
                <th className="text-center px-3 py-2 rounded-r-lg">状态</th>
              </tr>
            </thead>
            <tbody>
              {riskAlerts.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-mono text-slate-700">{row.id}</td>
                  <td className="px-3 py-2 text-slate-600">{row.type}</td>
                  <td className="px-3 py-2 text-slate-600">{row.match}</td>
                  <td className="px-3 py-2 text-right text-slate-700 font-medium">{row.amount.toLocaleString()}</td>
                  <td className="px-3 py-2 text-center">
                    {row.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 text-warning">
                        <Clock size={12} /> 待审
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-success">
                        <CheckCircle2 size={12} /> 已处理
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <BarChart3 size={14} className="text-primary" />
          单赛事投注集中度
        </div>
        <div className="space-y-2">
          {matchConcentration.map((m) => (
            <div key={m.match} className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-700">{m.match}</span>
                {m.risk === 'high' ? (
                  <span className="text-[10px] px-1.5 py-0.5 bg-danger-light text-danger rounded">极高风险</span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 bg-success-light text-success rounded">正常</span>
                )}
              </div>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div className="bg-primary" style={{ width: `${m.optionA}%` }} />
                <div className="bg-warning" style={{ width: `${m.draw}%` }} />
                <div className="bg-danger" style={{ width: `${m.optionB}%` }} />
              </div>
              <div className="flex gap-3 mt-1 text-[10px] text-slate-500">
                <span>A胜 {m.optionA}%</span>
                <span>平局 {m.draw}%</span>
                <span>B胜 {m.optionB}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChurnPanel() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {churnUsers.map((u) => (
          <div key={u.days} className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-slate-800">{u.count}</div>
            <div className="text-xs text-slate-500 mt-0.5">{u.days}日未投注</div>
            <div className="text-[10px] text-danger mt-1">高价值: {u.highValue}人</div>
          </div>
        ))}
      </div>
      <div className="bg-warning-light rounded-lg p-3 flex items-start gap-2">
        <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700">
          <div className="font-medium">投注频次下降预警</div>
          <div className="text-slate-500 mt-0.5">近5名用户连续3场投注量递减，建议触发关怀推送</div>
        </div>
      </div>
    </div>
  );
}

function ReviewPanel() {
  return (
    <div className="space-y-3">
      {recentMatches.map((m) => (
        <div key={m.name} className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-800">{m.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                m.result === 'A胜' ? 'bg-primary-light text-primary' :
                m.result === 'B胜' ? 'bg-danger-light text-danger' :
                'bg-warning-light text-warning'
              }`}>{m.result}</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              m.tag === '热门' ? 'bg-danger-light text-danger' :
              m.tag === '冷门' ? 'bg-primary-light text-primary' :
              'bg-warning-light text-warning'
            }`}>{m.tag}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <div className="text-slate-500">投注人数</div>
              <div className="font-medium text-slate-700">{m.totalBets}</div>
            </div>
            <div>
              <div className="text-slate-500">总流水</div>
              <div className="font-medium text-slate-700">{m.totalAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-500">平台盈亏</div>
              <div className={`font-medium ${m.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                {m.profit > 0 ? '+' : ''}{m.profit.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-slate-500">投注分布</div>
              <div className="font-medium text-slate-700">A58% B27% 平15%</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MonitorTabs() {
  const [active, setActive] = useState('risk');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-lg p-0.5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
              active === tab.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {active === 'risk' && <RiskPanel />}
      {active === 'churn' && <ChurnPanel />}
      {active === 'review' && <ReviewPanel />}
    </div>
  );
}
