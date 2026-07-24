"use client";

import { useState } from "react";
import { toast } from "sonner";
import BackHeader from "@/shared/ui/BackHeader";
import Button from "@/shared/ui/Button";
import { downloadJudgeSheets } from "@/entities/judging/api/downloadJudgeSheets";
import { downloadJudgingSummary } from "@/entities/judging/api/downloadJudgingSummary";

type DownloadTarget = "sheets" | "summary";

const DownloadPage = () => {
  const [loadingTarget, setLoadingTarget] = useState<DownloadTarget | null>(null);

  const handleDownload = async (target: DownloadTarget) => {
    setLoadingTarget(target);
    try {
      if (target === "sheets") {
        await downloadJudgeSheets();
      } else {
        await downloadJudgingSummary();
      }
      toast.success("다운로드 되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "다운로드하지 못했습니다.");
    } finally {
      setLoadingTarget(null);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-40 px-40 mobile:px-16 tablet:px-24">
      <div className="max-w-[640px] w-full flex flex-col gap-24">
        <BackHeader text="심사표 다운로드" goto="/admin/evaluation" />

        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-8 rounded-2xl border border-gray-100 p-24">
            <h2 className="text-body2b text-gray-900">개별 심사표</h2>
            <p className="text-caption1r text-gray-500">
              심사위원별 채점 점수와 코멘트가 담긴 개별 심사표, 그리고 최종 집계표까지 함께 담긴
              ZIP 파일을 받습니다.
            </p>
            <Button
              type="button"
              onClick={() => handleDownload("sheets")}
              disabled={loadingTarget !== null}
              className="w-full"
            >
              {loadingTarget === "sheets" ? "다운로드 중..." : "개별 심사표 다운로드"}
            </Button>
          </div>

          <div className="flex flex-col gap-8 rounded-2xl border border-gray-100 p-24">
            <h2 className="text-body2b text-gray-900">최종 집계표</h2>
            <p className="text-caption1r text-gray-500">
              전체 팀의 심사 결과를 합산한 집계표만 xlsx 파일로 받습니다.
            </p>
            <Button
              type="button"
              onClick={() => handleDownload("summary")}
              disabled={loadingTarget !== null}
              variant="outline"
              className="w-full"
            >
              {loadingTarget === "summary" ? "다운로드 중..." : "최종 집계표 다운로드"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
