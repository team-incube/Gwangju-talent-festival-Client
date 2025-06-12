import { DownloadIcon } from "@/shared/asset/svg/DownloadIcon";
import { toast } from "sonner";
import { colors } from "@/shared/utils/color";

interface DownloadButtonProps {
  filePath: string;
  label: string;
}

export const DownloadButton = ({ filePath, label }: DownloadButtonProps) => {
  const handleDownload = async () => {
    try {
      const fileUrl = filePath.startsWith('/') ? filePath : `/${filePath}`;
      
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath.split('/').pop() || '';
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success("파일이 다운로드되었습니다.");
    } catch (error) {
      console.error( error);
      toast.error("파일 다운로드에 실패했습니다.");
    }
  };

  return (
    <span
      className="cursor-pointer text-main-600 underline text-body2b flex items-center gap-2"
      onClick={handleDownload}
    >
      {label}
      <DownloadIcon color={colors.main[600]} />
    </span>
  );
};
