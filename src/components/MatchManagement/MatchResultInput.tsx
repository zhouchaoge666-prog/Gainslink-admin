import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, Plus, CheckCheck, Gift, Trash2, Download, Save } from 'lucide-react';
import { defaultPointRules, computeRoundRobinStandings, computeSwissStandings } from '../../data/mockData';
import { storage } from '../../lib/storage';
import type { MatchResultRecord, MatchRound, TournamentStage } from '../../data/mockData';
import NumericInput from './NumericInput';

interface MatchResultInputProps {
  matchId: string;
  rounds?: MatchRound[];
  stages?: TournamentStage[];
  onViewUser?: (userId: string) => void;
}

const RANK_ICONS = [Trophy, Medal, Award, Star];
const RANK_COLORS = [
  'bg-amber-100 text-amber-600',
  'bg-slate-100 text-slate-500',
  'bg-orange-100 text-orange-600',
  'bg-blue-50 text-blue-500',
];

function pointsForRank(rank: number): number {
  return defaultPointRules.find((r) => r.rank === rank)?.points ?? 0;
}

let _idCounter = 1000;
function newId() { return `MR-NEW-${++_idCounter}`; }

export default function MatchResultInput({ matchId, rounds = [], stages = [], onViewUser }: MatchResultInputProps) {
  const [results, setResults] = useState<MatchResultRecord[]>(() => storage.getResults(matchId));
  const [pointsDistributed, setPointsDistributed] = useState(false);

  useEffect(() => { storage.saveResults(matchId, results); }, [matchId, results]);

  const updateResult = (id: string, field: keyof MatchResultRecord, value: string | number) => {
    setResults((prev) =>
      prev.map((item) =>
        item.id !== id ? item : {
          ...item,
          [field]: value,
          pointsEarned: field === 'rank' ? pointsForRank(Number(value)) : item.pointsEarned,
        }
      )
    );
  };

  const confirmResult = (id: string) => {
    setResults((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'confirmed', recordedAt: new Date().toISOString().slice(0, 10) } : item
      )
    );
  };

  const confirmAll = () => {
    const today = new Date().toISOString().slice(0, 10);
    setResults((prev) =>
      prev.map((item) =>
        item.status === 'confirmed' ? item : { ...item, status: 'confirmed', recordedAt: today }
      )
    );
  };

  const addRecord = () => {
    const nextRank = results.length + 1;
    const newRecord: MatchResultRecord = {
      id: newId(),
      matchId,
      userId: `U-MANUAL-${nextRank}`,
      userNickname: `待填写队伍`,
      rank: nextRank,
      score: 0,
      pointsEarned: pointsForRank(nextRank),
      status: 'pending',
    };
    setResults((prev) => [...prev, newRecord]);
  };

  const removeRecord = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  const importFromBracket = () => {
    const derived = deriveRankingsFromRounds(rounds, stages);
    if (derived.length === 0) return;
    const imported: MatchResultRecord[] = derived.map(({ teamName, rank }, i) => ({
      id: newId(),
      matchId,
      userId: `U-BRACKET-${i + 1}`,
      userNickname: teamName,
      rank,
      score: 0,
      pointsEarned: pointsForRank(rank),
      status: 'pending',
    }));
    setResults(imported);
  };

  const canImport = rounds.some((r) => r.matches.some((g) => g.status === 'completed' && g.winner));

  const pendingCount   = results.filter((r) => r.status === 'pending').length;
  const confirmedCount = results.filter((r) => r.status === 'confirmed').length;
  const allConfirmed   = results.length > 0 && pendingCount === 0;
  const totalPoints    = results.reduce((s, r) => s + r.pointsEarned, 0);

  if (results.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-10 text-slate-400 text-sm">
          该赛事暂无成绩记录
        </div>
        <div className="flex justify-center gap-3">
          {canImport && (
            <button
              onClick={importFromBracket}
              className="flex items-center gap-1.5 text-xs px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Download size={13} /> 从对阵结果导入排名
            </button>
          )}
          <button
            onClick={addRecord}
            className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
          >
            <Plus size={13} /> 手动添加成绩记录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 统计栏 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">
            共 <span className="font-medium text-slate-700">{results.length}</span> 条记录
          </span>
          {confirmedCount > 0 && (
            <span className="text-emerald-600 text-xs">
              已确认 {confirmedCount}
            </span>
          )}
          {pendingCount > 0 && (
            <span className="text-amber-600 text-xs">
              待确认 {pendingCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canImport && (
            <button
              onClick={importFromBracket}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
              title="根据已完成的对阵结果重新生成排名"
            >
              <Download size={12} /> 从对阵导入
            </button>
          )}
          {pendingCount > 1 && (
            <button
              onClick={confirmAll}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
            >
              <CheckCheck size={12} /> 全部确认
            </button>
          )}
          <button
            onClick={addRecord}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
          >
            <Plus size={12} /> 添加记录
          </button>
        </div>
      </div>

      {/* 成绩卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item, index) => {
          const RankIcon    = RANK_ICONS[index] ?? Star;
          const rankColor   = RANK_COLORS[index] ?? 'bg-slate-50 text-slate-500';
          const isConfirmed = item.status === 'confirmed';
          return (
            <div
              key={item.id}
              className={`border rounded-xl p-4 space-y-3 ${
                isConfirmed ? 'bg-white border-slate-200' : 'bg-amber-50/30 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${rankColor}`}>
                    <RankIcon size={18} />
                  </div>
                  <div>
                    {item.userId.startsWith('U-MANUAL') ? (
                      <input
                        value={item.userNickname}
                        disabled={isConfirmed}
                        onChange={(e) => updateResult(item.id, 'userNickname', e.target.value)}
                        className="font-medium text-slate-800 text-sm bg-transparent border-b border-dashed border-slate-300 outline-none disabled:border-transparent w-36"
                        placeholder="队伍名称"
                      />
                    ) : (
                      <button
                        onClick={() => onViewUser?.(item.userId)}
                        className="font-medium text-slate-800 hover:text-primary text-left text-sm"
                      >
                        {item.userNickname}
                      </button>
                    )}
                    <div className="text-xs text-slate-400">{item.userId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isConfirmed ? (
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">已确认</span>
                  ) : (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">待确认</span>
                  )}
                  {!isConfirmed && (
                    <button
                      onClick={() => removeRecord(item.id)}
                      className="text-slate-300 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">名次</label>
                  <select
                    value={item.rank}
                    disabled={isConfirmed}
                    onChange={(e) => updateResult(item.id, 'rank', Number(e.target.value))}
                    className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded-lg outline-none disabled:bg-slate-50 bg-white"
                  >
                    {Array.from({ length: Math.max(results.length, 8) }, (_, i) => i + 1).map((r) => (
                      <option key={r} value={r}>第 {r} 名</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">得分</label>
                  <NumericInput
                    value={item.score}
                    onChange={(value) => updateResult(item.id, 'score', value ?? 0)}
                    min={0}
                    disabled={isConfirmed}
                    className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded-lg outline-none disabled:bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">奖励积分</label>
                  <NumericInput
                    value={item.pointsEarned}
                    onChange={(value) => updateResult(item.id, 'pointsEarned', value ?? 0)}
                    min={0}
                    disabled={isConfirmed}
                    className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded-lg outline-none disabled:bg-slate-50"
                  />
                </div>
              </div>

              {!isConfirmed && (
                <button
                  onClick={() => confirmResult(item.id)}
                  className="w-full flex items-center justify-center gap-1 text-xs px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save size={12} /> 确认成绩
                </button>
              )}
              {isConfirmed && item.recordedAt && (
                <div className="text-[10px] text-slate-400 text-right">确认于 {item.recordedAt}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* 积分发放区域 */}
      {allConfirmed && (
        <div className={`rounded-xl border p-4 ${pointsDistributed ? 'bg-emerald-50 border-emerald-200' : 'bg-violet-50 border-violet-200'}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${pointsDistributed ? 'bg-emerald-100 text-emerald-600' : 'bg-violet-100 text-violet-600'}`}>
                <Gift size={16} />
              </div>
              <div>
                <div className={`text-sm font-medium ${pointsDistributed ? 'text-emerald-700' : 'text-violet-700'}`}>
                  {pointsDistributed ? '积分已发放' : '成绩已全部确认，可以发放积分'}
                </div>
                <div className="text-xs text-slate-500">
                  共 {results.length} 支队伍，合计 <span className="font-medium">{totalPoints.toLocaleString()}</span> 积分
                </div>
              </div>
            </div>
            {!pointsDistributed ? (
              <button
                onClick={() => setPointsDistributed(true)}
                className="shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors"
              >
                <Gift size={14} /> 立即发放
              </button>
            ) : (
              <span className="text-xs text-emerald-600 font-medium">
                ✓ {new Date().toLocaleDateString('zh-CN')} 已发放
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 从对阵图推导排名 ─────────────────────────────────────────────────────────

function deriveRankingsFromRounds(
  rounds: MatchRound[],
  stages: TournamentStage[]
): { teamName: string; rank: number }[] {
  if (!rounds.length || !stages.length) return [];
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  // 找最后一个有比赛结果的阶段
  let targetStage: TournamentStage | null = null;
  for (let i = sortedStages.length - 1; i >= 0; i--) {
    const s = sortedStages[i];
    const stageRounds = rounds.filter(
      (r) => r.stageId === s.stageId || r.roundName.split(' · ')[0] === s.name
    );
    if (stageRounds.some((r) => r.matches.some((g) => g.status === 'completed'))) {
      targetStage = s;
      break;
    }
  }
  if (!targetStage) return [];

  const stageRounds = rounds.filter(
    (r) => r.stageId === targetStage!.stageId || r.roundName.split(' · ')[0] === targetStage!.name
  );
  const wp = targetStage.config.winPoints ?? 3;
  const dp = targetStage.config.drawPoints ?? 1;
  const lp = targetStage.config.lossPoints ?? 0;

  if (targetStage.type === 'ROUND_ROBIN') {
    return computeRoundRobinStandings(stageRounds, wp, dp, lp).map((s, i) => ({
      teamName: s.teamName,
      rank: i + 1,
    }));
  }

  if (targetStage.type === 'SWISS') {
    return computeSwissStandings(stageRounds, wp, dp, lp).map((s, i) => ({
      teamName: s.teamName,
      rank: i + 1,
    }));
  }

  // SINGLE_ELIMINATION / DOUBLE_ELIMINATION
  return deriveEliminationRankings(stageRounds);
}

function deriveEliminationRankings(
  rounds: MatchRound[]
): { teamName: string; rank: number }[] {
  const sorted = [...rounds].sort((a, b) => b.roundNumber - a.roundNumber);
  const results: { teamName: string; rank: number }[] = [];
  const placed = new Set<string>();
  let currentRank = 1;

  for (const round of sorted) {
    const completedMatches = round.matches.filter(
      (g) => g.status === 'completed' && g.winner && !g.teamAIsPlaceholder && !g.teamBIsPlaceholder
    );
    if (!completedMatches.length) continue;

    if (currentRank === 1) {
      // 决赛：胜者第1，败者第2
      for (const g of completedMatches) {
        if (!placed.has(g.winner!)) { results.push({ teamName: g.winner!, rank: 1 }); placed.add(g.winner!); }
        const loser = g.winner === g.teamA ? g.teamB : g.teamA;
        if (!placed.has(loser)) { results.push({ teamName: loser, rank: 2 }); placed.add(loser); }
      }
      currentRank = 3;
    } else {
      // 前序轮次：败者获得当前名次
      for (const g of completedMatches) {
        const loser = g.winner === g.teamA ? g.teamB : g.teamA;
        if (!placed.has(loser)) { results.push({ teamName: loser, rank: currentRank }); placed.add(loser); }
      }
      currentRank += completedMatches.length;
    }
  }

  return results.sort((a, b) => a.rank - b.rank);
}
