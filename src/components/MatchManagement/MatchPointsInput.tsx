import { useState } from 'react';
import { Coins, Save, Send, CheckCircle2 } from 'lucide-react';
import { defaultPointRules } from '../../data/mockData';
import type { PointRule } from '../../data/mockData';
import NumericInput from './NumericInput';

interface MatchPointsInputProps {
  matchId: string;
}

export default function MatchPointsInput({ matchId }: MatchPointsInputProps) {
  const [rules, setRules] = useState<PointRule[]>(defaultPointRules);
  const [distributed, setDistributed] = useState(false);

  const updateRule = (rank: number, points: number) => {
    setRules((prev) =>       prev.map((r) =>         r.rank === rank ? { ...r, points } : r
      )
    );
    setDistributed(false);
  };

  const handleDistribute = () => {
    setDistributed(true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <div className="flex items-center gap-2 text-emerald-800 font-medium mb-1">
          <Coins size={18} />
          积分发放规则
        </div>
        <div className="text-sm text-emerald-700">
          赛事 ID：{matchId} · 按以下名次规则自动发放积分，发放后用户积分将实时到账。
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50">
              <th className="py-3 px-4">名次</th>
              <th className="py-3 px-4">奖励积分</th>
              <th className="py-3 px-4">状态</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.rank} className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium text-slate-800">第 {rule.rank} 名</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <NumericInput
                      value={rule.points}
                      onChange={(value) => updateRule(rule.rank, value ?? 0)}
                      min={0}
                      disabled={distributed}
                      className="w-28 text-sm px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary disabled:bg-slate-50"
                    />
                    <span className="text-xs text-slate-400">积分</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {distributed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <CheckCircle2 size={11} />
                      已发放
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <Coins size={11} />
                      待发放
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setDistributed(false)}
          disabled={!distributed}
          className="flex items-center gap-1 text-xs px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <Save size={13} />
          重新编辑
        </button>
        <button
          onClick={handleDistribute}
          disabled={distributed}
          className="flex items-center gap-1 text-xs px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Send size={13} />
          {distributed ? '已发放' : '一键发放积分'}
        </button>
      </div>
    </div>
  );
}
