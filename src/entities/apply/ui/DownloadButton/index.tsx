import { DownloadIcon } from "@/shared/asset/svg/DownloadIcon";
import { toast } from "sonner";
import { colors } from "@/shared/utils/color";
import { useState } from "react";

interface DownloadButtonProps {
  filePath: string;
  label: string;
}

export const DownloadButton = ({ filePath, label }: DownloadButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      const cleanPath = filePath.replace(/^\/?(public\/)?/, '');
      
      const downloadUrl = `/api/download?path=${encodeURIComponent(cleanPath)}`;
      
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status} - ${errorText}`);
      }
      
      const url = URL.createObjectURL(await response.blob());
      
      const link = document.createElement("a");
      link.href = url;
      link.download = cleanPath.split("/").pop() || "";
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("파일이 다운로드되었습니다.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error( errorMessage);
      toast.error(`파일 다운로드에 실패했습니다: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <span
        className={`cursor-pointer text-main-600 underline text-body2b flex items-center gap-2 ${isLoading ? 'opacity-50' : ''}`}
        onClick={handleDownload}
      >
        {label}
        <DownloadIcon color={colors.main[600]} />
      </span>
    </div>
  );
};
