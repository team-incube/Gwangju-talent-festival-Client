import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useJudgeMonitoring } from "../useJudgeMonitoring";
import { dirtyCommentKey } from "@/entities/judging/model/monitoring";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

import { toast } from "sonner";

let mockInstances: MockEventSource[] = [];

class MockEventSource {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;

  url: string;
  withCredentials: boolean;
  readyState: number;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private listeners: Map<string, Array<(e: { data: string }) => void>> = new Map();
  closeCalled = false;

  constructor(url: string, options?: { withCredentials?: boolean }) {
    this.url = url;
    this.withCredentials = options?.withCredentials ?? false;
    this.readyState = MockEventSource.CONNECTING;
    mockInstances.push(this);
  }

  addEventListener(type: string, listener: (e: { data: string }) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type)!.push(listener);
  }

  close() {
    this.readyState = MockEventSource.CLOSED;
    this.closeCalled = true;
  }

  simulateOpen() {
    this.readyState = MockEventSource.OPEN;
    this.onopen?.();
  }

  simulateError(state = MockEventSource.CONNECTING) {
    this.readyState = state;
    this.onerror?.();
  }

  dispatch(type: string, data: unknown) {
    const event = { data: JSON.stringify(data) };
    this.listeners.get(type)?.forEach(l => l(event));
  }

  dispatchMalformed(type: string) {
    const event = { data: "invalid{{{json" };
    this.listeners.get(type)?.forEach(l => l(event));
  }

  dispatchRaw(type: string, raw: string) {
    const event = { data: raw };
    this.listeners.get(type)?.forEach(l => l(event));
  }
}

const SNAPSHOT = {
  version: 1,
  judges: [{ judgeId: 1, label: "심사위원 A" }],
  scoreRows: [
    {
      teamId: 1,
      performOrder: 1,
      teamName: "댄스팀",
      scores: [{ judgeId: 1, score: 90 }],
      calculatedScore: 90,
      rank: 1,
    },
  ],
  commentRows: [
    {
      teamId: 1,
      performOrder: 1,
      teamName: "댄스팀",
      comments: [{ judgeId: 1, strokes: null }],
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  mockInstances = [];
  vi.stubGlobal("EventSource", MockEventSource);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("useJudgeMonitoring", () => {
  it("/api/judge/monitor/changes에 인증 정보를 포함해 연결한다", () => {
    renderHook(() => useJudgeMonitoring());

    expect(mockInstances).toHaveLength(1);
    expect(mockInstances[0].url).toBe("/api/judge/monitor/changes");
    expect(mockInstances[0].withCredentials).toBe(true);
  });

  it("judge-monitoring 이벤트를 수신하면 스냅샷으로 상태를 갱신한다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", SNAPSHOT);
    });

    expect(result.current.data).toEqual(SNAPSHOT);
  });

  it("heartbeat 이벤트는 상태에 영향을 주지 않는다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", SNAPSHOT);
      mockInstances[0].dispatch("heartbeat", "ok");
    });

    expect(result.current.data).toEqual(SNAPSHOT);
  });

  it("judge-monitoring 이벤트 파싱에 실패하면 에러 토스트를 표시한다", () => {
    renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatchMalformed("judge-monitoring");
    });

    expect(toast.error).toHaveBeenCalledWith("심사 모니터링 데이터를 불러오는 중 오류가 발생했습니다.");
  });

  it("스냅샷이 중간에 잘려도 읽을 수 있는 값은 반영하고 나머지는 이전 값을 유지한다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", {
        version: 1,
        judges: [{ judgeId: 1, label: "심사위원 A" }],
        scoreRows: [
          {
            teamId: 1,
            performOrder: 1,
            teamName: "댄스팀",
            scores: [{ judgeId: 1, score: 80 }],
            calculatedScore: 80,
            rank: 2,
          },
          {
            teamId: 2,
            performOrder: 2,
            teamName: "밴드팀",
            scores: [{ judgeId: 1, score: 90 }],
            calculatedScore: 90,
            rank: 1,
          },
        ],
        commentRows: [],
      });
    });

    act(() => {
      mockInstances[0].dispatchRaw(
        "judge-monitoring",
        '{"version":2,"judges":[{"judgeId":1,"label":"심사위원 A"}],"scoreRows":[{"teamId":1,"performOrder":1,"teamName":"댄스팀","scores":[{"judgeId":1,"score":95}],"calculatedScore":95,"rank":2},{"teamId":2,"performOrder":2,"teamName":"밴드팀"',
      );
    });

    expect(result.current.data?.scoreRows).toEqual([
      {
        teamId: 1,
        performOrder: 1,
        teamName: "댄스팀",
        scores: [{ judgeId: 1, score: 95 }],
        calculatedScore: 95,
        rank: 2,
      },
      {
        teamId: 2,
        performOrder: 2,
        teamName: "밴드팀",
        scores: [{ judgeId: 1, score: 90 }],
        calculatedScore: 90,
        rank: 1,
      },
    ]);
  });

  it("연결에 성공하면 isConnected가 true가 된다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].simulateOpen();
    });

    expect(result.current.isConnected).toBe(true);
  });

  it("연결이 끊기면 재연결을 시도한다", () => {
    renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].simulateError(MockEventSource.CLOSED);
    });
    expect(mockInstances).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(mockInstances).toHaveLength(2);
  });

  it("언마운트 시 연결을 닫는다", () => {
    const { unmount } = renderHook(() => useJudgeMonitoring());

    unmount();

    expect(mockInstances[0].closeCalled).toBe(true);
  });

  it("CONNECTING 상태 에러는 브라우저 자동 재연결에 맡기고 연결을 닫지 않는다", () => {
    renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].simulateError(MockEventSource.CONNECTING);
    });

    expect(mockInstances[0].closeCalled).toBe(false);
    expect(toast.error).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockInstances).toHaveLength(1);
  });

  it("연결이 열리지 않은 채 시간이 흘러도 강제로 연결을 끊지 않는다", () => {
    renderHook(() => useJudgeMonitoring());

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(mockInstances[0].closeCalled).toBe(false);
    expect(mockInstances).toHaveLength(1);
    expect(toast.error).not.toHaveBeenCalled();
  });
});

describe("useJudgeMonitoring - Delta 처리", () => {
  it("score-only Delta를 받으면 judges와 scoreRows를 교체한다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", SNAPSHOT);
      mockInstances[0].dispatch("judge-monitoring-delta", {
        version: 2,
        scores: {
          judges: [{ judgeId: 1, label: "심사위원 A" }],
          scoreRows: [{ ...SNAPSHOT.scoreRows[0], calculatedScore: 100, rank: 1 }],
        },
        comments: [],
      });
    });

    expect(result.current.data?.version).toBe(2);
    expect(result.current.data?.scoreRows[0].calculatedScore).toBe(100);
    expect(result.current.data?.commentRows).toEqual(SNAPSHOT.commentRows);
  });

  it("comment-only Delta를 받으면 해당 (teamId, judgeId) 셀을 dirty로 표시한다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", SNAPSHOT);
      mockInstances[0].dispatch("judge-monitoring-delta", {
        version: 2,
        scores: null,
        comments: [{ teamId: 1, judgeId: 1 }],
      });
    });

    expect(result.current.dirtyCells.get(dirtyCommentKey(1, 1))).toBe(2);
    // comment-only Delta는 점수/필기 원본을 바꾸지 않는다
    expect(result.current.data?.scoreRows).toEqual(SNAPSHOT.scoreRows);
  });

  it("score와 comment가 섞인 혼합 Delta를 함께 반영한다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", SNAPSHOT);
      mockInstances[0].dispatch("judge-monitoring-delta", {
        version: 2,
        scores: {
          judges: [{ judgeId: 1, label: "심사위원 A" }],
          scoreRows: [{ ...SNAPSHOT.scoreRows[0], calculatedScore: 70 }],
        },
        comments: [{ teamId: 1, judgeId: 1 }],
      });
    });

    expect(result.current.data?.scoreRows[0].calculatedScore).toBe(70);
    expect(result.current.dirtyCells.get(dirtyCommentKey(1, 1))).toBe(2);
  });

  it("마지막으로 적용한 version 이하의 Delta는 무시한다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", { ...SNAPSHOT, version: 5 });
      mockInstances[0].dispatch("judge-monitoring-delta", {
        version: 5,
        scores: {
          judges: [{ judgeId: 1, label: "심사위원 A" }],
          scoreRows: [{ ...SNAPSHOT.scoreRows[0], calculatedScore: 999 }],
        },
        comments: [],
      });
    });

    expect(result.current.data?.version).toBe(5);
    expect(result.current.data?.scoreRows[0].calculatedScore).toBe(90);
  });

  it("Delta 파싱에 실패하면 에러 토스트를 표시한다", () => {
    renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatchMalformed("judge-monitoring-delta");
    });

    expect(toast.error).toHaveBeenCalledWith("심사 모니터링 데이터를 불러오는 중 오류가 발생했습니다.");
  });

  it("재연결로 새 judge-monitoring 스냅샷을 받으면 dirty 목록을 초기화한다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", SNAPSHOT);
      mockInstances[0].dispatch("judge-monitoring-delta", {
        version: 2,
        scores: null,
        comments: [{ teamId: 1, judgeId: 1 }],
      });
    });
    expect(result.current.dirtyCells.size).toBe(1);

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", { ...SNAPSHOT, version: 3 });
    });

    expect(result.current.dirtyCells.size).toBe(0);
  });
});

describe("useJudgeMonitoring - resolveDirtyComment", () => {
  it("dirty 표시 버전과 일치하면 필기를 반영하고 dirty를 해제한다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", SNAPSHOT);
      mockInstances[0].dispatch("judge-monitoring-delta", {
        version: 2,
        scores: null,
        comments: [{ teamId: 1, judgeId: 1 }],
      });
    });

    const strokes = [{ color: "#111", points: [{ x: 1, y: 1 }] }];

    act(() => {
      result.current.resolveDirtyComment(1, 1, strokes, 2);
    });

    expect(result.current.dirtyCells.has(dirtyCommentKey(1, 1))).toBe(false);
    expect(result.current.data?.commentRows[0].comments[0].strokes).toEqual(strokes);
  });

  it("그 사이 더 최신 Delta가 같은 셀을 다시 dirty로 표시했다면 오래된 응답은 버린다", () => {
    const { result } = renderHook(() => useJudgeMonitoring());

    act(() => {
      mockInstances[0].dispatch("judge-monitoring", SNAPSHOT);
      mockInstances[0].dispatch("judge-monitoring-delta", {
        version: 2,
        scores: null,
        comments: [{ teamId: 1, judgeId: 1 }],
      });
      mockInstances[0].dispatch("judge-monitoring-delta", {
        version: 3,
        scores: null,
        comments: [{ teamId: 1, judgeId: 1 }],
      });
    });

    const staleStrokes = [{ color: "#111", points: [{ x: 1, y: 1 }] }];

    act(() => {
      // version 2 조회가 늦게 도착한 상황을 흉내낸다
      result.current.resolveDirtyComment(1, 1, staleStrokes, 2);
    });

    expect(result.current.dirtyCells.get(dirtyCommentKey(1, 1))).toBe(3);
    expect(result.current.data?.commentRows[0].comments[0].strokes).toBeNull();
  });
});
