import React, { memo, useMemo } from "react";
import { FontType } from "../../model/fonts";
import { SloganItem } from "../SloganItem";
import { cn } from "@/shared/utils/cn";

type MarqueeRowProps = Readonly<{
  slogans: ReadonlyArray<string>;
  font: FontType;
  reverse?: boolean;
  color?: "text-main-500" | "text-main-600";
}>;

export const MarqueeRow = memo(
  ({
    slogans,
    font,
    reverse = false,
    color = "text-main-600",
  }: MarqueeRowProps): React.ReactElement => {
    const rendered = useMemo(
      () =>
        slogans.map((slogan, index) => (
          <SloganItem key={`${slogan}-${index}`} slogan={slogan} index={index} />
        )),
      [slogans],
    );

    return (
      <div className="w-full overflow-hidden whitespace-nowrap">
        <div
          className={cn(
            "flex w-[200%] text-[24px] font-bold",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
            color,
          )}
          style={{ fontFamily: `${font}, sans-serif` }}
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
