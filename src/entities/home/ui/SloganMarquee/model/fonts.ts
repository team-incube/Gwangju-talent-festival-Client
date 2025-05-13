export const FONTS = Object.freeze([
  "Pretendard",
  "Arial",
  "NanumSquare",
  "DungGeunMo",
  "GmarketSans",
  "Orbitron",
]) as ReadonlyArray<string> & {
  readonly [index: number]: string;
};
export type FontType = (typeof FONTS)[number];
