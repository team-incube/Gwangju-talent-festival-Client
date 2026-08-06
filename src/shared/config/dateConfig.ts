export const ticketOpenDate = new Date(
  process.env.NEXT_PUBLIC_TICKET_OPEN_DATE ?? "2025-09-18T20:00:00+09:00",
);
export const performerTicketOpenDate = new Date(
  process.env.NEXT_PUBLIC_PERFORMER_TICKET_OPEN_DATE ?? "2026-08-15T00:00:00+09:00",
);
export const isTicketOpen = (role?: string | null) =>
  new Date() >= (role === "PERFORMER" ? performerTicketOpenDate : ticketOpenDate);
export const festivalDate = new Date("2025-09-27T00:00:00");
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
