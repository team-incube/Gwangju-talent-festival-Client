import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useSaveJudgeComment, getJudgeCommentDraft } from "../useSaveJudgeComment";
import { saveJudgeComment } from "../../api/saveJudgeComment";

vi.mock("../../api/saveJudgeComment", () => ({
  saveJudgeComment: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const setNavigatorOnLine = (value: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
};

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

let queryClient: QueryClient;

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  setNavigatorOnLine(true);
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  setNavigatorOnLine(true);
});

describe("useSaveJudgeComment - 온라인 상태", () => {
  it("saveImmediately를 호출하면 서버로 전송되고 draft는 남지 않는다", async () => {
    vi.mocked(saveJudgeComment).mockResolvedValueOnce(undefined as never);
    const { result } = renderHook(() => useSaveJudgeComment(1), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.saveImmediately([{ color: "#000", points: [{ x: 0, y: 0 }] }]);
    });

    await waitFor(() =>
      expect(saveJudgeComment).toHaveBeenCalledWith(1, [{ color: "#000", points: [{ x: 0, y: 0 }] }]),
    );
    await waitFor(() => expect(getJudgeCommentDraft(1)).toBeNull());
  });
});

describe("useSaveJudgeComment - 오프라인 상태", () => {
  it("오프라인이면 서버 전송을 시도하지 않고 로컬에만 임시 저장한다", () => {
    setNavigatorOnLine(false);
    const { result } = renderHook(() => useSaveJudgeComment(1), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.saveImmediately([{ color: "#000", points: [{ x: 1, y: 1 }] }]);
    });

    expect(saveJudgeComment).not.toHaveBeenCalled();
    expect(getJudgeCommentDraft(1)).toEqual([{ color: "#000", points: [{ x: 1, y: 1 }] }]);
  });

  it("연결이 복구되면 남아있던 draft를 자동으로 재전송한다", async () => {
    setNavigatorOnLine(false);
    const { result } = renderHook(() => useSaveJudgeComment(1), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.saveImmediately([{ color: "#000", points: [{ x: 2, y: 2 }] }]);
    });
    expect(saveJudgeComment).not.toHaveBeenCalled();

    vi.mocked(saveJudgeComment).mockResolvedValueOnce(undefined as never);
    act(() => {
      setNavigatorOnLine(true);
      window.dispatchEvent(new Event("online"));
    });

    await waitFor(() =>
      expect(saveJudgeComment).toHaveBeenCalledWith(1, [{ color: "#000", points: [{ x: 2, y: 2 }] }]),
    );
  });
});
