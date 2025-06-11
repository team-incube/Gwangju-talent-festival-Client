"use client";

import { DownloadButton } from "@/entities/apply/ui/DownloadButton";

export const ApplyPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className=" flex gap-20">
        <DownloadButton
          filePath="/files/2025 광탈페 참가 신청서(서식)_v1.hwp"
          label="참가 신청서"
        />
        <DownloadButton
          filePath="/files/2025 광탈페 참가신청 개인정보제공활용 동의서_v1.pdf"
          label="개인정보 제공, 활용 동의서"
        />
      </div>
    </div>
  );
};