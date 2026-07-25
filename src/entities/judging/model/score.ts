export type Score = {
  judgementId: number | null;
  teamId: number;
  teamName: string;
  completenessExpressionScore: number;
  creativityCompositionScore: number;
  stagePerformanceTeamworkScore: number;
  totalScore: number;
  isPerformed: boolean;
  isJudged: boolean;
};

export const EVALUATION_CRITERIA = [
  { key: "completenessExpressionScore", label: "완성도·표현력", max: 40 },
  { key: "creativityCompositionScore", label: "창의력·구성", max: 30 },
  { key: "stagePerformanceTeamworkScore", label: "무대매너·퍼포먼스", max: 30 },
] as const;

export type EvaluationScoreKey = (typeof EVALUATION_CRITERIA)[number]["key"];

export type TeamScore = Record<EvaluationScoreKey, number>;

export const SCORE_MAX: Record<EvaluationScoreKey, number> = EVALUATION_CRITERIA.reduce(
  (acc, criteria) => ({ ...acc, [criteria.key]: criteria.max }),
  {} as Record<EvaluationScoreKey, number>,
);

export const EMPTY_SCORE: TeamScore = EVALUATION_CRITERIA.reduce(
  (acc, criteria) => ({ ...acc, [criteria.key]: 0 }),
  {} as TeamScore,
);

export const toTeamScore = (score: Score): TeamScore =>
  EVALUATION_CRITERIA.reduce(
    (acc, criteria) => ({ ...acc, [criteria.key]: score[criteria.key] }),
    {} as TeamScore,
  );

export const TOTAL_MAX = 100;

export const getScoreTotal = (score: TeamScore): number =>
  EVALUATION_CRITERIA.reduce((sum, { key }) => sum + score[key], 0);

// GET /judge는 팀별 totalScore만 내려주고 심사위원별 완성도/창의력/매너 평균은 주지 않아,
// 관리자 모니터링 페이지와 동일한 동점 처리(완성도→창의력→매너 순)는 재현할 수 없다.
// 동점 시 teamId 오름차순으로 순위를 확정하는 근사치이며, 정확한 순위는 모니터링 페이지 기준이다.
export const computeRanks = (teams: Score[]): Map<number, number> => {
  const sorted = [...teams].sort(
    (a, b) => b.totalScore - a.totalScore || a.teamId - b.teamId,
  );
  return new Map(sorted.map((team, index) => [team.teamId, index + 1]));
};
