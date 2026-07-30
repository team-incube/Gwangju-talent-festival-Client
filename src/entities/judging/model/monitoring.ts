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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isJudgeHeader = (value: unknown): value is JudgeHeader =>
  isRecord(value) && typeof value.judgeId === "number" && typeof value.label === "string";

const isScoreCell = (value: unknown): value is ScoreCell =>
  isRecord(value) &&
  typeof value.judgeId === "number" &&
  (typeof value.score === "number" || value.score === null);

const isScoreRow = (value: unknown): value is ScoreRow =>
  isRecord(value) &&
  typeof value.teamId === "number" &&
  typeof value.performOrder === "number" &&
  typeof value.teamName === "string" &&
  Array.isArray(value.scores) &&
  value.scores.every(isScoreCell) &&
  typeof value.calculatedScore === "number" &&
  typeof value.rank === "number";

const isStroke = (value: unknown): value is Stroke =>
  isRecord(value) && typeof value.color === "string" && Array.isArray(value.points);

const isCommentCell = (value: unknown): value is CommentCell =>
  isRecord(value) &&
  typeof value.judgeId === "number" &&
  (value.strokes === null || (Array.isArray(value.strokes) && value.strokes.every(isStroke)));

const isCommentRow = (value: unknown): value is CommentRow =>
  isRecord(value) &&
  typeof value.teamId === "number" &&
  typeof value.performOrder === "number" &&
  typeof value.teamName === "string" &&
  Array.isArray(value.comments) &&
  value.comments.every(isCommentCell);

// SSE 전송이 중간에 끊겨 뒷부분(예: commentRows 전체)이 통째로 잘려 나가도, 그 앞에서 이미
// 완결된 필드는 살려서 반영할 수 있도록 누락된 배열은 빈 배열로 취급한다
export const sanitizeMonitoringResponse = (raw: unknown): JudgeMonitoringResponse | null => {
  if (!isRecord(raw)) return null;

  return {
    judges: Array.isArray(raw.judges) ? raw.judges.filter(isJudgeHeader) : [],
    scoreRows: Array.isArray(raw.scoreRows) ? raw.scoreRows.filter(isScoreRow) : [],
    commentRows: Array.isArray(raw.commentRows) ? raw.commentRows.filter(isCommentRow) : [],
  };
};

const mergeRowsByTeam = <T extends { teamId: number; performOrder: number }>(
  prevRows: T[],
  nextRows: T[],
): T[] => {
  const nextTeamIds = new Set(nextRows.map(row => row.teamId));
  const retainedPrevRows = prevRows.filter(row => !nextTeamIds.has(row.teamId));
  return [...nextRows, ...retainedPrevRows].sort((a, b) => a.performOrder - b.performOrder);
};

// 잘린 스냅샷 복구 시, 이번에 못 읽은 팀 행은 직전 스냅샷 값을 그대로 유지해 화면이 잠깐 비어 보이지 않게 한다
export const mergeMonitoringSnapshot = (
  prev: JudgeMonitoringResponse | null,
  next: JudgeMonitoringResponse,
): JudgeMonitoringResponse => {
  if (!prev) return next;

  return {
    judges: next.judges.length > 0 ? next.judges : prev.judges,
    scoreRows: mergeRowsByTeam(prev.scoreRows, next.scoreRows),
    commentRows: mergeRowsByTeam(prev.commentRows, next.commentRows),
  };
};
