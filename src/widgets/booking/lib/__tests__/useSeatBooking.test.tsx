import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useSeatBooking, useMultipleSeatBooking } from "../useSeatBooking";
import { bookSeatWithRetry } from "../bookSeatWithRetry";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";
import { Seat, SEAT_STATUS } from "@/entities/booking/model/types";

vi.mock("../bookSeatWithRetry", () => ({
  bookSeatWithRetry: vi.fn(),
}));

vi.mock("@/entities/booking/api/getMySeat", () => ({
  getMySeats: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const seat = (section: Seat["section"], row: string, seatNumber: string): Seat => ({
  section,
  row,
  seatNumber,
  status: SEAT_STATUS.AVAILABLE,
});

let queryClient: QueryClient;

beforeEach(() => {
  vi.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

const findSeat = (seats: Seat[] | undefined, row: string, seatNumber: string) =>
  seats?.find(item => item.row === row && item.seatNumber === seatNumber);

describe("useSeatBooking", () => {
  it("예매에 성공하면 재조회를 기다리지 않고 해당 좌석을 즉시 occupied로 반영한다", async () => {
    vi.mocked(bookSeatWithRetry).mockResolvedValueOnce(undefined as never);
    queryClient.setQueryData<Seat[]>(seatQueryKeys.seatState("RED"), [
      seat("RED", "B", "1"),
      seat("RED", "B", "2"),
    ]);

    const { result } = renderHook(() => useSeatBooking(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ section: "RED", row: "B", seatNumber: "1" });
    });

    await waitFor(() => {
      const seats = queryClient.getQueryData<Seat[]>(seatQueryKeys.seatState("RED"));
      expect(findSeat(seats, "B", "1")?.status).toBe(SEAT_STATUS.OCCUPIED);
    });
    const seats = queryClient.getQueryData<Seat[]>(seatQueryKeys.seatState("RED"));
    expect(findSeat(seats, "B", "2")?.status).toBe(SEAT_STATUS.AVAILABLE);
  });

  it("예매에 성공하면 전체 구역 캐시에도 occupied로 반영한다", async () => {
    vi.mocked(bookSeatWithRetry).mockResolvedValueOnce(undefined as never);
    queryClient.setQueryData<Seat[]>(["allSectionsSeatState"], [seat("BLUE", "C", "3")]);

    const { result } = renderHook(() => useSeatBooking(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ section: "BLUE", row: "C", seatNumber: "3" });
    });

    await waitFor(() => {
      const seats = queryClient.getQueryData<Seat[]>(["allSectionsSeatState"]);
      expect(findSeat(seats, "C", "3")?.status).toBe(SEAT_STATUS.OCCUPIED);
    });
  });
});

describe("useMultipleSeatBooking", () => {
  it("다중 예매에 성공하면 선택한 좌석 전부를 즉시 occupied로 반영한다", async () => {
    vi.mocked(bookSeatWithRetry).mockResolvedValue(undefined as never);
    queryClient.setQueryData<Seat[]>(seatQueryKeys.seatState("RED"), [
      seat("RED", "B", "1"),
      seat("RED", "B", "2"),
      seat("RED", "B", "3"),
    ]);
    queryClient.setQueryData<Seat[]>(seatQueryKeys.seatState("GREEN"), [seat("GREEN", "C", "5")]);

    const { result } = renderHook(() => useMultipleSeatBooking(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate([
        { section: "RED", row: "B", seatNumber: "1" },
        { section: "RED", row: "B", seatNumber: "3" },
        { section: "GREEN", row: "C", seatNumber: "5" },
      ]);
    });

    await waitFor(() => {
      const redSeats = queryClient.getQueryData<Seat[]>(seatQueryKeys.seatState("RED"));
      expect(findSeat(redSeats, "B", "1")?.status).toBe(SEAT_STATUS.OCCUPIED);
      expect(findSeat(redSeats, "B", "3")?.status).toBe(SEAT_STATUS.OCCUPIED);
    });

    const redSeats = queryClient.getQueryData<Seat[]>(seatQueryKeys.seatState("RED"));
    expect(findSeat(redSeats, "B", "2")?.status).toBe(SEAT_STATUS.AVAILABLE);

    const greenSeats = queryClient.getQueryData<Seat[]>(seatQueryKeys.seatState("GREEN"));
    expect(findSeat(greenSeats, "C", "5")?.status).toBe(SEAT_STATUS.OCCUPIED);
  });

  it("일부 좌석 예매가 실패하면 캐시를 occupied로 바꾸지 않는다", async () => {
    vi.mocked(bookSeatWithRetry)
      .mockResolvedValueOnce(undefined as never)
      .mockRejectedValueOnce(new Error("이미 예매된 좌석입니다."));
    const { getMySeats } = await import("@/entities/booking/api/getMySeat");
    vi.mocked(getMySeats).mockResolvedValueOnce([]);
    queryClient.setQueryData<Seat[]>(seatQueryKeys.seatState("RED"), [
      seat("RED", "B", "1"),
      seat("RED", "B", "2"),
    ]);

    const { result } = renderHook(() => useMultipleSeatBooking(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate([
        { section: "RED", row: "B", seatNumber: "1" },
        { section: "RED", row: "B", seatNumber: "2" },
      ]);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    const seats = queryClient.getQueryData<Seat[]>(seatQueryKeys.seatState("RED"));
    expect(findSeat(seats, "B", "1")?.status).toBe(SEAT_STATUS.AVAILABLE);
  });
});
