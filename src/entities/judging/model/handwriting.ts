export type StrokePoint = {
  x: number;
  y: number;
};

export type Stroke = {
  color: string;
  points: StrokePoint[];
};

export type JudgeCommentResponse = {
  teamId: number;
  strokes: Stroke[];
};
