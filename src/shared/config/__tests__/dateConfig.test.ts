import { describe, it, expect, vi, afterEach } from "vitest";
import { ticketOpenDate, performerTicketOpenDate, isTicketOpen } from "../dateConfig";

describe("티켓 오픈 시각", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("선예매는 2026-08-14 14:00 KST에 열린다", () => {
    expect(performerTicketOpenDate.toISOString()).toBe("2026-08-14T05:00:00.000Z");
  });

  it("일반 예매는 2026-08-20 19:00 KST에 열린다", () => {
    expect(ticketOpenDate.toISOString()).toBe("2026-08-20T10:00:00.000Z");
  });

  it("공연자는 선예매 오픈 1분 전까지 막히고 오픈 시각에 열린다", () => {
    vi.setSystemTime(new Date("2026-08-14T13:59:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(false);

    vi.setSystemTime(new Date("2026-08-14T14:00:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(true);
  });

  it("일반 유저는 선예매 기간에 막히고 일반 오픈 시각에 열린다", () => {
    vi.setSystemTime(new Date("2026-08-14T14:00:00+09:00"));
    expect(isTicketOpen("USER")).toBe(false);

    vi.setSystemTime(new Date("2026-08-20T18:59:00+09:00"));
    expect(isTicketOpen("USER")).toBe(false);

    vi.setSystemTime(new Date("2026-08-20T19:00:00+09:00"));
    expect(isTicketOpen("USER")).toBe(true);
  });

  it("role이 없어도 일반 오픈 시각을 따른다", () => {
    vi.setSystemTime(new Date("2026-08-19T23:59:00+09:00"));
    expect(isTicketOpen(null)).toBe(false);
    expect(isTicketOpen(undefined)).toBe(false);
  });
});
