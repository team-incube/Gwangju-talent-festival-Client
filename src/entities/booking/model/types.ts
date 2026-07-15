export const SECTIONS = [
  "RED",
  "YELLOW",
  "TEAL",
  "BLUE",
  "GREEN",
  "PURPLE",
  "WHEELCHAIR",
] as const;

export type Section = (typeof SECTIONS)[number];
export type SectionType = Section | null;

export const SECTION_LABELS: Record<Section, string> = {
  RED: "A",
  YELLOW: "B",
  TEAL: "C",
  BLUE: "D",
  GREEN: "E",
  PURPLE: "F",
  WHEELCHAIR: "W",
} as const;

export const getSectionLabel = (section: Section): string => SECTION_LABELS[section];

export const SEAT_STATUS = {
  OCCUPIED: "occupied",
  AVAILABLE: "available",
  SELECTED: "selected",
} as const;

export type SeatStatus = (typeof SEAT_STATUS)[keyof typeof SEAT_STATUS];

export interface Seat {
  seatNumber: string;
  row: string;
  status: SeatStatus;
  section: Section;
}

export interface SeatLayout {
  section: Section;
  seats: Seat[];
}

export interface SelectedSeatInfo {
  seat: Seat;
  section: Section;
}

export interface SeatInfo {
  occupied: number;
  total: number;
}

export interface SeatChangeEvent {
  seat_section: Section;
  seat_row: string;
  seat_number: number;
  is_available: boolean;
}

export const SEAT_INFO: Record<Section, SeatInfo> = {
  RED: { occupied: 0, total: 101 },
  YELLOW: { occupied: 0, total: 132 },
  TEAL: { occupied: 0, total: 101 },
  BLUE: { occupied: 0, total: 89 },
  GREEN: { occupied: 0, total: 96 },
  PURPLE: { occupied: 0, total: 89 },
  WHEELCHAIR: { occupied: 0, total: 6 },
} as const;

export interface AllSeatsApiResponse {
  sections: Record<string, { seats: boolean[] }>;
}

export interface SectionSeatsApiResponse {
  seats: boolean[];
}

export const SECTION_BY_LABEL: Record<string, Section> = Object.fromEntries(
  SECTIONS.map(section => [SECTION_LABELS[section], section]),
);

export const getSectionFromLabel = (label: string): Section | null =>
  SECTION_BY_LABEL[label] ?? null;
