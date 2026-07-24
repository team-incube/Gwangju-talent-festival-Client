"use client";

import { useState } from "react";
import { toast } from "sonner";
import BackHeader from "@/shared/ui/BackHeader";
import Button from "@/shared/ui/Button";
import { downloadJudgeSheets } from "@/entities/judging/api/downloadJudgeSheets";

const DownloadPage = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadJudgeSheets();
      toast.success("다운로드 되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "다운로드하지 못했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-40 px-40 mobile:px-16 tablet:px-24">
      <div className="max-w-[640px] w-full flex flex-col gap-24">
        <BackHeader text="심사표 다운로드" goto="/admin/evaluation" />

        <div className="flex flex-col gap-8 rounded-2xl border border-gray-100 p-24">
          <h2 className="text-body2b text-gray-900">집계표</h2>
          <p className="text-caption1r text-gray-500">
            심사위원별 채점 점수와 코멘트가 담긴 개별 심사표, 그리고 전체 팀의 집계표까지 함께 담긴
            ZIP 파일을 받습니다.
          </p>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full"
          >
            {isDownloading ? "다운로드 중..." : "집계표 다운로드"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
