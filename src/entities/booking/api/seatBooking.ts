import { Seat } from "../model/types";
import { toApiSeat } from "../model/seatLayouts";
import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

export const seatBooking = async (data: Omit<Seat, "status">) => {
  try {
    const response = await axios.post("/seat", toApiSeat(data));

    return { data: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError?.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : "좌석 예매에 실패했습니다.";

    // 호출부가 429(rate limit)를 재시도 대상으로 구분할 수 있게 상태 코드와 대기 시간을 실어 보낸다
    const retryAfter = Number(axiosError?.response?.headers?.["retry-after"]);

    throw Object.assign(new Error(errorMessage), {
      status: axiosError?.response?.status,
      retryAfterMs: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : undefined,
    });
  }
};
