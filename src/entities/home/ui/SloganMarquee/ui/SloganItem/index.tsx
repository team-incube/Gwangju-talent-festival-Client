import React, { memo } from "react";
import { cn } from "@/shared/utils/cn";

export const SloganItem = memo(
  ({ slogan, index }: { slogan: string; index: number }): React.ReactElement => (
    <span key={`slogan-${index}`} className={cn("mx-4 inline-block")}>
      {slogan}
    </span>
  ),
);
SloganItem.displayName = "SloganItem";
