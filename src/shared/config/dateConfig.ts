// 오픈 시각은 잘못된 env 값 하나로 예매 전체가 막힐 수 있어 파싱 실패 시 하드코딩 값으로 되돌린다
const dateFromEnv = (value: string | undefined, fallback: string) => {
  const parsed = new Date(value ?? fallback);
  return Number.isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
};

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
// 참가자 선예매는 일반 예매가 열리기 전날까지만 진행한다
export const performerTicketCloseDate = dateFromEnv(
  process.env.NEXT_PUBLIC_PERFORMER_TICKET_CLOSE_DATE,
  "2026-08-19T23:59:00+09:00",
);
// 공연자는 선예매 기간에만 예매하고, 일반 예매 기간에는 참여하지 않는다
export const ticketWindow = (role?: string | null) =>
  role === "PERFORMER"
    ? { open: performerTicketOpenDate, close: performerTicketCloseDate }
    : { open: ticketOpenDate, close: ticketCloseDate };

export const isTicketOpen = (role?: string | null) => {
  const now = new Date();
  const { open, close } = ticketWindow(role);
  return now >= open && now <= close;
};
export const isTicketClosed = (role?: string | null) => new Date() > ticketWindow(role).close;

// D-Day는 시각이 아니라 날짜 단위로 세므로 자정 기준으로 자른 뒤 비교한다
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const daysUntil = (date: Date) =>
  Math.round((startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / 86_400_000);
export const festivalDate = new Date("2026-09-05T00:00:00+09:00");
export const sloganStartDate = new Date(
  process.env.NEXT_PUBLIC_SLOGAN_START_DATE ?? "2026-05-18T00:00:00+09:00",
);
export const sloganEndDate = new Date(
  process.env.NEXT_PUBLIC_SLOGAN_END_DATE ?? "2026-05-28T18:00:00+09:00",
);
export const isSloganPeriod = () => {
  const now = new Date();
  return now >= sloganStartDate && now <= sloganEndDate;
};
export const isSloganEnded = () => new Date() > sloganEndDate;
export const sloganAwardDate = new Date("2026-06-09T08:00:00+09:00");
export const isSloganAwardReleased = () => new Date() >= sloganAwardDate;

export const applyStartDate = new Date(
  process.env.NEXT_PUBLIC_APPLY_START_DATE ?? "2026-06-15T08:00:00+09:00",
);
export const applyEndDate = new Date(
  process.env.NEXT_PUBLIC_APPLY_END_DATE ?? "2026-06-22T18:00:00+09:00",
);
export const isApplyPeriod = () => {
  const now = new Date();
  return now >= applyStartDate && now <= applyEndDate;
};
export const isApplyEnded = () => new Date() > applyEndDate;

const PRELIMINARY_RESULT_OPEN_DATE_FALLBACK = "2026-07-03T10:00:00+09:00";
const parsedPreliminaryResultOpenDate = new Date(
  process.env.NEXT_PUBLIC_PRELIMINARY_RESULT_OPEN_DATE ?? PRELIMINARY_RESULT_OPEN_DATE_FALLBACK,
);
export const preliminaryResultOpenDate = Number.isNaN(parsedPreliminaryResultOpenDate.getTime())
  ? new Date(PRELIMINARY_RESULT_OPEN_DATE_FALLBACK)
  : parsedPreliminaryResultOpenDate;
export const isPreliminaryResultOpen = () => new Date() >= preliminaryResultOpenDate;

const FINALS_LINEUP_RELEASE_DATE_FALLBACK = "2026-07-31T10:00:00+09:00";
const parsedFinalsLineupReleaseDate = new Date(
  process.env.NEXT_PUBLIC_FINALS_LINEUP_RELEASE_DATE ?? FINALS_LINEUP_RELEASE_DATE_FALLBACK,
);
export const finalsLineupReleaseDate = Number.isNaN(parsedFinalsLineupReleaseDate.getTime())
  ? new Date(FINALS_LINEUP_RELEASE_DATE_FALLBACK)
  : parsedFinalsLineupReleaseDate;
export const isFinalsLineupReleased = () => new Date() >= finalsLineupReleaseDate;
