import { Score } from "./score";

export const getVisibleTeams = (scores: Score[]): Score[] =>
  [...scores].sort((a, b) => a.teamId - b.teamId);
