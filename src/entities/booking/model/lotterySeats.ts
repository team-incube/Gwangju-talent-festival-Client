import { Section, Seat, SEAT_STATUS } from "./types";

export interface LotterySeatConfig {
  id: string;
  seats: Array<{
    no: number;
    seat_section: Section;
    seat_row: string;
    seat_number: number;
    to: string;
  }>;
}

export const LOTTERY_SEAT_CONFIGS: Record<string, LotterySeatConfig> = {
  "1": {
    id: "1",
    seats: [
      {
        no: 1,
        to: "01012341234",
        seat_section: "RED",
        seat_row: "F",
        seat_number: 1,
      },
    ],
  },
};

export const getLotteryConfig = (id: string): LotterySeatConfig | null => {
  return LOTTERY_SEAT_CONFIGS[id] || null;
};

export const convertToSeats = (config: LotterySeatConfig): Seat[] => {
  return config.seats.map(seat => ({
    seatNumber: seat.seat_number.toString(),
    no: seat.no.toString(),
    section: seat.seat_section,
    row: seat.seat_row,
    status: SEAT_STATUS.AVAILABLE,
    to: seat.to,
  }));
};
