import { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface ScrollableContentProps {
  children: ReactNode;
  height?: string;
  className?: string;
}

export default function ScrollableContent({
  children,
  height = "184px",
  className,
}: ScrollableContentProps) {
  return (
    <div
      className={cn(
        "border-gray-100 border border-solid text-caption1r overflow-y-scroll my-24 rounded-lg p-12",
        className
      )}
      style={{ height }}
    >
      {children}
    </div>
  );
} 