import { Score } from "./score";

const EXCLUDED_TEAM_ID = 11;

export const getVisibleTeams = (scores: Score[]): Score[] =>
  scores.filter(score => score.teamId !== EXCLUDED_TEAM_ID).sort((a, b) => a.teamId - b.teamId);
