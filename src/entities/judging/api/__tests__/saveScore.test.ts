import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxiosError } from "axios";
import { saveScore } from "../saveScore";
import instance from "@/shared/lib/axios";

vi.mock("@/shared/lib/axios", () => ({
  default: {
    patch: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("saveScore - 성공", () => {
  it("teamId와 점수로 채점 API를 호출한다", async () => {
    vi.mocked(instance.patch).mockResolvedValueOnce({ data: null });
    const scores = {
      completenessExpressionScore: 40,
      creativityCompositionScore: 30,
      stagePerformanceTeamworkScore: 30,
    };

    await saveScore(1, scores);

    expect(instance.patch).toHaveBeenCalledWith("/judge/1", scores);
  });
});

describe("saveScore - 실패", () => {
  it("서버 에러 메시지가 있으면 해당 메시지로 Error를 throw한다", async () => {
    const axiosError = new AxiosError("Request failed");
    axiosError.response = {
      data: { message: "이미 채점이 마감되었습니다." },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {} as never,
    };
    vi.mocked(instance.patch).mockRejectedValueOnce(axiosError);

    await expect(
      saveScore(1, {
        completenessExpressionScore: 0,
        creativityCompositionScore: 0,
        stagePerformanceTeamworkScore: 0,
      }),
    ).rejects.toThrow("이미 채점이 마감되었습니다.");
  });

  it("서버 에러 메시지가 없으면 기본 메시지로 Error를 throw한다", async () => {
    const axiosError = new AxiosError("Request failed");
    axiosError.response = {
      data: {},
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {} as never,
    };
    vi.mocked(instance.patch).mockRejectedValueOnce(axiosError);

    await expect(
      saveScore(1, {
        completenessExpressionScore: 0,
        creativityCompositionScore: 0,
        stagePerformanceTeamworkScore: 0,
      }),
    ).rejects.toThrow("심사 실패했습니다.");
  });
});
