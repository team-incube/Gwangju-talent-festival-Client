import { memo } from "react";

export const SloganItem = memo(
  ({ slogan, index }: { slogan: string; index: number }): JSX.Element => (
    <span key={`slogan-${index}`} className="mx-4 inline-block">
      {slogan}
    </span>
  ),
);
SloganItem.displayName = "SloganItem";
