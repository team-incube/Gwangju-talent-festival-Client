import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useReorderTeams } from "../useReorderTeams";
import { updateTeamOrder } from "@/entities/team/api/updateTeamOrder";
import { teamOrderQueryKey } from "@/entities/team/model/queryKeys";
import { Team } from "@/entities/team/model/types";

vi.mock("@/entities/team/api/updateTeamOrder", () => ({
  updateTeamOrder: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const makeTeam = (teamId: number, performOrder: number): Team => ({
  teamId,
  teamName: `팀${teamId}`,
  school: "광주고",
  teamGenre: "DANCE",
  applicantName: `신청자${teamId}`,
  performOrder,
  status: "PENDING",
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

describe("useReorderTeams - order 변환", () => {
  it("orderedTeamIds를 1부터 시작하는 order로 변환해 API를 호출한다", async () => {
    vi.mocked(updateTeamOrder).mockResolvedValueOnce({ data: null } as never);
    const { result } = renderHook(() => useReorderTeams(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.reorderTeams([3, 1, 2]);

    await waitFor(() => {
      expect(updateTeamOrder).toHaveBeenCalledWith([
        { teamId: 3, order: 1 },
        { teamId: 1, order: 2 },
        { teamId: 2, order: 3 },
      ]);
    });
  });
});

describe("useReorderTeams - 낙관적 업데이트", () => {
  it("성공 시 캐시가 새 순서로 갱신된 상태로 유지된다", async () => {
    const initialTeams = [makeTeam(1, 1), makeTeam(2, 2), makeTeam(3, 3)];
    queryClient.setQueryData(teamOrderQueryKey, initialTeams);
    vi.mocked(updateTeamOrder).mockResolvedValueOnce({ data: null } as never);

    const { result } = renderHook(() => useReorderTeams(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.reorderTeams([2, 1, 3]);

    await waitFor(() => {
      expect(
        queryClient.getQueryData<Team[]>(teamOrderQueryKey)?.map(team => team.teamId),
      ).toEqual([2, 1, 3]);
    });

    await waitFor(() => {
      expect(updateTeamOrder).toHaveBeenCalled();
    });
  });

  it("실패 시 이전 캐시로 롤백된다", async () => {
    const initialTeams = [makeTeam(1, 1), makeTeam(2, 2), makeTeam(3, 3)];
    queryClient.setQueryData(teamOrderQueryKey, initialTeams);
    vi.mocked(updateTeamOrder).mockRejectedValueOnce(new Error("팀 순서 변경에 실패했습니다."));

    const { result } = renderHook(() => useReorderTeams(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.reorderTeams([2, 1, 3]);

    await waitFor(() => {
      expect(queryClient.getQueryData<Team[]>(teamOrderQueryKey)?.map(team => team.teamId)).toEqual(
        [1, 2, 3],
      );
    });
  });
});
