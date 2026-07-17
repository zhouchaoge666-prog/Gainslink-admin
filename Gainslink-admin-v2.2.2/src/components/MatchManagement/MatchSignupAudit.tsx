import { useState, useCallback, useMemo, useEffect } from 'react';
import { CheckCircle, XCircle, User, Shuffle } from 'lucide-react';
import { signupAuditData } from '../../data/mockData';
import type { SignupAuditItem } from '../../data/mockData';
import { useMatch, useMatchActions } from '../../context/matchHooks';
import { storage } from '../../lib/storage';

interface MatchSignupAuditProps {
  matchId: string;
  onViewUser?: (userId: string) => void;
  onViewTeam?: (teamName: string) => void;
  onTeamsChange?: (teams: { userId: string; userNickname: string; teamName?: string }[]) => void;
}

type TabKey = 'all' | 'pending' | 'approved' | 'rejected';

const adjectives = ['烈焰', '雷霆', '暗影', '风暴', '钢铁', '疾风', '暗夜', '光辉', '狂野', '神秘'];
const nouns      = ['战狼', '雄鹰', '巨龙', '猛虎', '猎豹', '幽灵', '骑士', '法师', '猎手', '先锋'];
const randomTeamName = () => `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
const randomNickname = () => `Player${Math.floor(Math.random() * 100000)}`;
const randomId = (p: string) => `${p}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export default function MatchSignupAudit({ matchId, onViewUser, onViewTeam, onTeamsChange }: MatchSignupAuditProps) {
  const [audits, setAudits] = useState<SignupAuditItem[]>(() => {
    const saved = storage.getSignup(matchId);
    return saved.length > 0 ? saved : signupAuditData.filter((item) => item.matchId === matchId);
  });
  const [tab, setTab] = useState<TabKey>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { match } = useMatch();
  const { setApprovedTeams } = useMatchActions();

  const notifyTeams = useCallback((list: SignupAuditItem[]) => {
    const approved = list.filter((i) => i.status === 'approved').map((i) => ({
      userId: i.userId, userNickname: i.userNickname, teamName: i.teamName,
    }));
    onTeamsChange?.(approved);
    setApprovedTeams(approved);
  }, [onTeamsChange, setApprovedTeams]);

  // 持久化：audits 变化时存储
  useEffect(() => { storage.saveSignup(matchId, audits); }, [matchId, audits]);

  const [prevMatchId, setPrevMatchId] = useState(matchId);
  if (matchId !== prevMatchId) {
    setPrevMatchId(matchId);
    const saved = storage.getSignup(matchId);
    const list = saved.length > 0 ? saved : signupAuditData.filter((i) => i.matchId === matchId);
    setAudits(list);
    notifyTeams(list);
  }

  const counts = useMemo(() => ({
    all:      audits.length,
    pending:  audits.filter((a) => a.status === 'pending').length,
    approved: audits.filter((a) => a.status === 'approved').length,
    rejected: audits.filter((a) => a.status === 'rejected').length,
  }), [audits]);

  const displayed = useMemo(() => {
    if (tab === 'all') return audits;
    return audits.filter((a) => a.status === tab);
  }, [audits, tab]);

  const pendingIds = useMemo(
    () => displayed.filter((a) => a.status === 'pending').map((a) => a.id),
    [displayed]
  );
  const allPendingSelected = pendingIds.length > 0 && pendingIds.every((id) => selected.has(id));

  const toggleSelectAll = () => {
    if (allPendingSelected) {
      setSelected((prev) => { const next = new Set(prev); pendingIds.forEach((id) => next.delete(id)); return next; });
    } else {
      setSelected((prev) => new Set([...prev, ...pendingIds]));
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const handleAudit = (id: string, status: 'approved' | 'rejected') => {
    setAudits((prev) => { const next = prev.map((i) => i.id === id ? { ...i, status } : i); notifyTeams(next); return next; });
  };

  const handleBulkAudit = (status: 'approved' | 'rejected') => {
    setAudits((prev) => {
      const next = prev.map((i) => selected.has(i.id) ? { ...i, status } : i);
      notifyTeams(next);
      return next;
    });
    setSelected(new Set());
  };

  const handleGenerateApproved = () => {
    const target = match?.maxTeams || 16;
    const currentApproved = audits.filter((a) => a.status === 'approved').length;
    const needed = Math.max(0, target - currentApproved);
    if (needed <= 0) return;
    const newAudits: SignupAuditItem[] = Array.from({ length: needed }).map(() => {
      const userId = randomId('U');
      return {
        id: randomId('S'), matchId, userId, matchName: match?.name || '',
        userNickname: randomNickname(), teamName: randomTeamName(),
        contactInfo: `${userId.toLowerCase()}@test.gg`,
        signupTime: new Date().toISOString().slice(5, 16).replace('T', ' '),
        status: 'approved' as const,
      };
    });
    const next = [...audits, ...newAudits];
    setAudits(next);
    notifyTeams(next);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all',      label: `全部 ${counts.all}` },
    { key: 'pending',  label: `待审核 ${counts.pending}` },
    { key: 'approved', label: `已通过 ${counts.approved}` },
    { key: 'rejected', label: `已拒绝 ${counts.rejected}` },
  ];

  const selectedPendingCount = [...selected].filter((id) =>
    audits.find((a) => a.id === id)?.status === 'pending'
  ).length;

  return (
    <div className="space-y-4">
      {/* 顶部统计 + 工具按钮 */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSelected(new Set()); }}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                tab === key ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={handleGenerateApproved}
          className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Shuffle size={12} />
          随机生成已审核队伍
        </button>
      </div>

      {/* 批量操作栏 */}
      {selectedPendingCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg text-xs">
          <span className="text-primary font-medium">已选 {selectedPendingCount} 条</span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleBulkAudit('rejected')}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-rose-600 rounded-lg hover:bg-rose-50"
            >
              <XCircle size={12} /> 批量拒绝
            </button>
            <button
              onClick={() => handleBulkAudit('approved')}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <CheckCircle size={12} /> 批量通过
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-slate-400 hover:text-slate-600 px-2 py-1.5"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          {tab === 'all' ? '该赛事暂无报名记录' : '暂无此类记录'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-8">
                  {pendingIds.length > 0 && (
                    <input
                      type="checkbox"
                      checked={allPendingSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-primary cursor-pointer"
                      title="全选待审核"
                    />
                  )}
                </th>
                <th className="py-3 px-4">用户</th>
                <th className="py-3 px-4">队伍 / 联系方式</th>
                <th className="py-3 px-4">报名时间</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((item) => {
                const isPending = item.status === 'pending';
                const isChecked = selected.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-100 transition-colors ${
                      isChecked ? 'bg-primary/5' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      {isPending && (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-slate-300 text-primary cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <User size={14} />
                        </div>
                        <div>
                          <button
                            onClick={() => onViewUser?.(item.userId)}
                            className="font-medium text-slate-800 hover:text-primary text-left"
                          >
                            {item.userNickname}
                          </button>
                          <div className="text-xs text-slate-500">{item.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.teamName ? (
                        <button
                          onClick={() => onViewTeam?.(item.teamName!)}
                          className="font-medium text-slate-700 hover:text-primary transition-colors text-left"
                        >
                          {item.teamName}
                        </button>
                      ) : (
                        <span>-</span>
                      )}
                      <div className="text-xs text-slate-400">{item.contactInfo}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.signupTime}</td>
                    <td className="py-3 px-4">
                      {item.status === 'pending'  && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-amber-600 bg-amber-50">待审核</span>}
                      {item.status === 'approved' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-emerald-600 bg-emerald-50">已通过</span>}
                      {item.status === 'rejected' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-red-600 bg-red-50">已拒绝</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAudit(item.id, 'rejected')}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                          >
                            <XCircle size={12} /> 拒绝
                          </button>
                          <button
                            onClick={() => handleAudit(item.id, 'approved')}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90"
                          >
                            <CheckCircle size={12} /> 通过
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">已处理</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
