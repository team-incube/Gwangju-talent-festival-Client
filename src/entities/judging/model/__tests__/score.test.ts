import { describe, it, expect } from "vitest";
import { EMPTY_SCORE, SCORE_MAX, Score, TOTAL_MAX, getScoreTotal, toTeamScore } from "../score";

const makeScore = (overrides: Partial<Score> = {}): Score => ({
  judgementId: null,
  teamId: 1,
  teamName: "댄스팀",
  completenessExpressionScore: 0,
  creativityCompositionScore: 0,
  stagePerformanceTeamworkScore: 0,
  totalScore: 0,
  isPerformed: false,
  isJudged: false,
  ...overrides,
});

describe("SCORE_MAX / TOTAL_MAX", () => {
  it("각 평가 항목의 최대 점수 합이 TOTAL_MAX와 같다", () => {
    const sum = Object.values(SCORE_MAX).reduce((acc, max) => acc + max, 0);
    expect(sum).toBe(TOTAL_MAX);
  });
});

describe("EMPTY_SCORE", () => {
  it("모든 항목이 0점이다", () => {
    expect(getScoreTotal(EMPTY_SCORE)).toBe(0);
  });
});

describe("getScoreTotal", () => {
  it("세 항목 점수의 합을 반환한다", () => {
    const total = getScoreTotal({
      completenessExpressionScore: 40,
      creativityCompositionScore: 20,
      stagePerformanceTeamworkScore: 10,
    });

    expect(total).toBe(70);
  });
});

describe("toTeamScore", () => {
  it("Score에서 평가 항목 점수만 추려 TeamScore로 변환한다", () => {
    const score = makeScore({
      completenessExpressionScore: 30,
      creativityCompositionScore: 15,
      stagePerformanceTeamworkScore: 5,
      totalScore: 50,
    });

    expect(toTeamScore(score)).toEqual({
      completenessExpressionScore: 30,
      creativityCompositionScore: 15,
      stagePerformanceTeamworkScore: 5,
    });
  });
});
