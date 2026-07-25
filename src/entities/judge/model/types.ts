export type ProfilePoint = { x: number; y: number };
export type ProfileStroke = ProfilePoint[];

export interface JudgeProfile {
  affiliationStrokes: ProfileStroke[];
  positionStrokes: ProfileStroke[];
  nameStrokes: ProfileStroke[];
}
