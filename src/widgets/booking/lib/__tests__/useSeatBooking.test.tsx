import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useSeatBooking, useMultipleSeatBooking } from "../useSeatBooking";
import { bookSeatWithRetry, bookSeatsBulkWithRetry } from "../bookSeatWithRetry";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";
import { Seat, SEAT_STATUS } from "@/entities/booking/model/types";

vi.mock("../bookSeatWithRetry", () => ({
  bookSeatWithRetry: vi.fn(),
  bookSeatsBulkWithRetry: vi.fn(),
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

// ["mySeat"] 재조회만 수동으로 끝낼 수 있게 막아둔다
const holdMySeatRevalidation = () => {
  let finish!: () => void;
  const pending = new Promise<void>(resolve => (finish = resolve));
  const invalidateQueries = queryClient.invalidateQueries.bind(queryClient);

  vi.spyOn(queryClient, "invalidateQueries").mockImplementation(((filters?: {
    queryKey?: readonly unknown[];
  }) =>
    filters?.queryKey?.[0] === "mySeat"
      ? pending
      : invalidateQueries(filters)) as typeof queryClient.invalidateQueries);

  return () => finish();
};

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

  it("내 좌석 재조회가 끝나기 전에는 예매 완료 콜백을 실행하지 않는다", async () => {
    vi.mocked(bookSeatWithRetry).mockResolvedValueOnce(undefined as never);
    const finishRevalidation = holdMySeatRevalidation();
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useSeatBooking(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ section: "RED", row: "B", seatNumber: "1" }, { onSuccess });
    });

    await waitFor(() => expect(bookSeatWithRetry).toHaveBeenCalled());
    expect(onSuccess).not.toHaveBeenCalled();

    finishRevalidation();

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });
});

describe("useMultipleSeatBooking", () => {
  it("좌석이 여러 개여도 bulk 요청을 한 번만 보낸다", async () => {
    vi.mocked(bookSeatsBulkWithRetry).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useMultipleSeatBooking(), {
      wrapper: createWrapper(queryClient),
    });

    const seats = [
      { section: "RED" as const, row: "B", seatNumber: "1" },
      { section: "GREEN" as const, row: "C", seatNumber: "5" },
    ];

    act(() => {
      result.current.mutate(seats);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bookSeatsBulkWithRetry).toHaveBeenCalledTimes(1);
    expect(bookSeatsBulkWithRetry).toHaveBeenCalledWith(seats);
    expect(bookSeatWithRetry).not.toHaveBeenCalled();
  });

  it("다중 예매에 성공하면 선택한 좌석 전부를 즉시 occupied로 반영한다", async () => {
    vi.mocked(bookSeatsBulkWithRetry).mockResolvedValue(undefined as never);
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

  it("bulk 예매가 실패하면 캐시를 occupied로 바꾸지 않고 좌석 현황을 다시 조회한다", async () => {
    vi.mocked(bookSeatsBulkWithRetry).mockRejectedValueOnce(new Error("이미 예매된 좌석입니다."));
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
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
    expect(findSeat(seats, "B", "2")?.status).toBe(SEAT_STATUS.AVAILABLE);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: seatQueryKeys.seatState("RED"),
    });
  });
});
