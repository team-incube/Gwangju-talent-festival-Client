import { Section, SeatLayout, Seat, SEAT_STATUS, SEAT_INFO } from "./types";

const SECTION_SEAT_PATTERNS: Record<Section, (number | null)[][]> = {
  RED: [
    [null, null, null, 4, 5, 6, 7, 8, 9, 10],
    [null, null, 3, 4, 5, 6, 7, 8, 9, 10],
    [null, null, 3, 4, 5, 6, 7, 8, 9, 10],
    [null, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [null, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ],

  YELLOW: Array.from({ length: 11 }, () =>
    Array.from({ length: 12 }, (_, colIndex) => colIndex + 11),
  ),

  TEAL: [
    [23, 24, 25, 26, 27, 28, 29, null, null, null],
    [23, 24, 25, 26, 27, 28, 29, 30, null, null],
    [23, 24, 25, 26, 27, 28, 29, 30, null, null],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, null],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, null],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
  ],

  BLUE: [
    [null, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ],

  GREEN: Array.from({ length: 8 }, () =>
    Array.from({ length: 12 }, (_, colIndex) => colIndex + 11),
  ),

  PURPLE: [
    [23, 24, 25, 26, 27, 28, 29, 30, 31, null],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
  ],
};

const TOP_BLOCK_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const BOTTOM_BLOCK_ROWS = ["L", "M", "N", "O", "P", "Q", "R", "S"];

const SECTION_ROW_LABELS: Record<Section, string[]> = {
  RED: TOP_BLOCK_ROWS,
  YELLOW: TOP_BLOCK_ROWS,
  TEAL: TOP_BLOCK_ROWS,
  BLUE: BOTTOM_BLOCK_ROWS,
  GREEN: BOTTOM_BLOCK_ROWS,
  PURPLE: BOTTOM_BLOCK_ROWS,
};

const generateSeatLayout = (section: Section): SeatLayout => {
  const seatInfo = SEAT_INFO[section];
  const { total } = seatInfo;
  const pattern = SECTION_SEAT_PATTERNS[section];
  const rowLabels = SECTION_ROW_LABELS[section];

  const seats: Seat[] = [];
  let seatIndex = 0;

  pattern.forEach((row, rowIndex) => {
    row.forEach(seatNumber => {
      if (seatNumber !== null && seatIndex < total) {
        const status = SEAT_STATUS.AVAILABLE;

        seats.push({
          seatNumber: seatNumber.toString(),
          row: rowLabels[rowIndex],
          status,
          section,
        });

        seatIndex++;
      }
    });
  });

  return {
    section,
    seats,
  };
};

export const SEAT_LAYOUTS: Record<Section, SeatLayout> = Object.freeze({
  RED: Object.freeze(generateSeatLayout("RED")),
  YELLOW: Object.freeze(generateSeatLayout("YELLOW")),
  TEAL: Object.freeze(generateSeatLayout("TEAL")),
  BLUE: Object.freeze(generateSeatLayout("BLUE")),
  GREEN: Object.freeze(generateSeatLayout("GREEN")),
  PURPLE: Object.freeze(generateSeatLayout("PURPLE")),
});

export const getSeatLayout = (section: Section): SeatLayout => {
  return SEAT_LAYOUTS[section];
};

export const findSeatById = (
  seatNumber: string,
  row: string,
  section: Section,
): Seat | undefined => {
  const layout = SEAT_LAYOUTS[section];
  return layout.seats.find(seat => seat.seatNumber === seatNumber && seat.row === row);
};

export const getAvailableSeatsCount = (section: Section): number => {
  const layout = SEAT_LAYOUTS[section];
  return layout.seats.filter(seat => seat.status === SEAT_STATUS.AVAILABLE).length;
};

export const getSeatPattern = (section: Section): (number | null)[][] => {
  return SECTION_SEAT_PATTERNS[section];
};

export const getRowLabels = (section: Section): string[] => {
  return SECTION_ROW_LABELS[section];
};
