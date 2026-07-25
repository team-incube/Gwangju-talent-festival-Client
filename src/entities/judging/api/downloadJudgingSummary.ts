import { downloadBlobFromApi } from "../lib/downloadBlob";

export const downloadJudgingSummary = async (): Promise<void> => {
  await downloadBlobFromApi(
    "/api/excel/summary",
    "심사집계표.xlsx",
    "심사집계표를 다운로드하지 못했습니다.",
  );
};
