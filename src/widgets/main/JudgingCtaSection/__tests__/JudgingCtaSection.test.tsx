import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JudgingCtaSection from "../index";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/shared/utils/auth", () => ({
  getTokenFromCookie: vi.fn(),
}));

vi.mock("@/entities/booking/lib/useMySeat", () => ({
  useMyBookedSeats: vi.fn(),
}));

vi.mock("@/shared/config/dateConfig", () => ({
  isTicketOpen: vi.fn(),
  performerTicketOpenDate: new Date("2026-08-14T14:00:00+09:00"),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTokenFromCookie } from "@/shared/utils/auth";
import { useMyBookedSeats } from "@/entities/booking/lib/useMySeat";
import { isTicketOpen } from "@/shared/config/dateConfig";

const mockBookedSeats = (seats: unknown[]) =>
  vi.mocked(useMyBookedSeats).mockReturnValue({ seats } as unknown as ReturnType<
    typeof useMyBookedSeats
  >);

beforeEach(() => {
  vi.clearAllMocks();
  mockBookedSeats([]);
  vi.mocked(isTicketOpen).mockReturnValue(true);
});

describe("JudgingCtaSection - 노출 및 이동 경로", () => {
  it("ADMIN role이면 심사 모니터링 버튼을 보여주고 모니터링 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("ADMIN");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByText("심사 모니터링");
    await user.click(button);

    expect(push).toHaveBeenCalledWith("/admin/judging-result");
  });

  it("JUDGE role이면 심사하러 가기 버튼을 보여주고 채점 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("JUDGE");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByText("심사하러 가기");
    await user.click(button);

    expect(push).toHaveBeenCalledWith("/admin/evaluation");
  });

  it("PERFORMER role이면 예매하러 가기 버튼을 보여주고 예매 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByText("예매하러 가기");
    await user.click(button);

    expect(push).toHaveBeenCalledWith("/booking");
  });

  it("PERFORMER가 예매한 좌석이 있으면 내 좌석 확인하기 버튼으로 내 좌석 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");
    mockBookedSeats([{ section: "A", row: "D", seatNumber: "7" }]);
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByText("내 좌석 확인하기");
    await user.click(button);

    expect(push).toHaveBeenCalledWith("/booking/my");
  });

  it("PERFORMER가 예매한 좌석이 없으면 내 좌석 확인하기 버튼을 보여주지 않는다", async () => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<
      typeof useRouter
    >);
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");

    render(<JudgingCtaSection />);
    await screen.findByText("예매하러 가기");

    expect(screen.queryByText("내 좌석 확인하기")).toBeNull();
  });

  it("선예매 오픈 전에는 오픈 예정 안내를 보여준다", async () => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<
      typeof useRouter
    >);
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");
    vi.mocked(isTicketOpen).mockReturnValue(false);

    render(<JudgingCtaSection />);

    expect(await screen.findByText("참가자 선예매 오픈 예정")).toBeInTheDocument();
    expect(screen.getByText(/부터 예매 가능/)).toBeInTheDocument();
    expect(screen.queryByText("좌석 예매가 열렸습니다")).toBeNull();
  });

  it("선예매 오픈 전에 예매 버튼을 누르면 토스트만 띄우고 이동하지 않는다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    await user.click(await screen.findByText("예매하러 가기"));

    expect(push).not.toHaveBeenCalled();
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith("신청 기간이 아닙니다.");
  });

  it("오픈 전이어도 JUDGE는 토스트 없이 채점 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("JUDGE");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    await user.click(await screen.findByText("심사하러 가기"));

    expect(push).toHaveBeenCalledWith("/admin/evaluation");
    expect(vi.mocked(toast.error)).not.toHaveBeenCalled();
  });

  it("USER role이면 버튼을 보여주지 않는다", () => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<
      typeof useRouter
    >);
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");

    render(<JudgingCtaSection />);

    expect(screen.queryByText("심사하러 가기")).not.toBeInTheDocument();
    expect(screen.queryByText("심사 모니터링")).not.toBeInTheDocument();
  });

  it("role이 없으면 버튼을 보여주지 않는다", () => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<
      typeof useRouter
    >);
    vi.mocked(getTokenFromCookie).mockReturnValue(null);

    render(<JudgingCtaSection />);

    expect(screen.queryByText("심사하러 가기")).not.toBeInTheDocument();
    expect(screen.queryByText("심사 모니터링")).not.toBeInTheDocument();
  });
});
