import { describe, it, expect } from "vitest";
import {
  sanitizeMonitoringResponse,
  sanitizeMonitoringDeltaResponse,
  sanitizeMonitorCommentResponse,
  mergeMonitoringSnapshot,
  dirtyCommentKey,
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
      version: 1,
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

  it("version이 없으면 0으로 채운다", () => {
    expect(sanitizeMonitoringResponse({})?.version).toBe(0);
  });

  it("잘려서 아예 없는 최상위 배열(예: commentRows)은 빈 배열로 채워 나머지 필드는 살린다", () => {
    const raw = { version: 1, judges: [], scoreRows: [VALID_SCORE_ROW] };

    expect(sanitizeMonitoringResponse(raw)).toEqual({
      version: 1,
      judges: [],
      scoreRows: [VALID_SCORE_ROW],
      commentRows: [],
    });
  });

  it("scores 배열이 잘려 없는 scoreRow는 걸러낸다", () => {
    const raw = {
      version: 1,
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
      version: 1,
      judges: [],
      scoreRows: [],
      commentRows: [VALID_COMMENT_ROW, brokenRow],
    };

    expect(sanitizeMonitoringResponse(raw)?.commentRows).toEqual([VALID_COMMENT_ROW]);
  });
});

describe("sanitizeMonitoringDeltaResponse", () => {
  it("score-only Delta를 그대로 반환한다", () => {
    const raw = {
      version: 2,
      scores: { judges: [{ judgeId: 1, label: "심사위원 A" }], scoreRows: [VALID_SCORE_ROW] },
      comments: [],
    };

    expect(sanitizeMonitoringDeltaResponse(raw)).toEqual(raw);
  });

  it("comment-only Delta는 scores가 null이다", () => {
    const raw = { version: 3, scores: null, comments: [{ teamId: 1, judgeId: 2 }] };

    expect(sanitizeMonitoringDeltaResponse(raw)).toEqual(raw);
  });

  it("score와 comment가 섞인 혼합 Delta를 그대로 반환한다", () => {
    const raw = {
      version: 4,
      scores: { judges: [{ judgeId: 1, label: "심사위원 A" }], scoreRows: [VALID_SCORE_ROW] },
      comments: [{ teamId: 1, judgeId: 2 }],
    };

    expect(sanitizeMonitoringDeltaResponse(raw)).toEqual(raw);
  });

  it("version이 없으면 null을 반환한다", () => {
    expect(sanitizeMonitoringDeltaResponse({ scores: null, comments: [] })).toBeNull();
  });

  it("객체가 아니면 null을 반환한다", () => {
    expect(sanitizeMonitoringDeltaResponse(null)).toBeNull();
  });

  it("scores 구조가 깨지면 null로 걷어낸다", () => {
    const raw = { version: 5, scores: { judges: [] }, comments: [] };

    expect(sanitizeMonitoringDeltaResponse(raw)?.scores).toBeNull();
  });

  it("comments 식별자 중 하나라도 깨지면 comments 전체를 빈 배열로 걷어낸다", () => {
    const raw = { version: 6, scores: null, comments: [{ teamId: 1, judgeId: 2 }, { teamId: 3 }] };

    expect(sanitizeMonitoringDeltaResponse(raw)?.comments).toEqual([]);
  });
});

describe("sanitizeMonitorCommentResponse", () => {
  it("구조가 온전한 응답은 그대로 반환한다", () => {
    const raw = { teamId: 1, strokes: [{ color: "#000", points: [{ x: 0, y: 0 }] }] };

    expect(sanitizeMonitorCommentResponse(raw)).toEqual(raw);
  });

  it("teamId가 없으면 null을 반환한다", () => {
    expect(sanitizeMonitorCommentResponse({ strokes: [] })).toBeNull();
  });

  it("strokes 중 하나라도 구조가 깨지면 null을 반환한다", () => {
    expect(
      sanitizeMonitorCommentResponse({ teamId: 1, strokes: [{ color: "#000" }] }),
    ).toBeNull();
  });
});

describe("dirtyCommentKey", () => {
  it("teamId와 judgeId를 콜론으로 이어 고유 키를 만든다", () => {
    expect(dirtyCommentKey(1, 2)).toBe("1:2");
  });
});

describe("mergeMonitoringSnapshot", () => {
  const next: JudgeMonitoringResponse = {
    version: 2,
    judges: [{ judgeId: 1, label: "심사위원 A" }],
    scoreRows: [{ ...VALID_SCORE_ROW, teamId: 2, performOrder: 2, teamName: "밴드팀" }],
    commentRows: [],
  };

  it("이전 스냅샷이 없으면 새 스냅샷을 그대로 반환한다", () => {
    expect(mergeMonitoringSnapshot(null, next)).toEqual(next);
  });

  it("새 스냅샷에 없는 팀은 이전 스냅샷 값을 유지한다", () => {
    const prev: JudgeMonitoringResponse = {
      version: 1,
      judges: [{ judgeId: 1, label: "심사위원 A" }],
      scoreRows: [VALID_SCORE_ROW],
      commentRows: [VALID_COMMENT_ROW],
    };

    const merged = mergeMonitoringSnapshot(prev, next);

    expect(merged.version).toBe(2);
    expect(merged.scoreRows).toEqual(
      expect.arrayContaining([VALID_SCORE_ROW, next.scoreRows[0]]),
    );
    expect(merged.commentRows).toEqual([VALID_COMMENT_ROW]);
  });

  it("결과는 performOrder 순으로 정렬된다", () => {
    const prev: JudgeMonitoringResponse = {
      version: 1,
      judges: [],
      scoreRows: [{ ...VALID_SCORE_ROW, teamId: 3, performOrder: 3 }],
      commentRows: [],
    };

    const merged = mergeMonitoringSnapshot(prev, next);

    expect(merged.scoreRows.map(row => row.performOrder)).toEqual([2, 3]);
  });

  it("새 스냅샷에 있는 팀은 새 값으로 갱신된다", () => {
    const prev: JudgeMonitoringResponse = {
      version: 1,
      judges: [],
      scoreRows: [{ ...VALID_SCORE_ROW, teamId: 2, performOrder: 2, calculatedScore: 10 }],
      commentRows: [],
    };

    const merged = mergeMonitoringSnapshot(prev, next);

    expect(merged.scoreRows).toEqual([next.scoreRows[0]]);
  });
});
