export const FONTS = Object.freeze([
  "Pretendard-Regular",
  "Arial",
  "NanumSquare",
  "DungGeunMo",
  "GmarketSansMedium",
  "Orbitron",
  "Cafe24ClassicType-Regular",
  "BMHANNAPro",
  "Danjo-bold-Regular",
  "Ownglyph_corncorn-Rg",
  "LeeSeoyun",
  "GangwonEduSaeeum_OTFMediumA",
  "Shilla_CultureB-Bold",
  "SangSangRock",
  "Dokrip"
]) as ReadonlyArray<string> & {
  readonly [index: number]: string;
};
export type FontType = (typeof FONTS)[number];
