import { seatBooking } from "@/entities/booking/api/seatBooking";
import { Seat } from "@/entities/booking/model/types";

export const RATE_LIMIT_RETRY_DELAYS_MS = [1500, 4000, 8000];

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 429는 서버가 요청을 처리하지 않은 상태라 같은 좌석을 다시 보내도 중복 예매가 되지 않는다.
// 거부된 요청까지 카운트하는 limiter도 있어서 간격을 넉넉히 두고, 서버가 Retry-After를 주면 그 값을 따른다
export const bookSeatWithRetry = async (seat: Omit<Seat, "status">) => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await seatBooking(seat);
    } catch (error) {
      const { status, retryAfterMs } = error as { status?: number; retryAfterMs?: number };
      if (status !== 429 || attempt >= RATE_LIMIT_RETRY_DELAYS_MS.length) throw error;
      await wait(Math.max(retryAfterMs ?? 0, RATE_LIMIT_RETRY_DELAYS_MS[attempt]));
    }
  }
};
