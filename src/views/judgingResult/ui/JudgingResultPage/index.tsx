"use client";

import { useState } from "react";
import { toast } from "sonner";
import BackHeader from "@/shared/ui/BackHeader";
import Button from "@/shared/ui/Button";
import { downloadJudgeSheets } from "@/entities/judging/api/downloadJudgeSheets";
import { downloadJudgingSummary } from "@/entities/judging/api/downloadJudgingSummary";
import ResultTable from "@/widgets/judgingResult/ui/ResultTable";
import CommentTable from "@/widgets/judgingResult/ui/CommentTable";
import { useJudgeMonitoring } from "../../model/useJudgeMonitoring";

const JudgingResultPage = () => {
  const { data, isConnected } = useJudgeMonitoring();
  const [downloadingSummary, setDownloadingSummary] = useState(false);
  const [downloadingSheets, setDownloadingSheets] = useState(false);

  const handleDownload = async (
    download: () => Promise<void>,
    setDownloading: (value: boolean) => void,
  ) => {
    setDownloading(true);
    try {
      await download();
      toast.success("다운로드 되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "다운로드하지 못했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-40 px-40 mobile:px-16 tablet:px-24">
      <div className="max-w-[1280px] w-full flex flex-col gap-32">
        <BackHeader text="심사 모니터링" goto="/home" />

        <div className="flex items-center justify-between gap-16 flex-wrap">
          <p className="text-caption1r text-gray-500">
            {isConnected ? "실시간 연결됨" : "연결 중..."}
          </p>
          <div className="flex gap-8">
            <Button
              type="button"
              variant="outline"
              disabled={downloadingSummary}
              onClick={() => handleDownload(downloadJudgingSummary, setDownloadingSummary)}
            >
              {downloadingSummary ? "다운로드 중..." : "심사집계표 다운로드"}
            </Button>
            <Button
              type="button"
              disabled={downloadingSheets}
              onClick={() => handleDownload(downloadJudgeSheets, setDownloadingSheets)}
            >
              {downloadingSheets ? "다운로드 중..." : "개별 심사표 다운로드"}
            </Button>
          </div>
        </div>

        <section className="flex flex-col gap-16">
          <h2 className="text-body2b">심사집계표</h2>
          <ResultTable
            judges={data?.judges ?? []}
            rows={data?.scoreRows ?? []}
            isLoading={data === null}
          />
        </section>

        <section className="flex flex-col gap-16">
          <h2 className="text-body2b">코멘트집계표</h2>
          <CommentTable
            judges={data?.judges ?? []}
            rows={data?.commentRows ?? []}
            isLoading={data === null}
          />
        </section>
      </div>
    </div>
  );
};

export default JudgingResultPage;
