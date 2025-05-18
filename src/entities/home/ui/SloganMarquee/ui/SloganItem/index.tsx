import React, { memo } from "react";
import { cn } from "@/shared/utils/cn";
import { FontType } from "../../model/fonts";

type SloganItemProps = {
  slogan: string;
  index: number;
  font: FontType;
};

export const SloganItem = memo(
  ({ slogan, index, font }: SloganItemProps): React.ReactElement => (
    <span 
      key={`slogan-${index}`} 
      className={cn("mx-16 mobile:mx-8 inline-block")}
      style={{ fontFamily: `${font}, sans-serif` }}
    >
      {slogan}
    </span>
  ),
);
SloganItem.displayName = "SloganItem";
