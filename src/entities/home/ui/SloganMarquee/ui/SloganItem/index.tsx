import React, { memo } from "react";

export const SloganItem = memo(
  ({ slogan, index }: { slogan: string; index: number }): React.ReactElement => (
    <span key={`slogan-${index}`} className="mx-4 inline-block">
      {slogan}
    </span>
  ),
);
SloganItem.displayName = "SloganItem";
