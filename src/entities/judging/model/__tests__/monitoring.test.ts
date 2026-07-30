import { describe, it, expect } from "vitest";
import {
  sanitizeMonitoringResponse,
  mergeMonitoringSnapshot,
  JudgeMonitoringResponse,
} from "../monitoring";

const VALID_SCORE_ROW = {
  teamId: 1,
  performOrder: 1,
  teamName: "댄스팀",
  scores: [{ judgeId: 1, score: 90 }],
  calculatedScore: 90,
  rank: 1,
};

const VALID_COMMENT_ROW = {
  teamId: 1,
  performOrder: 1,
  teamName: "댄스팀",
  comments: [{ judgeId: 1, strokes: [{ color: "#000", points: [{ x: 0, y: 0 }] }] }],
};

describe("sanitizeMonitoringResponse", () => {
  it("구조가 온전한 응답은 그대로 반환한다", () => {
    const raw = {
      judges: [{ judgeId: 1, label: "심사위원 A" }],
      scoreRows: [VALID_SCORE_ROW],
      commentRows: [VALID_COMMENT_ROW],
    };

    expect(sanitizeMonitoringResponse(raw)).toEqual(raw);
  });

  it("객체가 아니면 null을 반환한다", () => {
    expect(sanitizeMonitoringResponse(null)).toBeNull();
    expect(sanitizeMonitoringResponse("not an object")).toBeNull();
  });

  it("잘려서 아예 없는 최상위 배열(예: commentRows)은 빈 배열로 채워 나머지 필드는 살린다", () => {
    const raw = { judges: [], scoreRows: [VALID_SCORE_ROW] };

    expect(sanitizeMonitoringResponse(raw)).toEqual({
      judges: [],
      scoreRows: [VALID_SCORE_ROW],
      commentRows: [],
    });
  });

  it("scores 배열이 잘려 없는 scoreRow는 걸러낸다", () => {
    const raw = {
      judges: [],
      scoreRows: [VALID_SCORE_ROW, { teamId: 2, performOrder: 2 }],
      commentRows: [],
    };

    expect(sanitizeMonitoringResponse(raw)?.scoreRows).toEqual([VALID_SCORE_ROW]);
  });

  it("comments 안에 points가 잘린 stroke가 있으면 해당 commentRow를 걸러낸다", () => {
    const brokenRow = {
      teamId: 2,
      performOrder: 2,
      teamName: "밴드팀",
      comments: [{ judgeId: 1, strokes: [{ color: "#000" }] }],
    };
    const raw = {
      judges: [],
      scoreRows: [],
      commentRows: [VALID_COMMENT_ROW, brokenRow],
    };

    expect(sanitizeMonitoringResponse(raw)?.commentRows).toEqual([VALID_COMMENT_ROW]);
  });
});

describe("mergeMonitoringSnapshot", () => {
  const next: JudgeMonitoringResponse = {
    judges: [{ judgeId: 1, label: "심사위원 A" }],
    scoreRows: [{ ...VALID_SCORE_ROW, teamId: 2, performOrder: 2, teamName: "밴드팀" }],
    commentRows: [],
  };

  it("이전 스냅샷이 없으면 새 스냅샷을 그대로 반환한다", () => {
    expect(mergeMonitoringSnapshot(null, next)).toEqual(next);
  });

  it("새 스냅샷에 없는 팀은 이전 스냅샷 값을 유지한다", () => {
    const prev: JudgeMonitoringResponse = {
      judges: [{ judgeId: 1, label: "심사위원 A" }],
      scoreRows: [VALID_SCORE_ROW],
      commentRows: [VALID_COMMENT_ROW],
    };

    const merged = mergeMonitoringSnapshot(prev, next);

    expect(merged.scoreRows).toEqual(
      expect.arrayContaining([VALID_SCORE_ROW, next.scoreRows[0]]),
    );
    expect(merged.commentRows).toEqual([VALID_COMMENT_ROW]);
  });

  it("결과는 performOrder 순으로 정렬된다", () => {
    const prev: JudgeMonitoringResponse = {
      judges: [],
      scoreRows: [{ ...VALID_SCORE_ROW, teamId: 3, performOrder: 3 }],
      commentRows: [],
    };

    const merged = mergeMonitoringSnapshot(prev, next);

    expect(merged.scoreRows.map(row => row.performOrder)).toEqual([2, 3]);
  });

  it("새 스냅샷에 있는 팀은 새 값으로 갱신된다", () => {
    const prev: JudgeMonitoringResponse = {
      judges: [],
      scoreRows: [{ ...VALID_SCORE_ROW, teamId: 2, performOrder: 2, calculatedScore: 10 }],
      commentRows: [],
    };

    const merged = mergeMonitoringSnapshot(prev, next);

    expect(merged.scoreRows).toEqual([next.scoreRows[0]]);
  });
});
