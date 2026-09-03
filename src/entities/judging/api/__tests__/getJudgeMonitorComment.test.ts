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
  it("팀·심사위원 전용 BFF 라우트로 직접 조회한다", async () => {
    const response = { teamId: 1, strokes: [{ color: "#000", points: [{ x: 0, y: 0 }] }] };
    vi.mocked(instance.get).mockResolvedValueOnce({ data: response });

    const result = await getJudgeMonitorComment(1, 2);

    expect(instance.get).toHaveBeenCalledWith("/api/judge/monitor/1/comment/2", { baseURL: "" });
    expect(result).toEqual(response);
  });
});
