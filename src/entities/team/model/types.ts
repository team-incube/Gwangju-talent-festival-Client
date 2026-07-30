export type TeamStatus = "PENDING" | "ONGOING" | "FINISHED";

export type TeamGenre = "ALL" | "GUGAK" | "PLAY" | "DANCE" | "SING";

export const TEAM_GENRE_LABELS: Record<TeamGenre, string> = {
  ALL: "전체",
  GUGAK: "국악",
  PLAY: "밴드",
  DANCE: "댄스",
  SING: "보컬",
};

export type Team = {
  teamId: number;
  teamName: string;
  school: string;
  teamGenre: TeamGenre;
  applicantName: string | null;
  performOrder: number;
  status: TeamStatus;
};

export type TeamOrderItem = {
  teamId: number;
  order: number;
};
