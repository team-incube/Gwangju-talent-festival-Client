"use client";

import Button from "@/shared/ui/Button";
import { toast } from "sonner";

export const ApplyPage = () => {
  const downloadFile = (filePath: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("파일이 다운로드되었습니다.");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-80 flex flex-col gap-4">
        <Button onClick={() => {
          downloadFile("/files/2025 광탈페 참가 신청서(서식)_v1.hwp");
        }}>참가 신청서 다운로드</Button>
        <Button onClick={() => {
          downloadFile("/files/2025 광탈페 참가신청 개인정보제공활용 동의서_v1.pdf");
        }}>개인정보 제공, 활용 동의서 다운로드</Button>
      </div>
    </div>
  );
};