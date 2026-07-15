const extractFilename = (contentDisposition: string | null): string => {
  const match = contentDisposition?.match(/filename="?([^"]+)"?/);
  return match?.[1] ?? "judging-summary.xlsx";
};

export const downloadJudgingSummary = async (): Promise<void> => {
  const response = await fetch("/api/excel/summary");

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "심사 집계표를 다운로드하지 못했습니다.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = extractFilename(response.headers.get("content-disposition"));
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
