import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSeatChangeSSE } from "../useSeatChangeSSE";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

import { toast } from "sonner";

// ── MockEventSource ──────────────────────────────────────────────────────────

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

  dispatchSeatChange(data: unknown) {
    const event = { data: JSON.stringify(data) };
    this.listeners.get("SEAT_CHANGE")?.forEach(l => l(event));
  }

  dispatchMalformedSeatChange() {
    const event = { data: "invalid{{{json" };
    this.listeners.get("SEAT_CHANGE")?.forEach(l => l(event));
  }
}

// ── Setup / Teardown ─────────────────────────────────────────────────────────

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

// ── Tests ────────────────────────────────────────────────────────────────────

describe("useSeatChangeSSE", () => {
  describe("초기 연결", () => {
    it("enabled=true이면 EventSource를 생성하고 올바른 URL로 연결한다", () => {
      renderHook(() => useSeatChangeSSE({ enabled: true }));

      expect(mockInstances).toHaveLength(1);
      expect(mockInstances[0].url).toBe("/api/seat/changes");
      expect(mockInstances[0].withCredentials).toBe(true);
    });

    it("enabled=false이면 EventSource를 생성하지 않는다", () => {
      renderHook(() => useSeatChangeSSE({ enabled: false }));

      expect(mockInstances).toHaveLength(0);
    });

    it("enabled 기본값은 true이다", () => {
      renderHook(() => useSeatChangeSSE());

      expect(mockInstances).toHaveLength(1);
    });
  });

  describe("SEAT_CHANGE 이벤트 수신", () => {
    it("SEAT_CHANGE 이벤트를 수신하면 onSeatChange 콜백을 호출한다", () => {
      const onSeatChange = vi.fn();
      renderHook(() => useSeatChangeSSE({ onSeatChange }));

      act(() => {
        mockInstances[0].dispatchSeatChange({
          seat_section: "RED",
          seat_row: "A",
          seat_number: 1,
          is_available: false,
        });
      });

      expect(onSeatChange).toHaveBeenCalledOnce();
      expect(onSeatChange).toHaveBeenCalledWith({
        seat_section: "RED",
        seat_row: "A",
        seat_number: 1,
        is_available: false,
      });
    });

    it("JSON 파싱에 실패하면 에러 토스트를 표시한다", () => {
      renderHook(() => useSeatChangeSSE());

      act(() => {
        mockInstances[0].dispatchMalformedSeatChange();
      });

      expect(toast.error).toHaveBeenCalledWith("좌석 정보를 불러오는 중 오류가 발생했습니다.");
    });

    it("onSeatChange 콜백이 예외를 던지면 처리 오류 토스트를 표시한다", () => {
      const onSeatChange = vi.fn().mockImplementation(() => {
        throw new Error("콜백 오류");
      });
      renderHook(() => useSeatChangeSSE({ onSeatChange }));

      act(() => {
        mockInstances[0].dispatchSeatChange({
          seat_section: "YELLOW",
          seat_row: "A",
          seat_number: 5,
          is_available: true,
        });
      });

      expect(toast.error).toHaveBeenCalledWith("좌석 정보 처리 중 오류가 발생했습니다.");
    });
  });

  describe("연결 오류 처리", () => {
    it("onerror에서 readyState가 CONNECTING이면 브라우저 자동 재연결에 맡긴다", () => {
      renderHook(() => useSeatChangeSSE());
      const instance = mockInstances[0];

      act(() => {
        instance.simulateError(MockEventSource.CONNECTING);
      });

      expect(toast.error).not.toHaveBeenCalled();
      expect(instance.closeCalled).toBe(false);

      act(() => {
        vi.advanceTimersByTime(30000);
      });

      expect(mockInstances).toHaveLength(1);
    });

    it("onerror에서 readyState가 CLOSED이면 에러 토스트를 표시한다", () => {
      renderHook(() => useSeatChangeSSE());

      act(() => {
        mockInstances[0].simulateError(MockEventSource.CLOSED);
      });

      expect(toast.error).toHaveBeenCalledWith("실시간 좌석 정보 연결에 실패했습니다.", { id: "sse-error" });
    });

    it("CLOSED 상태에서 1초 후 자동으로 재연결한다 (지수 백오프 1차)", () => {
      renderHook(() => useSeatChangeSSE());

      act(() => {
        mockInstances[0].simulateError(MockEventSource.CLOSED);
      });

      expect(mockInstances).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockInstances).toHaveLength(2);
    });

    it("재연결 지연이 지수적으로 증가한다 (1s → 2s → 4s)", () => {
      renderHook(() => useSeatChangeSSE());

      // 1차 오류 → 1000ms 후 재연결
      act(() => { mockInstances[0].simulateError(MockEventSource.CLOSED); });
      act(() => { vi.advanceTimersByTime(999); });
      expect(mockInstances).toHaveLength(1);
      act(() => { vi.advanceTimersByTime(1); });
      expect(mockInstances).toHaveLength(2);

      // 2차 오류 → 2000ms 후 재연결
      act(() => { mockInstances[1].simulateError(MockEventSource.CLOSED); });
      act(() => { vi.advanceTimersByTime(1999); });
      expect(mockInstances).toHaveLength(2);
      act(() => { vi.advanceTimersByTime(1); });
      expect(mockInstances).toHaveLength(3);

      // 3차 오류 → 4000ms 후 재연결
      act(() => { mockInstances[2].simulateError(MockEventSource.CLOSED); });
      act(() => { vi.advanceTimersByTime(3999); });
      expect(mockInstances).toHaveLength(3);
      act(() => { vi.advanceTimersByTime(1); });
      expect(mockInstances).toHaveLength(4);
    });

    it("MAX_RETRIES(5회) 초과 시 새로고침 안내 토스트를 표시하고 재연결하지 않는다", () => {
      renderHook(() => useSeatChangeSSE());

      // 5회 재연결 소진
      for (let i = 0; i < 5; i++) {
        act(() => { mockInstances[i].simulateError(MockEventSource.CLOSED); });
        act(() => { vi.advanceTimersByTime(BASE_DELAY * 2 ** i); });
      }
      expect(mockInstances).toHaveLength(6);

      // 6번째 오류 → 재연결 없이 새로고침 토스트
      act(() => { mockInstances[5].simulateError(MockEventSource.CLOSED); });
      act(() => { vi.advanceTimersByTime(60_000); });
      expect(mockInstances).toHaveLength(6);
      expect(toast.error).toHaveBeenCalledWith("실시간 연결이 종료되었습니다. 페이지를 새로고침 해주세요.", { id: "sse-error" });
    });
  });

  describe("연결 성공 (onopen)", () => {
    it("연결에 성공하면 재시도 횟수를 초기화하고 에러 토스트를 닫는다", () => {
      renderHook(() => useSeatChangeSSE());

      // 1회 재연결 소진
      act(() => { mockInstances[0].simulateError(MockEventSource.CLOSED); });
      act(() => { vi.advanceTimersByTime(1000); });
      expect(mockInstances).toHaveLength(2);

      // 재연결 성공
      act(() => { mockInstances[1].simulateOpen(); });

      expect(toast.dismiss).toHaveBeenCalledWith("sse-error");

      // 성공 후 오류가 발생하면 처음부터 1000ms로 재시작
      act(() => { mockInstances[1].simulateError(MockEventSource.CLOSED); });
      act(() => { vi.advanceTimersByTime(999); });
      expect(mockInstances).toHaveLength(2);
      act(() => { vi.advanceTimersByTime(1); });
      expect(mockInstances).toHaveLength(3);
    });
  });

  describe("네트워크 복구 (online 이벤트) 연동", () => {
    afterEach(() => {
      Object.defineProperty(navigator, "onLine", { value: true, configurable: true });
    });

    it("네트워크가 복구되면 CLOSED 상태 연결을 즉시 재연결한다", () => {
      renderHook(() => useSeatChangeSSE());
      mockInstances[0].readyState = MockEventSource.CLOSED;

      act(() => {
        window.dispatchEvent(new Event("online"));
      });

      expect(mockInstances).toHaveLength(2);
    });

    it("오프라인 상태에서 오류 발생 시 타이머를 걸지 않는다", () => {
      Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
      renderHook(() => useSeatChangeSSE());

      act(() => {
        mockInstances[0].simulateError(MockEventSource.CLOSED);
      });

      act(() => { vi.advanceTimersByTime(60_000); });
      expect(mockInstances).toHaveLength(1);
    });

    it("네트워크 복구 시 ref=null(오프라인 중 연결 끊김) 상태에서도 즉시 재연결한다", () => {
      Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
      renderHook(() => useSeatChangeSSE());

      act(() => {
        mockInstances[0].simulateError(MockEventSource.CLOSED);
      });
      // 오프라인이라 타이머 없음 → ref=null 상태

      Object.defineProperty(navigator, "onLine", { value: true, configurable: true });

      act(() => {
        window.dispatchEvent(new Event("online"));
      });

      expect(mockInstances).toHaveLength(2);
    });

    it("네트워크가 복구돼도 연결이 살아있으면 새 EventSource를 만들지 않는다", () => {
      renderHook(() => useSeatChangeSSE());
      mockInstances[0].readyState = MockEventSource.OPEN;

      act(() => {
        window.dispatchEvent(new Event("online"));
      });

      expect(mockInstances).toHaveLength(1);
    });

    it("언마운트 후에는 online 이벤트에 반응하지 않는다", () => {
      const { unmount } = renderHook(() => useSeatChangeSSE());
      mockInstances[0].readyState = MockEventSource.CLOSED;

      unmount();

      act(() => {
        window.dispatchEvent(new Event("online"));
      });

      expect(mockInstances).toHaveLength(1);
    });
  });

  describe("Page Visibility 연동", () => {
    afterEach(() => {
      Object.defineProperty(document, "hidden", { value: false, configurable: true });
    });

    it("탭이 숨겨진 상태에서는 재연결하지 않는다", () => {
      renderHook(() => useSeatChangeSSE());
      act(() => { mockInstances[0].simulateError(MockEventSource.CLOSED); });
      act(() => { vi.advanceTimersByTime(1000); });
      // 이미 재연결한 인스턴스를 CLOSED로 만들기
      mockInstances[1].readyState = MockEventSource.CLOSED;

      Object.defineProperty(document, "hidden", { value: true, configurable: true });

      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });

      // hidden=true이므로 추가 인스턴스 없음
      expect(mockInstances).toHaveLength(2);
    });

    it("탭 숨김 상태에서 오류 발생 시 타이머를 걸지 않는다", () => {
      Object.defineProperty(document, "hidden", { value: true, configurable: true });
      renderHook(() => useSeatChangeSSE());

      act(() => {
        mockInstances[0].simulateError(MockEventSource.CLOSED);
      });

      act(() => { vi.advanceTimersByTime(60_000); });
      expect(mockInstances).toHaveLength(1);
    });

    it("탭이 다시 보이면 ref=null(숨김 중 연결 끊김) 상태에서도 즉시 재연결한다", () => {
      Object.defineProperty(document, "hidden", { value: true, configurable: true });
      renderHook(() => useSeatChangeSSE());

      act(() => {
        mockInstances[0].simulateError(MockEventSource.CLOSED);
      });
      // 탭 숨김이라 타이머 없음 → ref=null 상태

      Object.defineProperty(document, "hidden", { value: false, configurable: true });

      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });

      expect(mockInstances).toHaveLength(2);
    });

    it("탭이 다시 보이면 CLOSED 상태 연결을 즉시 복구한다", () => {
      renderHook(() => useSeatChangeSSE());
      // 첫 연결을 CLOSED로 만든다
      mockInstances[0].readyState = MockEventSource.CLOSED;

      Object.defineProperty(document, "hidden", { value: false, configurable: true });

      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });

      expect(mockInstances).toHaveLength(2);
    });

    it("탭이 다시 보여도 연결이 살아있으면 새 EventSource를 만들지 않는다", () => {
      renderHook(() => useSeatChangeSSE());
      mockInstances[0].readyState = MockEventSource.OPEN;

      Object.defineProperty(document, "hidden", { value: false, configurable: true });

      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });

      expect(mockInstances).toHaveLength(1);
    });
  });

  describe("정리 (cleanup)", () => {
    it("언마운트 시 EventSource를 닫고 visibilitychange 리스너를 제거한다", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
      const { unmount } = renderHook(() => useSeatChangeSSE());

      unmount();

      expect(mockInstances[0].closeCalled).toBe(true);
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "visibilitychange",
        expect.any(Function),
      );
    });

    it("언마운트 시 대기 중인 재연결 타이머를 취소한다", () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
      const { unmount } = renderHook(() => useSeatChangeSSE());

      act(() => { mockInstances[0].simulateError(MockEventSource.CLOSED); });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      // 타이머 만료 후에도 새 인스턴스가 생기지 않아야 한다
      act(() => { vi.advanceTimersByTime(5000); });
      expect(mockInstances).toHaveLength(1);
    });
  });

  describe("closeConnection", () => {
    it("closeConnection 호출 시 EventSource를 즉시 닫는다", () => {
      const { result } = renderHook(() => useSeatChangeSSE());

      act(() => { result.current.closeConnection(); });

      expect(mockInstances[0].closeCalled).toBe(true);
    });

    it("closeConnection 호출 시 대기 중인 재연결 타이머를 취소한다", () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
      const { result } = renderHook(() => useSeatChangeSSE());

      act(() => { mockInstances[0].simulateError(MockEventSource.CLOSED); });
      act(() => { result.current.closeConnection(); });

      expect(clearTimeoutSpy).toHaveBeenCalled();
      act(() => { vi.advanceTimersByTime(5000); });
      expect(mockInstances).toHaveLength(1);
    });
  });
});

const BASE_DELAY = 1000;
