export type TeamStatus = "PENDING" | "ONGOING" | "FINISHED";

export type Team = {
  teamId: number;
  teamName: string;
  school: string;
  performOrder: number;
  status: TeamStatus;
};

export type TeamOrderItem = {
  teamId: number;
  order: number;
};
