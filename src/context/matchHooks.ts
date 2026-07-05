import { useContext, useCallback } from 'react';
import { MatchContext } from './matchContextValue';
import type { MatchItem, MatchRound, MatchGame } from '../data/mockData';
import type { TeamPoolItem } from '../components/MatchManagement/TeamPool';

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error('useMatch must be used within MatchProvider');
  return ctx.state;
}

export function useMatchDispatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error('useMatchDispatch must be used within MatchProvider');
  return ctx.dispatch;
}

export function useMatchActions() {
  const dispatch = useMatchDispatch();

  const loadMatch = useCallback((match: MatchItem, approvedTeams: TeamPoolItem[] = []) => {
    dispatch({ type: 'LOAD_MATCH', payload: { match, approvedTeams } });
  }, [dispatch]);

  const updateMatch = useCallback((match: MatchItem) => {
    dispatch({ type: 'UPDATE_MATCH', payload: match });
  }, [dispatch]);

  const updateStages = useCallback((stages: MatchItem['stages']) => {
    dispatch({ type: 'UPDATE_STAGES', payload: { stages } });
  }, [dispatch]);

  const setApprovedTeams = useCallback((teams: TeamPoolItem[]) => {
    dispatch({ type: 'SET_APPROVED_TEAMS', payload: teams });
  }, [dispatch]);

  const setRounds = useCallback((rounds: MatchRound[]) => {
    dispatch({ type: 'SET_ROUNDS', payload: rounds });
  }, [dispatch]);

  const assignTeam = useCallback((roundId: string, gameId: string, side: 'A' | 'B', teamName: string) => {
    dispatch({ type: 'ASSIGN_TEAM', payload: { roundId, gameId, side, teamName } });
  }, [dispatch]);

  const clearSlot = useCallback((roundId: string, gameId: string, side: 'A' | 'B', placeholder: string) => {
    dispatch({ type: 'CLEAR_SLOT', payload: { roundId, gameId, side, placeholder } });
  }, [dispatch]);

  const updateGame = useCallback((roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => {
    dispatch({ type: 'UPDATE_GAME', payload: { roundId, gameId, updates, winnerTeamName } });
  }, [dispatch]);

  const autoAssignSeeds = useCallback(() => {
    dispatch({ type: 'AUTO_ASSIGN_SEEDS' });
  }, [dispatch]);

  const autoAssignStage = useCallback((stageId: string) => {
    dispatch({ type: 'AUTO_ASSIGN_STAGE', payload: { stageId } });
  }, [dispatch]);

  const clearStage = useCallback((stageId: string) => {
    dispatch({ type: 'CLEAR_STAGE', payload: { stageId } });
  }, [dispatch]);

  const pairSwissRound = useCallback((stageId: string, groupIndex: number) => {
    dispatch({ type: 'PAIR_SWISS_ROUND', payload: { stageId, groupIndex } });
  }, [dispatch]);

  const assignGroupSlot = useCallback((roundIds: string[], slotName: string, team: TeamPoolItem) => {
    const teamName = team.teamName || team.userNickname;
    dispatch({ type: 'ASSIGN_GROUP_SLOT', payload: { roundIds, slotName, teamName } });
  }, [dispatch]);

  const clearGroupSlot = useCallback((roundIds: string[], slotName: string) => {
    dispatch({ type: 'CLEAR_GROUP_SLOT', payload: { roundIds, slotName } });
  }, [dispatch]);

  const advanceTeams = useCallback((currentStageId: string, nextStageId: string, teams: string[]) => {
    dispatch({ type: 'ADVANCE_TEAMS', payload: { currentStageId, nextStageId, teams } });
  }, [dispatch]);

  const addExtraRound = useCallback((stageId: string, groupIndex: number, teamA: string, teamB: string, format?: string) => {
    dispatch({ type: 'ADD_EXTRA_ROUND', payload: { stageId, groupIndex, teamA, teamB, format } });
  }, [dispatch]);

  const addFreeGame = useCallback((stageId: string, teamA: string, teamB: string, format?: string, roundName?: string) => {
    dispatch({ type: 'ADD_FREE_GAME', payload: { stageId, teamA, teamB, format, roundName } });
  }, [dispatch]);

  const deleteFreeRound = useCallback((roundId: string) => {
    dispatch({ type: 'DELETE_FREE_ROUND', payload: { roundId } });
  }, [dispatch]);

  const updateStageMeta = useCallback((stageId: string, scoring: { winPoints: number; drawPoints: number; lossPoints: number }) => {
    dispatch({ type: 'UPDATE_STAGE_META', payload: { stageId, scoring } });
  }, [dispatch]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  }, [dispatch]);

  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' });
  }, [dispatch]);

  return {
    loadMatch,
    updateMatch,
    updateStages,
    setApprovedTeams,
    setRounds,
    assignTeam,
    clearSlot,
    updateGame,
    autoAssignSeeds,
    autoAssignStage,
    clearStage,
    pairSwissRound,
    assignGroupSlot,
    clearGroupSlot,
    advanceTeams,
    addExtraRound,
    addFreeGame,
    deleteFreeRound,
    updateStageMeta,
    showToast,
    hideToast,
  };
}
