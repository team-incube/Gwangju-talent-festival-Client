import { SvgProps } from "@/shared/model/SvgProps";

export const DownloadIcon = ({
  height = 24,
  width = 24,
  color = "#121212",
}: SvgProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 20H5V18H19V20ZM5 9H9V3H15V9H19L12 16L5 9Z" fill={color}/>
    </svg>
  );
};