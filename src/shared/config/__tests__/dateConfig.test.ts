import { describe, it, expect, vi, afterEach } from "vitest";
import {
  ticketOpenDate,
  performerTicketOpenDate,
  isTicketOpen,
  isTicketClosed,
  daysUntil,
  ticketWindow,
  performerTicketCloseDate,
  ticketCloseDate,
} from "../dateConfig";

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

describe("티켓 마감 시각", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("마감 시각까지는 열려 있고 그 뒤에는 닫힌다", () => {
    vi.setSystemTime(new Date("2026-09-04T18:00:00+09:00"));
    expect(isTicketOpen("USER")).toBe(true);
    expect(isTicketClosed()).toBe(false);

    vi.setSystemTime(new Date("2026-09-04T18:01:00+09:00"));
    expect(isTicketOpen("USER")).toBe(false);
    expect(isTicketClosed()).toBe(true);
  });

  it("공연자는 선예매 마감 시각까지 열려 있고 1분 뒤에는 닫힌다", () => {
    vi.setSystemTime(new Date("2026-08-19T23:59:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(true);
    expect(isTicketClosed("PERFORMER")).toBe(false);

    vi.setSystemTime(new Date("2026-08-20T00:00:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(false);
    expect(isTicketClosed("PERFORMER")).toBe(true);
  });

  it("공연자는 일반 예매 기간에도 열리지 않는다", () => {
    vi.setSystemTime(new Date("2026-08-25T12:00:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(false);
    expect(isTicketClosed("PERFORMER")).toBe(true);
    expect(isTicketOpen("USER")).toBe(true);
  });

  it("공연자 일정은 항상 선예매 일정이다", () => {
    expect(ticketWindow("PERFORMER").close).toEqual(performerTicketCloseDate);
    expect(ticketWindow("USER").close).toEqual(ticketCloseDate);
  });
});

describe("daysUntil", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("남은 날짜를 날짜 단위로 센다", () => {
    vi.setSystemTime(new Date("2026-08-14T14:00:00+09:00"));
    expect(daysUntil(ticketOpenDate)).toBe(6);
  });

  it("오픈 당일 오픈 시각 전이면 0을 반환한다", () => {
    vi.setSystemTime(new Date("2026-08-20T09:00:00+09:00"));
    expect(daysUntil(ticketOpenDate)).toBe(0);
  });
});
