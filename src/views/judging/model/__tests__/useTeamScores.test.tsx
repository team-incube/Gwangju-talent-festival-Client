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

beforeEach(() => {
  vi.clearAllMocks();
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
