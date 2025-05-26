import { cn } from "@/shared/utils/cn";
import { useMemo } from "react";
import React from "react";

interface CountLengthProps {
  children: React.ReactNode;
  length?: number;
  max?: number;
}

const CountLength = ({
  children,
  length = 0,
  max = 100,
}: CountLengthProps) => {
  const countText = useMemo(() => `${length}/${max}`, [length, max]);
  
  return (
    <div className={cn("flex flex-col gap-4")}>
      {children}
      <span className={cn("text-body3r ml-auto text-gray-400")}>
        {countText}
      </span>
    </div>
  );
};

export default React.memo(CountLength);
