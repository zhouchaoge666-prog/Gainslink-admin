import { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import type { MatchRound, MatchGame, TournamentStage } from '../../../data/mockData';
import { computeSwissStandings } from '../../../data/mockData';
import type { TeamPoolItem } from '../TeamPool';
import MatchEditorModal from './MatchEditorModal';

interface SwissBracketProps {
  rounds: MatchRound[];
  availableTeams: TeamPoolItem[];
  stage: TournamentStage | null;
  onUpdateGame: (roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => void;
  onPairNextRound: (stageId: string, groupIndex: number) => void;
  onTeamClick?: (teamName: string) => void;
}

export default function SwissBracket({ rounds, availableTeams, stage, onUpdateGame, onPairNextRound, onTeamClick }: SwissBracketProps) {
  const [editGame, setEditGame] = useState<{ round: MatchRound; game: MatchGame } | null>(null);

  const winPoints = stage?.config.winPoints ?? 3;
  const drawPoints = stage?.config.drawPoints ?? 1;
  const lossPoints = stage?.config.lossPoints ?? 0;
  const maxRounds = stage?.formatRules.swiss?.rounds ?? Math.ceil(Math.log2(Math.max(rounds.length, 2)));

  // 按组分组
  const groups = useMemo(() => {
    const map = new Map<number, MatchRound[]>();
    rounds.forEach((r) => {
      const gi = r.groupIndex ?? 0;
      if (!map.has(gi)) map.set(gi, []);
      map.get(gi)!.push(r);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([groupIndex, groupRounds]) => ({
        groupIndex,
        label: groupRounds[0]?.roundName.split(' · ')[1] ?? `第${groupIndex + 1}组`,
        rounds: groupRounds.sort((a, b) => a.roundNumber - b.roundNumber),
      }));
  }, [rounds]);

  return (
    <div className="space-y-6">
      {groups.map(({ groupIndex, label, rounds: groupRounds }) => {
        const standings = computeSwissStandings(groupRounds, winPoints, drawPoints, lossPoints);
        const completedRoundCount = groupRounds.filter((r) =>
          r.matches.every((g) => g.status === 'completed' || g.status === 'cancelled')
        ).length;
        const canPair = stage && completedRoundCount === groupRounds.length && groupRounds.length < maxRounds;

        return (
          <div key={groupIndex} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-bold text-slate-800">{label}</div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-[10px] text-slate-400 hidden sm:block">
                  胜 {winPoints} / 平 {drawPoints} / 负 {lossPoints} · 共 {maxRounds} 轮
                </div>
                {canPair && (
                  <button
                    onClick={() => onPairNextRound(stage!.stageId, groupIndex)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ChevronRight size={13} />
                    配对第 {groupRounds.length + 1} 轮
                  </button>
                )}
              </div>
            </div>

            {/* 积分榜 */}
            {standings.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      {['#', '队伍', '场次', '胜', '平', '负', '积分', 'BH', '净胜'].map((h) => (
                        <th key={h} className="px-2 py-1.5 border border-slate-100 text-slate-500 font-medium text-center first:text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((s, i) => (
                      <tr key={s.teamName} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-2 py-1.5 border border-slate-100 text-slate-500 text-center font-medium">{i + 1}</td>
                        <td className="px-2 py-1.5 border border-slate-100 text-slate-800 font-medium">
                          <button
                            onClick={() => onTeamClick?.(s.teamName)}
                            className={`text-left ${onTeamClick ? 'hover:text-primary hover:underline cursor-pointer' : 'cursor-default'}`}
                          >
                            {s.teamName}
                          </button>
                        </td>
                        <td className="px-2 py-1.5 border border-slate-100 text-center text-slate-600">{s.played}</td>
                        <td className="px-2 py-1.5 border border-slate-100 text-center font-medium text-emerald-600">{s.wins}</td>
                        <td className="px-2 py-1.5 border border-slate-100 text-center font-medium text-amber-600">{s.draws}</td>
                        <td className="px-2 py-1.5 border border-slate-100 text-center font-medium text-rose-600">{s.losses}</td>
                        <td className="px-2 py-1.5 border border-slate-100 text-center font-bold text-primary">{s.points}</td>
                        <td className="px-2 py-1.5 border border-slate-100 text-center text-slate-500" title="Buchholz（对手积分和）">
                          {s.buchholz ?? 0}
                        </td>
                        <td className="px-2 py-1.5 border border-slate-100 text-center text-slate-600">
                          {s.scoreFor - s.scoreAgainst >= 0 ? '+' : ''}{s.scoreFor - s.scoreAgainst}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 各轮比赛 */}
            <div className="space-y-3">
              {groupRounds.map((round) => {
                const roundLabel = round.roundName.split(' · ').pop() ?? round.roundName;
                const allDone = round.matches.every((g) => g.status === 'completed' || g.status === 'cancelled');
                return (
                  <div key={round.roundId}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-slate-600">{roundLabel}</span>
                      {allDone && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">已完成</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {round.matches.map((game) => {
                        const isBye = game.slotB === 'BYE' || game.slotA === 'BYE';
                        const completed = game.status === 'completed' && game.scoreA !== undefined && game.scoreB !== undefined;
                        return (
                          <button
                            key={game.gameId}
                            onClick={() => !isBye && setEditGame({ round, game })}
                            disabled={isBye}
                            className={`text-left flex items-center justify-between text-xs rounded-lg px-3 py-2 border transition-colors ${
                              isBye
                                ? 'bg-slate-50 border-slate-100 cursor-default opacity-60'
                                : 'bg-slate-50 border-slate-100 hover:border-primary cursor-pointer'
                            }`}
                          >
                            <span className={`truncate flex-1 font-medium ${game.teamAIsPlaceholder ? 'text-slate-300' : 'text-slate-700'}`}>
                              {game.teamAIsPlaceholder ? '—' : game.teamA}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0 px-2">
                              {completed ? `${game.scoreA}:${game.scoreB}` : isBye ? '轮空' : 'VS'}
                            </span>
                            <span className={`truncate flex-1 text-right ${game.teamBIsPlaceholder ? 'text-slate-300' : 'text-slate-700'}`}>
                              {isBye ? '—' : game.teamBIsPlaceholder ? '—' : game.teamB}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {groupRounds.length >= maxRounds && completedRoundCount >= maxRounds && (
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
                全部 {maxRounds} 轮已完成，最终积分榜见上方。
              </div>
            )}
          </div>
        );
      })}

      {editGame && (
        <MatchEditorModal
          round={editGame.round}
          game={editGame.game}
          availableTeams={availableTeams}
          onClose={() => setEditGame(null)}
          onSave={onUpdateGame}
        />
      )}
    </div>
  );
}
