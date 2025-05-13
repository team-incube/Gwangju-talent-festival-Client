import { cn } from "@/shared/utils/cn";
import { SlideIndicatorProps } from "../model/SlideIndicatorProps";

export const SlideCounter = ({ current, total }: SlideIndicatorProps) => (
  <div className={cn("mt-[24px] mb-[44px] text-body1b mobile:my-16 mobile:text-caption1b")}>
    <span className={cn("text-main-600")}>{current + 1}</span>
    <span className={cn("text-gray-400")}>/{total}</span>
  </div>
);
