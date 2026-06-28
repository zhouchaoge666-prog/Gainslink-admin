// Bracket pure-function API.
// Currently re-exported from mockData.ts to keep existing imports working.
// New code should import from this module.

export {
  generatePlaceholderSlots,
  applyTemplate,
  validateStages,
  generateMatchRounds,
  propagateWinner,
  computeRoundRobinStandings,
} from '../../data/mockData';

export type {
  MatchItem,
  MatchGame,
  MatchRound,
  TournamentStage,
  StageType,
  GroupStanding,
} from '../../data/mockData';
