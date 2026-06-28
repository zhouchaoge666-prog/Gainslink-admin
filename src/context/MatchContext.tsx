import { useReducer, useEffect, type ReactNode } from 'react';
import { MatchContext, type MatchState, type MatchAction } from './matchContextValue';
import type { MatchItem } from '../data/mockData';
import { generateMatchRounds, mergeRoundData, repropagateAllRoutes, propagateWinner, applyByeWins, pairSwissRound } from '../data/mockData';
import type { TeamPoolItem } from '../components/MatchManagement/TeamPool';
import { storage } from '../lib/storage';

function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'LOAD_MATCH': {
      const { match, approvedTeams } = action.payload;
      const saved = storage.getRounds(match.id);
      // 始终用新生成的 rounds 提供正确的路由链路（loserNextMatchId 等），
      // 再将 saved 的比分/队伍叠加回去，最后重放所有已完成场次的胜负传播，
      // 修复旧存档因路由 bug 导致 LB 队伍缺失/错位的问题。
      let rounds;
      if (match.stages) {
        const fresh = generateMatchRounds(match, match.stages);
        rounds = saved ? repropagateAllRoutes(mergeRoundData(fresh, saved)) : fresh;
      } else {
        rounds = saved ?? [];
      }
      const advancedTeams = storage.getAdvancedTeams(match.id);
      return { ...state, match, rounds, approvedTeams, advancedTeams, toast: null };
    }
    case 'UPDATE_MATCH': {
      const match = action.payload;
      const rounds = match.stages ? generateMatchRounds(match, match.stages) : state.rounds;
      return { ...state, match, rounds };
    }
    case 'UPDATE_STAGES': {
      if (!state.match) return state;
      const match = { ...state.match, stages: action.payload.stages };
      const rounds = generateMatchRounds(match, match.stages);
      return { ...state, match, rounds };
    }
    case 'SET_APPROVED_TEAMS':
      return { ...state, approvedTeams: action.payload };
    case 'SET_ROUNDS':
      return { ...state, rounds: action.payload };
    case 'ASSIGN_TEAM': {
      const { roundId, gameId, side, teamName } = action.payload;
      // 找到目标轮次所属 stageId，用于将同一阶段的旧位置自动清空（移动语义）
      const targetStageId = state.rounds.find((r) => r.roundId === roundId)?.stageId;
      const clearedRounds = state.rounds.map((round) => {
        // 只在同一阶段内查找旧位置
        if (targetStageId && round.stageId !== targetStageId) return round;
        return {
          ...round,
          matches: round.matches.map((game) => {
            if (game.gameId === gameId) return game; // 目标 game 留给下面处理
            let g = { ...game };
            if (g.teamA === teamName && !g.teamAIsPlaceholder) {
              g = { ...g, teamA: g.slotA || '待定', teamAIsPlaceholder: true };
              if (g.status === 'completed' || g.winner !== undefined)
                g = { ...g, status: 'scheduled', scoreA: undefined, scoreB: undefined, winner: undefined };
            }
            if (g.teamB === teamName && !g.teamBIsPlaceholder) {
              g = { ...g, teamB: g.slotB || '待定', teamBIsPlaceholder: true };
              if (g.status === 'completed' || g.winner !== undefined)
                g = { ...g, status: 'scheduled', scoreA: undefined, scoreB: undefined, winner: undefined };
            }
            return g;
          }),
        };
      });
      const assignedRounds = clearedRounds.map((round) =>
        round.roundId !== roundId
          ? round
          : {
              ...round,
              matches: round.matches.map((game) =>
                game.gameId !== gameId
                  ? game
                  : side === 'A'
                    ? { ...game, teamA: teamName, teamAIsPlaceholder: false }
                    : { ...game, teamB: teamName, teamBIsPlaceholder: false }
              ),
            }
      );
      return { ...state, rounds: applyByeWins(assignedRounds) };
    }
    case 'CLEAR_SLOT': {
      const { gameId, side, placeholder } = action.payload;

      // Build a flat gameId→game map for cascade traversal
      const allGames = new Map<string, import('../data/mockData').MatchGame>();
      state.rounds.forEach((r) => r.matches.forEach((g) => allGames.set(g.gameId, g)));

      const rootGame = allGames.get(gameId);

      // BFS: for every completed game in the cleared chain, collect downstream slots to wipe
      // Map<gameId, Set<'A'|'B'>>
      const downstream = new Map<string, Set<'A' | 'B'>>();
      const queue: import('../data/mockData').MatchGame[] = rootGame ? [rootGame] : [];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const g = queue.shift()!;
        if (visited.has(g.gameId)) continue;
        visited.add(g.gameId);
        if (g.status !== 'completed' || !g.winner) continue;

        if (g.nextMatchId) {
          const slot = ((g as any).nextSlot ?? 'A') as 'A' | 'B';
          if (!downstream.has(g.nextMatchId)) downstream.set(g.nextMatchId, new Set());
          downstream.get(g.nextMatchId)!.add(slot);
          const next = allGames.get(g.nextMatchId);
          if (next) queue.push(next);
        }
        if ((g as any).loserNextMatchId) {
          const slot = ((g as any).loserNextSlot ?? 'B') as 'A' | 'B';
          if (!downstream.has((g as any).loserNextMatchId)) downstream.set((g as any).loserNextMatchId, new Set());
          downstream.get((g as any).loserNextMatchId)!.add(slot);
          const next = allGames.get((g as any).loserNextMatchId);
          if (next) queue.push(next);
        }
      }

      const resetScores = (g: import('../data/mockData').MatchGame) =>
        (g.status === 'completed' || g.winner !== undefined)
          ? { ...g, status: 'scheduled' as const, scoreA: undefined, scoreB: undefined, winner: undefined }
          : g;

      return {
        ...state,
        rounds: state.rounds.map((round) => ({
          ...round,
          matches: round.matches.map((g) => {
            if (g.gameId === gameId) {
              const cleared = side === 'A'
                ? { ...g, teamA: placeholder, teamAIsPlaceholder: true }
                : { ...g, teamB: placeholder, teamBIsPlaceholder: true };
              return resetScores(cleared);
            }
            if (downstream.has(g.gameId)) {
              let next = { ...g };
              for (const slot of downstream.get(g.gameId)!) {
                if (slot === 'A') next = { ...next, teamA: next.slotA || '待定', teamAIsPlaceholder: true };
                else next = { ...next, teamB: next.slotB || '待定', teamBIsPlaceholder: true };
              }
              return resetScores(next);
            }
            return g;
          }),
        })),
      };
    }
    case 'UPDATE_GAME': {
      const { roundId, gameId, updates, winnerTeamName } = action.payload;
      const updatedRounds = state.rounds.map((round) =>
        round.roundId !== roundId
          ? round
          : { ...round, matches: round.matches.map((game) => (game.gameId === gameId ? { ...game, ...updates } : game)) }
      );
      const propagatedRounds = winnerTeamName ? propagateWinner(updatedRounds, roundId, gameId, winnerTeamName) : updatedRounds;
      return { ...state, rounds: applyByeWins(propagatedRounds) };
    }
    case 'AUTO_ASSIGN_SEEDS': {
      const teams = state.approvedTeams.slice();
      const teamNameOf = (t: TeamPoolItem) => t.teamName || t.userNickname;
      let teamIndex = 0;

      // For slot-based stages (ROUND_ROBIN / SWISS), collect unique slots per group
      // and map each slot to a team. The same slot appears in many matches, so we
      // must assign by slot name, not by placeholder occurrence.
      const slotToTeam = new Map<string, string>();

      const sortedStages = [...(state.match?.stages ?? [])].sort((a, b) => a.order - b.order);
      for (const stage of sortedStages) {
        if (stage.type !== 'ROUND_ROBIN' && stage.type !== 'SWISS') continue;

        // Collect unique slot names per group in encounter order
        const groupSlots = new Map<number, string[]>();
        const groupSlotSeen = new Map<number, Set<string>>();

        state.rounds
          .filter((r) => r.stageId === stage.stageId)
          .sort((a, b) => a.roundNumber - b.roundNumber)
          .forEach((r) => {
            const gi = r.groupIndex ?? 0;
            if (!groupSlots.has(gi)) { groupSlots.set(gi, []); groupSlotSeen.set(gi, new Set()); }
            r.matches.forEach((g) => {
              if (g.slotA && g.slotA !== 'BYE' && !groupSlotSeen.get(gi)!.has(g.slotA)) {
                groupSlots.get(gi)!.push(g.slotA);
                groupSlotSeen.get(gi)!.add(g.slotA);
              }
              if (g.slotB && g.slotB !== 'BYE' && !groupSlotSeen.get(gi)!.has(g.slotB)) {
                groupSlots.get(gi)!.push(g.slotB);
                groupSlotSeen.get(gi)!.add(g.slotB);
              }
            });
          });

        // Assign teams to slots in group index order
        for (const gi of Array.from(groupSlots.keys()).sort((a, b) => a - b)) {
          for (const slot of groupSlots.get(gi)!) {
            if (teamIndex < teams.length) slotToTeam.set(slot, teamNameOf(teams[teamIndex++]));
          }
        }
      }

      // Apply: slot-based rounds use slotToTeam map; elimination rounds use sequential fill
      const assignedRounds = state.rounds.map((round) => {
        const isSlotBased = round.stageType === 'ROUND_ROBIN' || round.stageType === 'SWISS';
        return {
          ...round,
          matches: round.matches.map((game) => {
            let next = { ...game };
            if (isSlotBased) {
              if (next.teamAIsPlaceholder && next.slotA && slotToTeam.has(next.slotA)) {
                next = { ...next, teamA: slotToTeam.get(next.slotA)!, teamAIsPlaceholder: false };
              }
              if (next.teamBIsPlaceholder && next.slotB && slotToTeam.has(next.slotB)) {
                next = { ...next, teamB: slotToTeam.get(next.slotB)!, teamBIsPlaceholder: false };
              }
            } else {
              if (next.teamAIsPlaceholder && teamIndex < teams.length) {
                next = { ...next, teamA: teamNameOf(teams[teamIndex++]), teamAIsPlaceholder: false };
              }
              if (next.teamBIsPlaceholder && teamIndex < teams.length) {
                next = { ...next, teamB: teamNameOf(teams[teamIndex++]), teamBIsPlaceholder: false };
              }
            }
            return next;
          }),
        };
      });

      return { ...state, rounds: applyByeWins(assignedRounds) };
    }
    case 'PAIR_SWISS_ROUND': {
      if (!state.match) return state;
      const { stageId, groupIndex } = action.payload;
      const stage = state.match.stages?.find((s) => s.stageId === stageId);
      if (!stage || stage.type !== 'SWISS') return state;

      // 该组当前所有已完成轮次
      const groupRounds = state.rounds.filter(
        (r) => r.stageId === stageId && r.groupIndex === groupIndex && r.stageType === 'SWISS'
      );
      const completedRounds = groupRounds.filter((r) =>
        r.matches.every((g) => g.status === 'completed' || g.status === 'cancelled')
      );

      // 总轮数限制
      const maxRounds = stage.formatRules.swiss?.rounds ?? Math.ceil(Math.log2(stage.teamsIn));
      if (groupRounds.length >= maxRounds) return state;

      // 收集该组所有真实队伍
      const teamSet = new Set<string>();
      groupRounds.forEach((r) =>
        r.matches.forEach((g) => {
          if (!g.teamAIsPlaceholder && g.slotA !== 'BYE') teamSet.add(g.teamA);
          if (!g.teamBIsPlaceholder && g.slotB !== 'BYE') teamSet.add(g.teamB);
        })
      );
      const allTeams = Array.from(teamSet);
      const nextRoundNumber = Math.max(...groupRounds.map((r) => r.roundNumber), 0) + 1;

      const newRound = pairSwissRound(
        state.match.id,
        stageId,
        stage.name,
        groupIndex,
        nextRoundNumber,
        completedRounds,
        allTeams,
        stage.defaultFormat ?? 'BO1',
        stage.formatRules.swiss?.byePolicy ?? 'LOWEST_SCORE_NO_PREVIOUS_BYE',
        stage.formatRules.swiss?.avoidRepeatOpponent ?? true,
        stage.config.winPoints ?? 3,
        stage.config.drawPoints ?? 1,
        stage.config.lossPoints ?? 0
      );

      // 替换该组现有的未完成轮（如果有残留占位轮），或直接追加
      const otherRounds = state.rounds.filter(
        (r) => !(r.stageId === stageId && r.groupIndex === groupIndex && r.roundNumber === nextRoundNumber)
      );
      return { ...state, rounds: [...otherRounds, newRound].sort((a, b) => a.roundNumber - b.roundNumber) };
    }
    case 'ASSIGN_GROUP_SLOT': {
      const { roundIds, slotName, teamName } = action.payload;
      const idSet = new Set(roundIds);
      return {
        ...state,
        rounds: state.rounds.map((round) => {
          if (!idSet.has(round.roundId)) return round;
          return {
            ...round,
            matches: round.matches.map((game) => {
              let g = { ...game };
              if (g.slotA === slotName) g = { ...g, teamA: teamName, teamAIsPlaceholder: false };
              if (g.slotB === slotName) g = { ...g, teamB: teamName, teamBIsPlaceholder: false };
              return g;
            }),
          };
        }),
      };
    }
    case 'CLEAR_GROUP_SLOT': {
      const { roundIds, slotName } = action.payload;
      const idSet = new Set(roundIds);
      return {
        ...state,
        rounds: state.rounds.map((round) => {
          if (!idSet.has(round.roundId)) return round;
          return {
            ...round,
            matches: round.matches.map((game) => {
              const affectsA = game.slotA === slotName && !game.teamAIsPlaceholder;
              const affectsB = game.slotB === slotName && !game.teamBIsPlaceholder;
              if (!affectsA && !affectsB) return game;
              let g = { ...game };
              if (affectsA) g = { ...g, teamA: slotName, teamAIsPlaceholder: true };
              if (affectsB) g = { ...g, teamB: slotName, teamBIsPlaceholder: true };
              // 清除已完成游戏的成绩，避免留下幽灵积分记录
              if (g.status === 'completed' || g.winner !== undefined) {
                g = { ...g, status: 'scheduled', scoreA: undefined, scoreB: undefined, winner: undefined };
              }
              return g;
            }),
          };
        }),
      };
    }
    case 'ADVANCE_TEAMS': {
      // 只记录晋级队伍，不自动填入对阵图，让用户手动排布或使用一键排布
      const { nextStageId, teams } = action.payload;
      return {
        ...state,
        advancedTeams: { ...state.advancedTeams, [nextStageId]: teams },
      };
    }
    case 'AUTO_ASSIGN_STAGE': {
      if (!state.match) return state;
      const { stageId } = action.payload;
      const stage = state.match.stages?.find((s) => s.stageId === stageId);
      if (!stage) return state;

      // 队伍来源：有晋级记录用晋级列表，否则用报名队伍
      const teamNames: string[] =
        (state.advancedTeams[stageId] ?? []).length > 0
          ? state.advancedTeams[stageId]
          : state.approvedTeams.map((t) => t.teamName || t.userNickname);

      const isSlotBased = stage.type === 'ROUND_ROBIN' || stage.type === 'SWISS';
      let teamIndex = 0;

      if (isSlotBased) {
        // 循环赛/瑞士制：按 slot 分配（与 AUTO_ASSIGN_SEEDS 相同逻辑，但仅限本阶段）
        const slotToTeam = new Map<string, string>();
        const groupSlots = new Map<number, string[]>();
        const groupSlotSeen = new Map<number, Set<string>>();

        state.rounds
          .filter((r) => r.stageId === stageId)
          .sort((a, b) => a.roundNumber - b.roundNumber)
          .forEach((r) => {
            const gi = r.groupIndex ?? 0;
            if (!groupSlots.has(gi)) { groupSlots.set(gi, []); groupSlotSeen.set(gi, new Set()); }
            r.matches.forEach((g) => {
              if (g.slotA && g.slotA !== 'BYE' && !groupSlotSeen.get(gi)!.has(g.slotA)) {
                groupSlots.get(gi)!.push(g.slotA); groupSlotSeen.get(gi)!.add(g.slotA);
              }
              if (g.slotB && g.slotB !== 'BYE' && !groupSlotSeen.get(gi)!.has(g.slotB)) {
                groupSlots.get(gi)!.push(g.slotB); groupSlotSeen.get(gi)!.add(g.slotB);
              }
            });
          });

        for (const gi of Array.from(groupSlots.keys()).sort((a, b) => a - b)) {
          for (const slot of groupSlots.get(gi)!) {
            if (teamIndex < teamNames.length) slotToTeam.set(slot, teamNames[teamIndex++]);
          }
        }

        const updatedRounds = state.rounds.map((round) => {
          if (round.stageId !== stageId) return round;
          return {
            ...round,
            matches: round.matches.map((game) => {
              let g = { ...game };
              if (g.teamAIsPlaceholder && g.slotA && slotToTeam.has(g.slotA))
                g = { ...g, teamA: slotToTeam.get(g.slotA)!, teamAIsPlaceholder: false };
              if (g.teamBIsPlaceholder && g.slotB && slotToTeam.has(g.slotB))
                g = { ...g, teamB: slotToTeam.get(g.slotB)!, teamBIsPlaceholder: false };
              return g;
            }),
          };
        });
        return { ...state, rounds: applyByeWins(updatedRounds) };
      } else {
        // 淘汰赛：只填"入口场"（WB 首轮）
        // 判断依据：传播占位槽以"第X组-"开头（如"第1组-WB1-1"），入口场 slotA/slotB 来自真实队伍槽（如"A1"）
        const updatedRounds = state.rounds.map((round) => {
          if (round.stageId !== stageId) return round;
          return {
            ...round,
            matches: round.matches.map((game) => {
              // 传播占位槽（非入口）以"第"字开头；入口场两槽均不以"第"开头
              const isEntryGame = !(
                (game.slotA ?? '').startsWith('第') || (game.slotB ?? '').startsWith('第')
              );
              if (!isEntryGame) return game; // 非入口场：跳过，等待赛果传播
              let g = { ...game };
              // BYE 槽不分配队伍
              if (g.teamAIsPlaceholder && g.slotA !== 'BYE' && teamIndex < teamNames.length)
                g = { ...g, teamA: teamNames[teamIndex++], teamAIsPlaceholder: false };
              if (g.teamBIsPlaceholder && g.slotB !== 'BYE' && teamIndex < teamNames.length)
                g = { ...g, teamB: teamNames[teamIndex++], teamBIsPlaceholder: false };
              return g;
            }),
          };
        });
        return { ...state, rounds: applyByeWins(updatedRounds) };
      }
    }
    case 'CLEAR_STAGE': {
      const { stageId } = action.payload;
      return {
        ...state,
        rounds: state.rounds.map((round) => {
          if (round.stageId !== stageId) return round;
          return {
            ...round,
            matches: round.matches.map((game) => {
              if (game.slotA === 'BYE' || game.slotB === 'BYE') return game;
              return {
                ...game,
                teamA: game.slotA || '待定',
                teamAIsPlaceholder: true,
                teamB: game.slotB || '待定',
                teamBIsPlaceholder: true,
                scoreA: undefined,
                scoreB: undefined,
                winner: undefined,
                startTime: '',
                status: 'scheduled' as const,
              };
            }),
          };
        }),
      };
    }
    case 'ADD_EXTRA_ROUND': {
      if (!state.match) return state;
      const { stageId, groupIndex, teamA, teamB, format } = action.payload;
      const stage = state.match.stages?.find((s) => s.stageId === stageId);
      if (!stage) return state;

      const groupRounds = state.rounds.filter(
        (r) => r.stageId === stageId && (r.groupIndex ?? 0) === groupIndex
      );
      const maxRoundNumber = groupRounds.reduce((m, r) => Math.max(m, r.roundNumber), 0);
      const newRoundNumber = maxRoundNumber + 1;
      const ts = Date.now();
      const newRoundId = `${state.match.id}-${stageId}-extra-${ts}`;
      const newRound = {
        roundId: newRoundId,
        matchId: state.match.id,
        roundName: `${stage.name} · 第${groupIndex + 1}组 · 加赛`,
        roundNumber: newRoundNumber,
        stage: 'group' as const,
        stageId,
        stageType: 'ROUND_ROBIN' as const,
        groupIndex,
        startTime: '',
        endTime: '',
        status: 'upcoming' as const,
        matches: [{
          gameId: `${newRoundId}-G1`,
          matchId: state.match.id,
          teamA,
          teamB,
          teamAIsPlaceholder: false,
          teamBIsPlaceholder: false,
          slotA: teamA,
          slotB: teamB,
          status: 'scheduled' as const,
          format: format || stage.defaultFormat || 'BO1',
          startTime: '',
        }],
      };
      return { ...state, rounds: [...state.rounds, newRound] };
    }
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function MatchProvider({ children, initialMatch, initialTeams }: { children: ReactNode; initialMatch?: MatchItem; initialTeams?: TeamPoolItem[] }) {
  const [state, dispatch] = useReducer(matchReducer, {
    match: initialMatch || null,
    rounds: initialMatch
      ? (storage.getRounds(initialMatch.id) ?? (initialMatch.stages ? generateMatchRounds(initialMatch, initialMatch.stages) : []))
      : [],
    approvedTeams: initialTeams || [],
    advancedTeams: initialMatch ? storage.getAdvancedTeams(initialMatch.id) : {},
    toast: null,
  });

  useEffect(() => {
    if (!initialMatch) return;
    if (!state.match || state.match.id !== initialMatch.id) {
      dispatch({ type: 'LOAD_MATCH', payload: { match: initialMatch, approvedTeams: initialTeams || [] } });
    } else if (state.match.maxTeams !== initialMatch.maxTeams || state.match.stages !== initialMatch.stages) {
      dispatch({ type: 'UPDATE_MATCH', payload: initialMatch });
    }
  }, [initialMatch, initialTeams, state.match]);

  // 每次 rounds / advancedTeams 变化时持久化到 localStorage
  useEffect(() => {
    if (state.match && state.rounds.length > 0) {
      storage.saveRounds(state.match.id, state.rounds);
    }
  }, [state.match, state.rounds]);

  useEffect(() => {
    if (state.match) {
      storage.saveAdvancedTeams(state.match.id, state.advancedTeams);
    }
  }, [state.match, state.advancedTeams]);

  return <MatchContext.Provider value={{ state, dispatch }}>{children}</MatchContext.Provider>;
}
