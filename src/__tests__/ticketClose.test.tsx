import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { NextRequest } from "next/server";
import JudgingCtaSection from "@/widgets/main/JudgingCtaSection";
import { middleware } from "../middleware";
import { isTicketOpen, isTicketClosed, ticketCloseDate } from "@/shared/config/dateConfig";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/shared/utils/auth", () => ({ getTokenFromCookie: vi.fn(() => "USER") }));
vi.mock("@/entities/booking/lib/useMySeat", () => ({ useMyBookedSeats: () => ({ seats: [] }) }));

const req = (path: string, role: string) =>
  new NextRequest(new URL(path, "http://localhost"), {
    headers: { Cookie: `accessToken=a; refreshToken=b; role=${role}` },
  });

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.useRealTimers());

describe("마감 시각 이후 (실제 dateConfig)", () => {
  it("마감 1초 뒤: 플래그, 미들웨어, 카드가 모두 마감 상태다", async () => {
    vi.setSystemTime(new Date(ticketCloseDate.getTime() + 1000));

    expect(isTicketOpen("USER")).toBe(false);
    expect(isTicketOpen("PERFORMER")).toBe(false);
    expect(isTicketClosed()).toBe(true);
    expect(middleware(req("/booking", "USER")).status).toBe(307);
    expect(middleware(req("/booking", "PERFORMER")).status).toBe(307);
    expect(middleware(req("/booking", "ADMIN")).status).toBe(200);

    render(<JudgingCtaSection />);
    expect(await screen.findByText("예매마감")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예매 하러가기" })).toBeDisabled();
    expect(screen.getByText("2026.09.04 18:00")).toBeInTheDocument();
  });

  it("마감 1초 전: 아직 열려 있다", async () => {
    vi.setSystemTime(new Date(ticketCloseDate.getTime() - 1000));

    expect(isTicketOpen("USER")).toBe(true);
    expect(isTicketClosed()).toBe(false);
    expect(middleware(req("/booking", "USER")).status).toBe(200);

    render(<JudgingCtaSection />);
    expect(await screen.findByText("OPEN")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예매 하러가기" })).toBeEnabled();
  });

  it("페이지를 켜둔 채 마감 시각을 넘기면 새로고침 없이 버튼이 잠긴다", async () => {
    vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
    vi.setSystemTime(new Date(ticketCloseDate.getTime() - 2000));

    render(<JudgingCtaSection />);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole("button", { name: "예매 하러가기" })).toBeEnabled();
    expect(screen.getByText("OPEN")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText("예매마감")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예매 하러가기" })).toBeDisabled();
  });

  it("공연자는 선예매 마감 후 일반 예매 기간에도 막힌다", () => {
    vi.setSystemTime(new Date("2026-08-19T23:59:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(true);
    expect(middleware(req("/booking", "PERFORMER")).status).toBe(200);

    vi.setSystemTime(new Date("2026-08-20T00:00:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(false);
    expect(middleware(req("/booking", "PERFORMER")).status).toBe(307);

    vi.setSystemTime(new Date("2026-08-25T12:00:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(false);
    expect(middleware(req("/booking", "PERFORMER")).status).toBe(307);
    expect(middleware(req("/booking", "USER")).status).toBe(200);
  });

  it("축제 당일(2026-09-05)에도 예매는 막혀 있다", () => {
    vi.setSystemTime(new Date("2026-09-05T10:00:00+09:00"));
    expect(isTicketClosed()).toBe(true);
    expect(middleware(req("/booking/my", "USER")).status).toBe(307);
  });
});
