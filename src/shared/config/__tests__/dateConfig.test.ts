import { describe, it, expect, vi, afterEach } from "vitest";
import {
  ticketOpenDate,
  performerTicketOpenDate,
  isTicketOpen,
  isTicketClosed,
  daysUntil,
  ticketWindow,
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
    vi.setSystemTime(new Date("2026-09-06T08:00:00+09:00"));
    expect(isTicketOpen("USER")).toBe(true);
    expect(isTicketClosed()).toBe(false);

    vi.setSystemTime(new Date("2026-09-06T08:01:00+09:00"));
    expect(isTicketOpen("USER")).toBe(false);
    expect(isTicketClosed()).toBe(true);
  });

  it("공연자는 일반 예매 기간에도 계속 열려 있다", () => {
    vi.setSystemTime(new Date("2026-08-20T00:00:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(true);
    expect(isTicketClosed("PERFORMER")).toBe(false);

    vi.setSystemTime(new Date("2026-08-25T12:00:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(true);
    expect(isTicketOpen("USER")).toBe(true);
  });

  it("공연자도 일반 마감 시각에 함께 닫힌다", () => {
    vi.setSystemTime(new Date("2026-09-06T08:01:00+09:00"));
    expect(isTicketOpen("PERFORMER")).toBe(false);
    expect(isTicketClosed("PERFORMER")).toBe(true);
  });

  it("공연자 마감 시각은 일반 마감 시각과 같다", () => {
    expect(ticketWindow("PERFORMER").close).toEqual(ticketCloseDate);
    expect(ticketWindow("USER").close).toEqual(ticketCloseDate);
  });
});

describe("daysUntil", () => {
  const originalTimeZone = process.env.TZ;

  afterEach(() => {
    vi.useRealTimers();
    process.env.TZ = originalTimeZone;
  });

  it("남은 날짜를 날짜 단위로 센다", () => {
    vi.setSystemTime(new Date("2026-08-14T14:00:00+09:00"));
    expect(daysUntil(ticketOpenDate)).toBe(6);
  });

  it("오픈 당일 오픈 시각 전이면 0을 반환한다", () => {
    vi.setSystemTime(new Date("2026-08-20T09:00:00+09:00"));
    expect(daysUntil(ticketOpenDate)).toBe(0);
  });

  it("디바이스 타임존이 KST가 아니어도 KST 날짜 기준으로 센다", () => {
    process.env.TZ = "UTC";
    vi.setSystemTime(new Date("2026-08-20T08:00:00+09:00"));
    expect(daysUntil(ticketOpenDate)).toBe(0);

    vi.setSystemTime(new Date("2026-08-19T23:00:00+09:00"));
    expect(daysUntil(ticketOpenDate)).toBe(1);
  });
});

describe("어드민 예매 기간", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("어드민은 오픈 전에도 열려 있고 마감 후에도 닫히지 않는다", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00+09:00"));
    expect(isTicketOpen("ADMIN")).toBe(true);

    vi.setSystemTime(new Date("2026-12-31T00:00:00+09:00"));
    expect(isTicketOpen("ADMIN")).toBe(true);
    expect(isTicketClosed("ADMIN")).toBe(false);
  });
});

describe("dateFromEnv", () => {
  it("오프셋 없는 env 값은 무시하고 폴백 시각을 쓴다", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_TICKET_OPEN_DATE", "2026-08-20T19:00:00");

    const { ticketOpenDate: parsed } = await import("../dateConfig");

    expect(parsed.toISOString()).toBe("2026-08-20T10:00:00.000Z");
    vi.unstubAllEnvs();
    vi.resetModules();
  });
});
