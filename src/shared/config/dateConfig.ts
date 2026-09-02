// 오프셋이 없으면 디바이스 타임존으로 파싱돼 기기마다 오픈 시각이 달라진다
const HAS_UTC_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/;

// 오픈 시각은 잘못된 env 값 하나로 예매 전체가 막힐 수 있어 파싱 실패 시 하드코딩 값으로 되돌린다
const dateFromEnv = (value: string | undefined, fallback: string) => {
  if (!value || !HAS_UTC_OFFSET.test(value)) return new Date(fallback);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
};

// 모든 일정이 KST 기준이라 디바이스 타임존과 무관하게 KST로 환산해 표시·계산한다
// 반환된 Date는 UTC 게터로만 읽어야 한다 (실제 순간이 아니라 KST 벽시계를 담고 있음)
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
export const toKst = (date: Date) => new Date(date.getTime() + KST_OFFSET_MS);

export const ticketOpenDate = dateFromEnv(
  process.env.NEXT_PUBLIC_TICKET_OPEN_DATE,
  "2026-08-20T19:00:00+09:00",
);
export const performerTicketOpenDate = dateFromEnv(
  process.env.NEXT_PUBLIC_PERFORMER_TICKET_OPEN_DATE,
  "2026-08-14T14:00:00+09:00",
);
export const ticketCloseDate = dateFromEnv(
  process.env.NEXT_PUBLIC_TICKET_CLOSE_DATE,
  "2026-09-04T18:00:00+09:00",
);
// 공연자는 더 일찍 열리기만 하고, 마감은 일반 예매와 같이 간다
export const ticketWindow = (role?: string | null) => ({
  open: role === "PERFORMER" ? performerTicketOpenDate : ticketOpenDate,
  close: ticketCloseDate,
});

export const isTicketOpen = (role?: string | null) => {
  if (role === "ADMIN") return true;
  const now = new Date();
  const { open, close } = ticketWindow(role);
  return now >= open && now <= close;
};
export const isTicketClosed = (role?: string | null) =>
  role !== "ADMIN" && new Date() > ticketWindow(role).close;

// D-Day는 시각이 아니라 날짜 단위로 세므로 KST 자정 기준으로 자른 뒤 비교한다
const kstDayIndex = (date: Date) => Math.floor(toKst(date).getTime() / 86_400_000);
export const daysUntil = (date: Date) => kstDayIndex(date) - kstDayIndex(new Date());
export const festivalDate = new Date("2026-09-05T00:00:00+09:00");
export const sloganStartDate = dateFromEnv(
  process.env.NEXT_PUBLIC_SLOGAN_START_DATE,
  "2026-05-18T00:00:00+09:00",
);
export const sloganEndDate = dateFromEnv(
  process.env.NEXT_PUBLIC_SLOGAN_END_DATE,
  "2026-05-28T18:00:00+09:00",
);
export const isSloganPeriod = () => {
  const now = new Date();
  return now >= sloganStartDate && now <= sloganEndDate;
};
export const isSloganEnded = () => new Date() > sloganEndDate;
export const sloganAwardDate = new Date("2026-06-09T08:00:00+09:00");
export const isSloganAwardReleased = () => new Date() >= sloganAwardDate;

export const applyStartDate = dateFromEnv(
  process.env.NEXT_PUBLIC_APPLY_START_DATE,
  "2026-06-15T08:00:00+09:00",
);
export const applyEndDate = dateFromEnv(
  process.env.NEXT_PUBLIC_APPLY_END_DATE,
  "2026-06-22T18:00:00+09:00",
);
export const isApplyPeriod = () => {
  const now = new Date();
  return now >= applyStartDate && now <= applyEndDate;
};
export const isApplyEnded = () => new Date() > applyEndDate;

export const preliminaryResultOpenDate = dateFromEnv(
  process.env.NEXT_PUBLIC_PRELIMINARY_RESULT_OPEN_DATE,
  "2026-07-03T10:00:00+09:00",
);
export const isPreliminaryResultOpen = () => new Date() >= preliminaryResultOpenDate;

export const finalsLineupReleaseDate = dateFromEnv(
  process.env.NEXT_PUBLIC_FINALS_LINEUP_RELEASE_DATE,
  "2026-07-31T10:00:00+09:00",
);
export const isFinalsLineupReleased = () => new Date() >= finalsLineupReleaseDate;
