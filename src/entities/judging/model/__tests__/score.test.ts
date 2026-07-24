import { describe, it, expect } from "vitest";
import { computeRanks, Score } from "../score";

const buildScore = (teamId: number, totalScore: number): Score => ({
  judgementId: null,
  teamId,
  teamName: `팀${teamId}`,
  completenessExpressionScore: 0,
  creativityCompositionScore: 0,
  stagePerformanceTeamworkScore: 0,
  totalScore,
  isPerformed: true,
  isJudged: false,
});

describe("computeRanks", () => {
  it("totalScore 내림차순으로 순위를 매긴다", () => {
    const teams = [buildScore(1, 70), buildScore(2, 90), buildScore(3, 80)];

    const ranks = computeRanks(teams);

    expect(ranks.get(2)).toBe(1);
    expect(ranks.get(3)).toBe(2);
    expect(ranks.get(1)).toBe(3);
  });

  it("totalScore가 동점이면 teamId 오름차순으로 순위를 확정한다", () => {
    const teams = [buildScore(5, 80), buildScore(2, 80), buildScore(3, 90)];

    const ranks = computeRanks(teams);

    expect(ranks.get(3)).toBe(1);
    expect(ranks.get(2)).toBe(2);
    expect(ranks.get(5)).toBe(3);
  });

  it("팀이 하나뿐이면 1위를 부여한다", () => {
    const ranks = computeRanks([buildScore(1, 50)]);

    expect(ranks.get(1)).toBe(1);
  });
});
