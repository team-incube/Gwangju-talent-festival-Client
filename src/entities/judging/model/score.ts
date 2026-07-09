export type Score = {
  judgementId: number | null;
  teamId: number;
  teamName: string;
  expressionCommunicationScore: number;
  technicalCompletenessScore: number;
  creativityCompositionScore: number;
  stagePresencePerformanceScore: number;
  teamworkStageHarmonyScore: number;
  totalScore: number;
  isPerformed: boolean;
  isJudged: boolean;
};

export const EVALUATION_CRITERIA = [
  { key: "expressionCommunicationScore", label: "표현·소통", max: 40 },
  { key: "technicalCompletenessScore", label: "기술·완성도", max: 40 },
  { key: "creativityCompositionScore", label: "창의·구성", max: 30 },
  { key: "stagePresencePerformanceScore", label: "무대장악력·퍼포먼스", max: 30 },
  { key: "teamworkStageHarmonyScore", label: "팀워크·무대조화", max: 40 },
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

// 백엔드가 심사 총점을 100점 초과 시 저장을 거부하므로, 기준별 최대값 합(180)과 무관하게 최종 만점은 100으로 고정한다.
export const TOTAL_MAX = 100;

export const getScoreTotal = (score: TeamScore): number =>
  EVALUATION_CRITERIA.reduce((sum, { key }) => sum + score[key], 0);
