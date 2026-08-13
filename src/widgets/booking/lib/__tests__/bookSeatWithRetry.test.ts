import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  bookSeatWithRetry,
  bookSeatsBulkWithRetry,
  RATE_LIMIT_RETRY_DELAYS_MS,
} from "../bookSeatWithRetry";

vi.mock("@/entities/booking/api/seatBooking", () => ({
  seatBooking: vi.fn(),
  bulkSeatBooking: vi.fn(),
}));

import { seatBooking, bulkSeatBooking } from "@/entities/booking/api/seatBooking";

const mockSeatBooking = vi.mocked(seatBooking);
const mockBulkSeatBooking = vi.mocked(bulkSeatBooking);

const SEAT = { section: "RED", row: "B", seatNumber: "16" } as Parameters<
  typeof bookSeatWithRetry
>[0];

const rateLimitError = () => Object.assign(new Error("요청이 너무 잦습니다."), { status: 429 });

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("bookSeatWithRetry", () => {
  it("성공하면 재시도하지 않는다", async () => {
    mockSeatBooking.mockResolvedValue({ data: {} });

    await bookSeatWithRetry(SEAT);

    expect(mockSeatBooking).toHaveBeenCalledTimes(1);
  });

  it("429면 대기 후 재시도해 성공을 반환한다", async () => {
    mockSeatBooking.mockRejectedValueOnce(rateLimitError()).mockResolvedValue({ data: {} });

    const promise = bookSeatWithRetry(SEAT);
    await vi.advanceTimersByTimeAsync(RATE_LIMIT_RETRY_DELAYS_MS[0]);
    await promise;

    expect(mockSeatBooking).toHaveBeenCalledTimes(2);
  });

  it("429가 재시도 횟수를 넘기면 에러를 던진다", async () => {
    mockSeatBooking.mockRejectedValue(rateLimitError());

    const promise = bookSeatWithRetry(SEAT);
    const assertion = expect(promise).rejects.toThrow("요청이 너무 잦습니다.");
    await vi.advanceTimersByTimeAsync(RATE_LIMIT_RETRY_DELAYS_MS.reduce((a, b) => a + b, 0));
    await assertion;

    expect(mockSeatBooking).toHaveBeenCalledTimes(RATE_LIMIT_RETRY_DELAYS_MS.length + 1);
  });

  it("429가 아닌 오류는 즉시 던지고 재시도하지 않는다", async () => {
    mockSeatBooking.mockRejectedValue(
      Object.assign(new Error("이미 예매된 좌석입니다."), { status: 409 }),
    );

    await expect(bookSeatWithRetry(SEAT)).rejects.toThrow("이미 예매된 좌석입니다.");
    expect(mockSeatBooking).toHaveBeenCalledTimes(1);
  });
});

describe("bookSeatsBulkWithRetry", () => {
  const SEATS = [SEAT, { section: "GREEN", row: "C", seatNumber: "5" } as typeof SEAT];

  it("좌석을 bulk API 한 번으로 보낸다", async () => {
    mockBulkSeatBooking.mockResolvedValue({ data: {} });

    await bookSeatsBulkWithRetry(SEATS);

    expect(mockBulkSeatBooking).toHaveBeenCalledTimes(1);
    expect(mockBulkSeatBooking).toHaveBeenCalledWith(SEATS);
    expect(mockSeatBooking).not.toHaveBeenCalled();
  });

  it("429면 대기 후 같은 bulk 요청을 재시도한다", async () => {
    mockBulkSeatBooking.mockRejectedValueOnce(rateLimitError()).mockResolvedValue({ data: {} });

    const promise = bookSeatsBulkWithRetry(SEATS);
    await vi.advanceTimersByTimeAsync(RATE_LIMIT_RETRY_DELAYS_MS[0]);
    await promise;

    expect(mockBulkSeatBooking).toHaveBeenCalledTimes(2);
  });
});
