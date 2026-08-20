import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import BookingPage from "../index";
import { ticketCloseDate } from "@/shared/config/dateConfig";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock("@/widgets/booking/ui/SelectSection", () => ({ default: () => <div /> }));
vi.mock("@/widgets/booking/ui/SeatSection", () => ({ default: () => <div /> }));
vi.mock("@/entities/booking/lib/useSeatChangeSSE", () => ({ useSeatChangeSSE: vi.fn() }));
vi.mock("@/entities/booking/lib/useSeatState", () => ({ applySeatChange: vi.fn() }));
vi.mock("@/entities/booking/lib/useMySeat", () => ({ useMyBookedSeats: () => ({ seats: [] }) }));
vi.mock("@/widgets/booking/lib/useSeatBooking", () => ({
  useSeatBooking: () => ({ mutate: vi.fn(), isPending: false }),
  useMultipleSeatBooking: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("@/widgets/booking/lib/useAdminSeatBan", () => ({
  useAdminSeatBan: () => ({
    ban: { mutate: vi.fn(), isPending: false },
    unban: { mutate: vi.fn(), isPending: false },
  }),
}));
vi.mock("@/widgets/booking/lib/useSeatSelection", () => ({
  useSeatSelection: () => ({
    selectedSection: "A",
    selectedSeat: { row: "D", seatNumber: "7", status: "AVAILABLE" },
    selectedSeatInfo: { section: "A", row: "D", seatNumber: "7" },
    setSelectedSection: vi.fn(),
    selectSeat: vi.fn(),
    isComplete: true,
  }),
}));
vi.mock("@/widgets/booking/lib/usePerformerSeatSelection", () => ({
  usePerformerSeatSelection: () => ({
    selectedSection: "A",
    selectedSeats: [{ section: "A", row: "D", seatNumber: "7" }],
    setSelectedSection: vi.fn(),
    selectSeat: vi.fn(),
    isSeatSelected: vi.fn(),
    canBook: true,
    maxSelectableSeats: 2,
    removeOccupiedSeat: vi.fn(),
  }),
}));
vi.mock("@/shared/utils/auth", () => ({ getTokenFromCookie: vi.fn() }));

import { getTokenFromCookie } from "@/shared/utils/auth";

const bookingButton = () => screen.getByRole("button", { name: /예매|완료|마감|기간/ });

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.useRealTimers());

describe("BookingPage - 예매 기간 가드", () => {
  it("예매 기간 안이면 예매 버튼이 활성화된다", async () => {
    vi.setSystemTime(new Date(ticketCloseDate.getTime() - 1000));
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");

    render(<BookingPage />);

    expect(await screen.findByRole("button", { name: "예매하기" })).toBeEnabled();
  });

  it("마감 후에는 예매 버튼이 잠기고 마감 문구를 보여준다", async () => {
    vi.setSystemTime(new Date(ticketCloseDate.getTime() + 1000));
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");

    render(<BookingPage />);

    expect(await screen.findByRole("button", { name: "예매가 마감되었습니다" })).toBeDisabled();
  });

  it("공연자는 일반 예매 기간에도 예매 버튼이 활성화된다", async () => {
    vi.setSystemTime(new Date("2026-08-25T12:00:00+09:00"));
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");

    render(<BookingPage />);

    expect(await screen.findByRole("button", { name: "완료" })).toBeEnabled();
  });

  it("공연자도 일반 마감 후에는 예매 버튼이 잠긴다", async () => {
    vi.setSystemTime(new Date(ticketCloseDate.getTime() + 1000));
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");

    render(<BookingPage />);

    expect(await screen.findByRole("button", { name: "예매가 마감되었습니다" })).toBeDisabled();
  });

  it("어드민은 마감 후에도 예매 버튼을 쓸 수 있다", async () => {
    vi.setSystemTime(new Date(ticketCloseDate.getTime() + 1000));
    vi.mocked(getTokenFromCookie).mockReturnValue("ADMIN");

    render(<BookingPage />);

    expect(await screen.findByRole("button", { name: "예매하기" })).toBeEnabled();
  });

  it("페이지를 켜둔 채 마감 시각을 넘기면 새로고침 없이 버튼이 잠긴다", async () => {
    vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
    vi.setSystemTime(new Date(ticketCloseDate.getTime() - 2000));
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");

    render(<BookingPage />);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(bookingButton()).toBeEnabled();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(bookingButton()).toBeDisabled();
    expect(screen.getByText("예매가 마감되었습니다")).toBeInTheDocument();
  });
});
