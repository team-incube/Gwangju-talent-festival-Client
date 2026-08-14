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
  isTicketClosed: vi.fn(),
  daysUntil: vi.fn(),
  ticketWindow: vi.fn(),
}));

const PERFORMER_WINDOW = {
  open: new Date("2026-08-14T14:00:00+09:00"),
  close: new Date("2026-08-19T23:59:00+09:00"),
};
const GENERAL_WINDOW = {
  open: new Date("2026-08-20T19:00:00+09:00"),
  close: new Date("2026-09-04T18:00:00+09:00"),
};

import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/shared/utils/auth";
import { useMyBookedSeats } from "@/entities/booking/lib/useMySeat";
import { isTicketOpen, isTicketClosed, daysUntil, ticketWindow } from "@/shared/config/dateConfig";

const mockBookedSeats = (seats: unknown[]) =>
  vi
    .mocked(useMyBookedSeats)
    .mockReturnValue({ seats } as unknown as ReturnType<typeof useMyBookedSeats>);

const mockRouter = () => {
  const push = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
  return push;
};

beforeEach(() => {
  vi.clearAllMocks();
  mockBookedSeats([]);
  vi.mocked(isTicketOpen).mockReturnValue(true);
  vi.mocked(isTicketClosed).mockReturnValue(false);
  vi.mocked(daysUntil).mockReturnValue(0);
  vi.mocked(ticketWindow).mockImplementation((role) =>
    role === "PERFORMER" ? PERFORMER_WINDOW : GENERAL_WINDOW,
  );
});

describe("JudgingCtaSection - 심사 role", () => {
  it("ADMIN role이면 심사 모니터링 버튼을 보여주고 모니터링 페이지로 이동한다", async () => {
    const push = mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("ADMIN");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    await user.click(await screen.findByText("심사 모니터링"));

    expect(push).toHaveBeenCalledWith("/admin/judging-result");
  });

  it("JUDGE role이면 심사하러 가기 버튼을 보여주고 채점 페이지로 이동한다", async () => {
    const push = mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("JUDGE");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    await user.click(await screen.findByText("심사하러 가기"));

    expect(push).toHaveBeenCalledWith("/admin/evaluation");
  });

  it("오픈 전이어도 JUDGE는 좌석 예매 카드 없이 채점 페이지로 이동한다", async () => {
    const push = mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("JUDGE");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    await user.click(await screen.findByText("심사하러 가기"));

    expect(push).toHaveBeenCalledWith("/admin/evaluation");
    expect(screen.queryByText("좌석 예매")).toBeNull();
  });
});

describe("JudgingCtaSection - 좌석 예매 카드", () => {
  it("오픈 후에는 OPEN과 티켓마감을 보여주고 예매 페이지로 이동한다", async () => {
    const push = mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    expect(await screen.findByText("OPEN")).toBeInTheDocument();
    expect(screen.getByText("티켓마감")).toBeInTheDocument();
    await user.click(screen.getByText("예매 하러가기"));

    expect(push).toHaveBeenCalledWith("/booking");
  });

  it("오픈 전에는 남은 일수와 티켓오픈 시각을 보여준다", async () => {
    mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    vi.mocked(daysUntil).mockReturnValue(6);

    render(<JudgingCtaSection />);

    expect(await screen.findByText("D-6")).toBeInTheDocument();
    expect(screen.getByText("티켓오픈")).toBeInTheDocument();
    expect(screen.queryByText("OPEN")).toBeNull();
  });

  it("오픈 당일에는 D-Day를 보여준다", async () => {
    mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    vi.mocked(daysUntil).mockReturnValue(0);

    render(<JudgingCtaSection />);

    expect(await screen.findByText("D-Day")).toBeInTheDocument();
  });

  it("오픈 전에는 예매 버튼을 비활성화해 이동하지 않는다", async () => {
    const push = mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByRole("button", { name: "예매 하러가기" });

    expect(button).toBeDisabled();
    await user.click(button);
    expect(push).not.toHaveBeenCalled();
  });

  it("마감 후에는 예매마감과 마감 시각을 보여주고 버튼을 비활성화한다", async () => {
    const push = mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    vi.mocked(isTicketClosed).mockReturnValue(true);
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByRole("button", { name: "예매 하러가기" });

    expect(screen.getByText("예매마감")).toBeInTheDocument();
    expect(screen.getByText("티켓마감")).toBeInTheDocument();
    expect(button).toBeDisabled();
    await user.click(button);
    expect(push).not.toHaveBeenCalled();
  });

  it("PERFORMER는 선예매 마감 후 선예매 마감 시각과 함께 마감 상태를 보여준다", async () => {
    mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    vi.mocked(isTicketClosed).mockReturnValue(true);

    render(<JudgingCtaSection />);

    expect(await screen.findByText("예매마감")).toBeInTheDocument();
    expect(screen.getByText("2026.08.19 23:59")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예매 하러가기" })).toBeDisabled();
  });

  it("role이 없어도 좌석 예매 카드를 보여준다", async () => {
    mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue(null);
    vi.mocked(isTicketOpen).mockReturnValue(false);
    vi.mocked(daysUntil).mockReturnValue(6);

    render(<JudgingCtaSection />);

    expect(await screen.findByText("공연 관람 좌석 예매")).toBeInTheDocument();
    expect(screen.getByText("D-6")).toBeInTheDocument();
  });

  it("PERFORMER는 참가자 선예매 오픈 시각으로 남은 일수를 계산한다", async () => {
    mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    vi.mocked(daysUntil).mockReturnValue(2);

    render(<JudgingCtaSection />);
    await screen.findByText("D-2");

    expect(vi.mocked(daysUntil)).toHaveBeenCalledWith(new Date("2026-08-14T14:00:00+09:00"));
  });

  it("PERFORMER가 예매한 좌석이 있으면 예매 확인하기로 내 좌석 페이지로 이동한다", async () => {
    const push = mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");
    mockBookedSeats([{ section: "A", row: "D", seatNumber: "7" }]);
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    await user.click(await screen.findByText("예매 확인하기"));

    expect(push).toHaveBeenCalledWith("/booking/my");
    expect(screen.queryByText("예매 하러가기")).toBeNull();
  });

  it("일반 유저도 예매한 좌석이 있으면 마감 후에 예매 확인하기를 보여준다", async () => {
    const push = mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");
    vi.mocked(isTicketOpen).mockReturnValue(false);
    vi.mocked(isTicketClosed).mockReturnValue(true);
    mockBookedSeats([{ section: "A", row: "D", seatNumber: "7" }]);
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    await user.click(await screen.findByText("예매 확인하기"));

    expect(push).toHaveBeenCalledWith("/booking/my");
  });

  it("PERFORMER가 예매한 좌석이 없으면 예매 확인하기 버튼을 보여주지 않는다", async () => {
    mockRouter();
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");

    render(<JudgingCtaSection />);
    await screen.findByText("예매 하러가기");

    expect(screen.queryByText("예매 확인하기")).toBeNull();
  });
});
