import { Section } from "./types";

// 심사위원·스텝·내빈·출연팀용으로 미리 확보된 좌석. 서버가 available로 내려줘도 예매 대상에서 제외한다
// A열(무대 최전열)은 출연팀 좌석 — 일반·공연자 모두 예매 불가, 예매는 B열부터 시작한다
const RESERVED_ROWS: Partial<Record<Section, readonly string[]>> = {
  RED: ["A"],
  YELLOW: ["A"],
  TEAL: ["A"],
  GREEN: ["L", "M", "R", "S"],
};

export const isReservedSeat = (seat: { section: Section; row: string }): boolean =>
  RESERVED_ROWS[seat.section]?.includes(seat.row) ?? false;
