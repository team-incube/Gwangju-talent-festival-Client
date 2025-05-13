import { cn } from "@/shared/utils/cn";
import { SlideIndicatorProps } from "../model/SlideIndicatorProps";

export const SlideDots = ({ current, total }: SlideIndicatorProps) => (
  <div className="flex mt-[24px] mb-[44px] gap-[40px] mobile:gap-[24px]">
    {Array.from({ length: total }).map((_, idx) => (
      <div
        key={idx}
        className={cn(
          "w-16 h-16 rounded-full transition-colors mobile:w-8 mobile:h-8",
          current === idx ? "bg-main-600" : "bg-gray-400",
        )}
      />
    ))}
  </div>
);
