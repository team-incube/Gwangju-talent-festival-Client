import { memo } from "react";
import { cn } from "@/shared/utils/cn";
interface FloorButtonProps {
  floor: string;
  isSelected: boolean;
  seatInfo: string;
  onClick: () => void;
  className?: string;
}

export const FloorButton = memo<FloorButtonProps>(
  ({ floor, isSelected, seatInfo, onClick, className }) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center justify-center px-6 py-2 text-body2b transition-colors duration-200",
          "min-w-[160px] min-h-[40px]",
          isSelected
            ? "bg-orange-500 text-white"
            : "bg-transparent border-1 border-gray-200 text-gray-500",
          className,
        )}
      >
        <div className="flex items-center gap-18">
          <span className="text-caption2b font-bold">{floor}</span>
          <span className="text-caption2r opacity-80">{seatInfo}</span>
        </div>
      </button>
    );
  },
);

FloorButton.displayName = "FloorButton";

export default FloorButton;
