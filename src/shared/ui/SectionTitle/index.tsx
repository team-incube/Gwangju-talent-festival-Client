import { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface SectionTitleProps {
  title: string;
  description?: ReactNode;
  className?: string;
}

export const SectionTitle = ({ title, description, className }: SectionTitleProps) => {
  return (
    <div className={cn("w-full text-center", className)}>
      <p className={cn("text-title1b mobile:text-body1b")}>{title}</p>
      {description && (
        <p
          className={cn(
            "text-body2r text-gray-500 pt-[1.5rem] mobile:text-body3r mobile:pt-[1rem] mb-[24px]",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};
