const matchesSegment = (pathname: string, prefix: string): boolean => {
  return pathname === prefix || pathname.startsWith(prefix + "/");
};

const HIDDEN_PREFIXES = ["/signin", "/signup", "/vote", "/admin"];

export const isHiddenPath = (pathname: string): boolean => {
  if (matchesSegment(pathname, "/admin/apply")) return false;
  return HIDDEN_PREFIXES.some(prefix => matchesSegment(pathname, prefix));
};

export type SectionId =
  | "SloganSecondSection"
  | "PreliminaryResultSection"
  | "PreliminaryFourthSection"
  | "FinalsSixthSection";

export interface HeaderLink {
  section: SectionId;
  label: string;
}

export const links: HeaderLink[] = [
  { section: "SloganSecondSection", label: "2026 광탈페 슬로건" },
  { section: "PreliminaryResultSection", label: "2026 광탈페 예선" },
  { section: "PreliminaryFourthSection", label: "2026 광탈페 본선" },
];
