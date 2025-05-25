export function isShow(type: "slogan" | "introduce"): boolean {
  const today = new Date();
  const targetDate = new Date(type === "slogan" ? "2024-05-26" : "2024-05-19");
  return today >= targetDate;
}
