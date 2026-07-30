import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useJudgeMonitoring } from "../useJudgeMonitoring";

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
  commentRows: [],
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
        '{"judges":[{"judgeId":1,"label":"심사위원 A"}],"scoreRows":[{"teamId":1,"performOrder":1,"teamName":"댄스팀","scores":[{"judgeId":1,"score":95}],"calculatedScore":95,"rank":2},{"teamId":2,"performOrder":2,"teamName":"밴드팀"',
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
});
