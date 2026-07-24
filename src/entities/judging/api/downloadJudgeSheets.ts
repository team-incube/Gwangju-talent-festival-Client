import { downloadBlobFromApi } from "../lib/downloadBlob";

export const downloadJudgeSheets = async (): Promise<void> => {
  await downloadBlobFromApi(
    "/api/excel/judge-sheets",
    "심사결과.zip",
    "개별 심사표를 다운로드하지 못했습니다.",
  );
};
