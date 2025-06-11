
import { DownloadIcon } from "@/shared/asset/svg/DownloadIcon";
import { toast } from "sonner";

interface DownloadButtonProps {
  filePath: string;
  label: string;
}

export const DownloadButton = ({ filePath, label }: DownloadButtonProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("파일이 다운로드되었습니다.");
  };

  return (
    <span
      className="cursor-pointer text-main-600 underline text-body2b flex items-center gap-2"
      onClick={handleDownload}
    >
      {label}
      <DownloadIcon color="#AC42CD" />
    </span>
  );
};
