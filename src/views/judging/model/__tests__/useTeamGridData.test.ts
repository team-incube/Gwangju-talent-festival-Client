import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTeamGridData } from "../useTeamGridData";
import { useGetJudgeList } from "../useGetJudgeList";
import { useGetTeamOrder } from "../useGetTeamOrder";
import { Score } from "@/entities/judging/model/score";
import { Team } from "@/entities/team/model/types";

vi.mock("../useGetJudgeList", () => ({
  useGetJudgeList: vi.fn(),
}));

vi.mock("../useGetTeamOrder", () => ({
  useGetTeamOrder: vi.fn(),
}));

const makeScore = (teamId: number): Score => ({
  judgementId: null,
  teamId,
  teamName: `팀${teamId}`,
  completenessExpressionScore: 0,
  creativityCompositionScore: 0,
  stagePerformanceTeamworkScore: 0,
  totalScore: 0,
  isPerformed: false,
  isJudged: false,
});

const makeTeam = (teamId: number, performOrder: number): Team => ({
  teamId,
  teamName: `팀${teamId}`,
  school: "광주고",
  performOrder,
  status: "PENDING",
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useTeamGridData - performOrder 기준 정렬", () => {
  it("팀 순서 데이터를 반영해 performOrder 오름차순으로 정렬한다", () => {
    vi.mocked(useGetJudgeList).mockReturnValue({
      data: [makeScore(1), makeScore(2), makeScore(3)],
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(useGetTeamOrder).mockReturnValue({
      data: [makeTeam(1, 3), makeTeam(2, 1), makeTeam(3, 2)],
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useTeamGridData());

    expect(result.current.teams.map(team => team.teamId)).toEqual([2, 3, 1]);
    expect(result.current.teams.map(team => team.performOrder)).toEqual([1, 2, 3]);
  });

  it("팀 순서 데이터에 없는 teamId는 teamId 값을 performOrder로 사용한다", () => {
    vi.mocked(useGetJudgeList).mockReturnValue({
      data: [makeScore(1), makeScore(5)],
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(useGetTeamOrder).mockReturnValue({
      data: [makeTeam(1, 10)],
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useTeamGridData());

    const team5 = result.current.teams.find(team => team.teamId === 5);
    expect(team5?.performOrder).toBe(5);
  });
});

describe("useTeamGridData - 로딩/에러 상태", () => {
  it("점수 또는 순서 데이터 중 하나라도 로딩 중이면 isLoading이 true다", () => {
    vi.mocked(useGetJudgeList).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    } as never);
    vi.mocked(useGetTeamOrder).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as never);

    const { result } = renderHook(() => useTeamGridData());

    expect(result.current.isLoading).toBe(true);
  });

  it("점수 또는 순서 데이터 중 하나라도 에러면 isError가 true다", () => {
    vi.mocked(useGetJudgeList).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(useGetTeamOrder).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    } as never);

    const { result } = renderHook(() => useTeamGridData());

    expect(result.current.isError).toBe(true);
  });
});
