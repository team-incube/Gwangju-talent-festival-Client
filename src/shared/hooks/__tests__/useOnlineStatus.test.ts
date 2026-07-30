import { describe, it, expect, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnlineStatus } from "../useOnlineStatus";

const setNavigatorOnLine = (value: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
};

describe("useOnlineStatus", () => {
  afterEach(() => {
    setNavigatorOnLine(true);
  });

  it("navigator.onLine이 true면 온라인 상태로 시작한다", () => {
    setNavigatorOnLine(true);
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it("offline 이벤트가 발생하면 false로 바뀐다", () => {
    setNavigatorOnLine(true);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      setNavigatorOnLine(false);
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });

  it("online 이벤트가 발생하면 다시 true로 바뀐다", () => {
    setNavigatorOnLine(false);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      setNavigatorOnLine(true);
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });
});
