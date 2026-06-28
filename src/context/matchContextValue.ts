import { createContext } from 'react';
import type { MatchItem, MatchRound, MatchGame } from '../data/mockData';
import type { TeamPoolItem } from '../components/MatchManagement/TeamPool';

export interface MatchState {
  match: MatchItem | null;
  rounds: MatchRound[];
  approvedTeams: TeamPoolItem[];
  /** 每个 stageId 对应晋级进入该阶段的队伍名列表（尚未排入对阵图） */
  advancedTeams: Record<string, string[]>;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

export type MatchAction =
  | { type: 'LOAD_MATCH'; payload: { match: MatchItem; approvedTeams: TeamPoolItem[] } }
  | { type: 'UPDATE_MATCH'; payload: MatchItem }
  | { type: 'UPDATE_STAGES'; payload: { stages: MatchItem['stages'] } }
  | { type: 'SET_APPROVED_TEAMS'; payload: TeamPoolItem[] }
  | { type: 'SET_ROUNDS'; payload: MatchRound[] }
  | { type: 'ASSIGN_TEAM'; payload: { roundId: string; gameId: string; side: 'A' | 'B'; teamName: string } }
  | { type: 'CLEAR_SLOT'; payload: { roundId: string; gameId: string; side: 'A' | 'B'; placeholder: string } }
  | { type: 'UPDATE_GAME'; payload: { roundId: string; gameId: string; updates: Partial<MatchGame>; winnerTeamName?: string } }
  | { type: 'AUTO_ASSIGN_SEEDS' }
  | { type: 'PAIR_SWISS_ROUND'; payload: { stageId: string; groupIndex: number } }
  | { type: 'ASSIGN_GROUP_SLOT'; payload: { roundIds: string[]; slotName: string; teamName: string } }
  | { type: 'CLEAR_GROUP_SLOT';  payload: { roundIds: string[]; slotName: string } }
  | { type: 'ADVANCE_TEAMS'; payload: { currentStageId: string; nextStageId: string; teams: string[] } }
  | { type: 'AUTO_ASSIGN_STAGE'; payload: { stageId: string } }
  | { type: 'CLEAR_STAGE'; payload: { stageId: string } }
  | { type: 'ADD_EXTRA_ROUND'; payload: { stageId: string; groupIndex: number; teamA: string; teamB: string; format?: string } }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' };

export interface MatchContextValue {
  state: MatchState;
  dispatch: React.Dispatch<MatchAction>;
}

export const MatchContext = createContext<MatchContextValue | null>(null);
