import { memo } from "react";
import { cn } from "@/shared/utils/cn";
import { SlideIndicatorProps } from "../../model/SlideIndicatorProps";

const Dot = memo(({ active }: { active: boolean }) => (
  <div
    className={cn(
      "w-16 h-16 rounded-full transition-colors mobile:w-8 mobile:h-8",
      active ? "bg-main-600" : "bg-gray-400",
    )}
  />
));
Dot.displayName = "Dot";

export const SlideDots = memo(({ current, total }: SlideIndicatorProps) => (
  <div className="flex mt-[24px] mb-[44px] gap-[40px] mobile:gap-[24px]">
    {Array.from({ length: total }).map((_, idx) => (
      <Dot key={idx} active={current === idx} />
    ))}
  </div>
));

SlideDots.displayName = "SlideDots";
