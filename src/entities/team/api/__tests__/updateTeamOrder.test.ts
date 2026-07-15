import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxiosError } from "axios";
import { updateTeamOrder } from "../updateTeamOrder";
import instance from "@/shared/lib/axios";

vi.mock("@/shared/lib/axios", () => ({
  default: {
    patch: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateTeamOrder - 성공", () => {
  it("orderItems로 팀 순서 변경 API를 호출한다", async () => {
    vi.mocked(instance.patch).mockResolvedValueOnce({ data: null });
    const orderItems = [
      { teamId: 1, order: 1 },
      { teamId: 2, order: 2 },
    ];

    await updateTeamOrder(orderItems);

    expect(instance.patch).toHaveBeenCalledWith("/team/order", { orderItems });
  });
});

describe("updateTeamOrder - 실패", () => {
  it("서버 에러 메시지가 있으면 해당 메시지로 Error를 throw한다", async () => {
    const axiosError = new AxiosError("Request failed");
    axiosError.response = {
      data: { message: "이미 확정된 순서입니다." },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {} as never,
    };
    vi.mocked(instance.patch).mockRejectedValueOnce(axiosError);

    await expect(updateTeamOrder([{ teamId: 1, order: 1 }])).rejects.toThrow(
      "이미 확정된 순서입니다.",
    );
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

    await expect(updateTeamOrder([{ teamId: 1, order: 1 }])).rejects.toThrow(
      "팀 순서 변경에 실패했습니다.",
    );
  });
});
