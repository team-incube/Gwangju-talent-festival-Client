import { describe, it, expect, vi, beforeEach } from "vitest";
import { getJudgeMonitorComment } from "../getJudgeMonitorComment";
import instance from "@/shared/lib/axios";

vi.mock("@/shared/lib/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getJudgeMonitorComment", () => {
  it("팀·심사위원별 필기를 조회한다", async () => {
    const response = { teamId: 1, strokes: [{ color: "#000", points: [{ x: 0, y: 0 }] }] };
    vi.mocked(instance.get).mockResolvedValueOnce({ data: response });

    const result = await getJudgeMonitorComment(1, 2);

    // "/judge"로 시작해야 axios 인터셉터가 401/403을 리다이렉트 없이 호출부로 전달한다
    expect(instance.get).toHaveBeenCalledWith("/judge/monitor/1/comment/2");
    expect(result).toEqual(response);
  });

  it("응답 구조가 깨지면 에러를 던진다", async () => {
    vi.mocked(instance.get).mockResolvedValueOnce({ data: { teamId: 1 } });

    await expect(getJudgeMonitorComment(1, 2)).rejects.toThrow(
      "필기 데이터를 불러오는 중 오류가 발생했습니다.",
    );
  });
});
