import { Stroke } from "./handwriting";

export type JudgeHeader = {
  judgeId: number;
  label: string;
};

export type ScoreCell = {
  judgeId: number;
  score: number | null;
};

export type ScoreRow = {
  teamId: number;
  performOrder: number;
  teamName: string;
  scores: ScoreCell[];
  calculatedScore: number;
  rank: number;
};

export type CommentCell = {
  judgeId: number;
  strokes: Stroke[] | null;
};

export type CommentRow = {
  teamId: number;
  performOrder: number;
  teamName: string;
  comments: CommentCell[];
};

export type JudgeMonitoringResponse = {
  judges: JudgeHeader[];
  scoreRows: ScoreRow[];
  commentRows: CommentRow[];
};
