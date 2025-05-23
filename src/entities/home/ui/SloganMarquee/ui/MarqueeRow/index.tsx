import React, { memo, useMemo } from "react";
import { FontType } from "../../model/fonts";
import { SloganItem } from "../SloganItem";
import { cn } from "@/shared/utils/cn";

type MarqueeRowProps = Readonly<{
  slogans: ReadonlyArray<string>;
  fonts: ReadonlyArray<FontType>;
  reverse?: boolean;
  color?: "text-main-500" | "text-main-600";
}>;

export const MarqueeRow = memo(
  ({
    slogans,
    fonts,
    reverse = false,
    color = "text-main-600",
  }: MarqueeRowProps): React.ReactElement => {
    const rendered = useMemo(
      () =>
        slogans.map((slogan, index) => (
          <SloganItem 
            key={`${slogan}-${index}`} 
            slogan={slogan} 
            index={index} 
            font={fonts[index % fonts.length]} 
          />
        )),
      [slogans, fonts],
    );

    return (
      <div className={cn("w-full overflow-hidden whitespace-nowrap")}>
        <div
          className={cn(
            "flex w-[200%] text-[24px] font-bold mobile:text-[13px]",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
            color,
          )}
          aria-live="off"
        >
          {rendered}
          {rendered}
        </div>
      </div>
    );
  },
);
MarqueeRow.displayName = "MarqueeRow";
