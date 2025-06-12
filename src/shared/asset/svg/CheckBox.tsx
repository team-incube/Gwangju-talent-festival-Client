import { SvgProps } from "@/shared/model/SvgProps";

export default function CheckBox({ width = 17, height = 16, color = "#909090" }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 17 16"
      fill="none"
    >
      <path
        d="M12.5 12.6667H4.5C4.13333 12.6667 3.83333 12.3667 3.83333 12V4C3.83333 3.63333 4.13333 3.33333 4.5 3.33333H12.5C12.8667 3.33333 13.1667 3.63333 13.1667 4V12C13.1667 12.3667 12.8667 12.6667 12.5 12.6667ZM13.1667 2H3.83333C3.1 2 2.5 2.6 2.5 3.33333V12.6667C2.5 13.4 3.1 14 3.83333 14H13.1667C13.9 14 14.5 13.4 14.5 12.6667V3.33333C14.5 2.6 13.9 2 13.1667 2Z"
        fill={color}
      />
    </svg>
  );
}
