import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useTeamScores } from "../useTeamScores";
import { saveScore } from "@/entities/judging/api/saveScore";
import { EMPTY_SCORE, Score } from "@/entities/judging/model/score";

vi.mock("@/entities/judging/api/saveScore", () => ({
  saveScore: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const makeScore = (teamId: number, overrides: Partial<Score> = {}): Score => ({
  judgementId: null,
  teamId,
  teamName: `팀${teamId}`,
  completenessExpressionScore: 0,
  creativityCompositionScore: 0,
  stagePerformanceTeamworkScore: 0,
  totalScore: 0,
  isPerformed: false,
  isJudged: false,
  ...overrides,
});

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

let queryClient: QueryClient;

const setNavigatorOnLine = (value: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  setNavigatorOnLine(true);
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

describe("useTeamScores - hasUnsavedEdit", () => {
  it("updateScore 호출 전에는 hasUnsavedEdit가 false다", () => {
    const teams = [makeScore(1)];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.hasUnsavedEdit(1)).toBe(false);
  });

  it("updateScore 호출 후에는 hasUnsavedEdit가 true다", () => {
    const teams = [makeScore(1)];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.updateScore(1, "completenessExpressionScore", 30);
    });

    expect(result.current.hasUnsavedEdit(1)).toBe(true);
  });

  it("submitScore 성공 후에는 hasUnsavedEdit가 다시 false로 돌아온다", async () => {
    vi.mocked(saveScore).mockResolvedValueOnce({} as never);
    const teams = [makeScore(1)];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.updateScore(1, "completenessExpressionScore", 30);
    });
    expect(result.current.hasUnsavedEdit(1)).toBe(true);

    act(() => {
      result.current.submitScore(1);
    });

    await waitFor(() => {
      expect(result.current.hasUnsavedEdit(1)).toBe(false);
    });
  });
});

describe("useTeamScores - savingTeamId", () => {
  it("저장 중인 팀의 id만 savingTeamId로 노출되고, 완료되면 다시 null이 된다", async () => {
    let resolveSave: () => void = () => {};
    vi.mocked(saveScore).mockImplementation(
      () =>
        new Promise(resolve => {
          resolveSave = () => resolve(undefined as never);
        }),
    );
    const teams = [makeScore(1), makeScore(2)];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.savingTeamId).toBeNull();

    act(() => {
      result.current.submitScore(1);
    });

    await waitFor(() => {
      expect(result.current.savingTeamId).toBe(1);
    });
    expect(result.current.savingTeamId).not.toBe(2);

    resolveSave();

    await waitFor(() => {
      expect(result.current.savingTeamId).toBeNull();
    });
  });
});

describe("useTeamScores - getScore", () => {
  it("이미 채점된 팀은 해당 팀의 점수를 반환한다", () => {
    const teams = [
      makeScore(1, {
        isJudged: true,
        completenessExpressionScore: 40,
        creativityCompositionScore: 20,
        stagePerformanceTeamworkScore: 10,
      }),
    ];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.getScore(1)).toEqual({
      completenessExpressionScore: 40,
      creativityCompositionScore: 20,
      stagePerformanceTeamworkScore: 10,
    });
  });

  it("아직 채점 안 된 팀은 EMPTY_SCORE(0점)를 반환한다", () => {
    const teams = [makeScore(1, { isJudged: false })];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.getScore(1)).toEqual(EMPTY_SCORE);
  });
});

describe("useTeamScores - 로컬 임시 저장", () => {
  it("updateScore를 호출하면 로컬에도 draft가 저장된다", () => {
    const teams = [makeScore(1)];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.updateScore(1, "completenessExpressionScore", 30);
    });

    expect(window.localStorage.getItem("judge-score-draft-1")).not.toBeNull();
  });

  it("저장에 성공하면 로컬 draft가 삭제된다", async () => {
    vi.mocked(saveScore).mockResolvedValueOnce({} as never);
    const teams = [makeScore(1)];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.updateScore(1, "completenessExpressionScore", 30);
    });
    act(() => {
      result.current.submitScore(1);
    });

    await waitFor(() => {
      expect(window.localStorage.getItem("judge-score-draft-1")).toBeNull();
    });
  });

  it("새로 마운트되어도 로컬에 남아있던 draft로 편집값을 복원한다", () => {
    window.localStorage.setItem(
      "judge-score-draft-1",
      JSON.stringify({
        completenessExpressionScore: 25,
        creativityCompositionScore: 0,
        stagePerformanceTeamworkScore: 0,
      }),
    );
    const teams = [makeScore(1)];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.getScore(1)).toEqual({
      completenessExpressionScore: 25,
      creativityCompositionScore: 0,
      stagePerformanceTeamworkScore: 0,
    });
  });
});

describe("useTeamScores - 오프라인 재시도", () => {
  it("네트워크 실패로 저장이 안 된 팀은 연결이 복구되면 자동으로 재시도한다", async () => {
    setNavigatorOnLine(false);
    vi.mocked(saveScore).mockRejectedValueOnce(new Error("네트워크 오류"));
    const teams = [makeScore(1)];
    const { result } = renderHook(() => useTeamScores(teams), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.updateScore(1, "completenessExpressionScore", 30);
    });
    act(() => {
      result.current.submitScore(1);
    });

    await waitFor(() => expect(saveScore).toHaveBeenCalledTimes(1));

    vi.mocked(saveScore).mockResolvedValueOnce({} as never);
    act(() => {
      setNavigatorOnLine(true);
      window.dispatchEvent(new Event("online"));
    });

    await waitFor(() => expect(saveScore).toHaveBeenCalledTimes(2));
  });
});
