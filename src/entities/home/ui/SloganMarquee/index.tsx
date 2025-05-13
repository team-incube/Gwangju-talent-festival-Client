"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { slogansMock } from "@/entities/home/mock/sloganMock";
import { getRandomSubset } from "./utils/getRandomSubset";
import { FONTS, FontType } from "./model/fonts";
import { MarqueeRow } from "./ui/MarqueeRow";

const SloganMarquee = (): React.ReactElement => {
  const [slogans1, setSlogans1] = useState<ReadonlyArray<string>>([]);
  const [slogans2, setSlogans2] = useState<ReadonlyArray<string>>([]);
  const [font1, setFont1] = useState<FontType>("Pretendard");
  const [font2, setFont2] = useState<FontType>("Arial");

  const initializeSlogans = useCallback(() => {
    try {
      const [selectedSlogans1, selectedSlogans2] = getRandomSubset(slogansMock, 8);
      const [selectedFonts1, selectedFonts2] = getRandomSubset(FONTS, 1);

      setSlogans1(selectedSlogans1);
      setSlogans2(selectedSlogans2);
      setFont1(selectedFonts1[0]);
      setFont2(selectedFonts2[0]);
    } catch {
      setSlogans1(slogansMock.slice(0, 4));
      setSlogans2(slogansMock.slice(4, 8));
    }
  }, []);

  useEffect(() => {
    initializeSlogans();
  }, [initializeSlogans]);

  return (
    <section className="w-full overflow-hidden bg-main-100 py-28 space-y-10 relative">
      <MarqueeRow slogans={slogans1} font={font1} color="text-main-600" />
      <MarqueeRow slogans={slogans2} font={font2} reverse={true} color="text-main-500" />
    </section>
  );
};

export default memo(SloganMarquee);
