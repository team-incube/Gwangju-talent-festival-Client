import { Section } from "./types";

// 심사위원·스텝·내빈용으로 미리 확보된 좌석. 서버가 available로 내려줘도 예매 대상에서 제외한다
const RESERVED_ROWS: Partial<Record<Section, readonly string[]>> = {
  GREEN: ["L", "M", "R", "S"],
};

export const isReservedSeat = (seat: { section: Section; row: string }): boolean =>
  RESERVED_ROWS[seat.section]?.includes(seat.row) ?? false;
