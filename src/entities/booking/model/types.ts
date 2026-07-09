export const SECTIONS = ["RED", "YELLOW", "TEAL", "BLUE", "GREEN", "PURPLE"] as const;

export type Section = (typeof SECTIONS)[number];
export type SectionType = Section | null;

export const SECTION_LABELS: Record<Section, string> = {
  RED: "A",
  YELLOW: "B",
  TEAL: "C",
  BLUE: "D",
  GREEN: "E",
  PURPLE: "F",
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
  BLUE: { occupied: 0, total: 79 },
  GREEN: { occupied: 0, total: 96 },
  PURPLE: { occupied: 0, total: 79 },
} as const;

type SectionKey<T extends Section> = `section_${Lowercase<T>}`;

type AllSectionKeys = {
  [K in Section as SectionKey<K>]: {
    seats: boolean[];
  };
};

export type AllSeatsApiResponse = AllSectionKeys;

export interface SectionSeatsApiResponse {
  seats: boolean[];
}

export const getSectionFromKey = (key: keyof AllSeatsApiResponse): Section => {
  const sectionLetter = key.replace("section_", "").toUpperCase() as Section;
  if (SECTIONS.includes(sectionLetter)) {
    return sectionLetter;
  }
  throw new Error(`Invalid section key: ${key}`);
};
