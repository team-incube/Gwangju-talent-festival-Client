"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { slogansMock } from "@/entities/home/mock/sloganMock";
import { getRandomSubset } from "./utils/getRandomSubset";
import { FONTS, FontType } from "./model/fonts";
import { MarqueeRow } from "./ui/MarqueeRow";

const getRandomFonts = (count: number): FontType[] => {
  const shuffledFonts = [...FONTS].sort(() => Math.random() - 0.5);
  return shuffledFonts.slice(0, count);
};

const SloganMarquee = (): React.ReactElement => {
  const [slogans1, setSlogans1] = useState<ReadonlyArray<string>>([]);
  const [slogans2, setSlogans2] = useState<ReadonlyArray<string>>([]);
  const [fonts1, setFonts1] = useState<ReadonlyArray<FontType>>([]);
  const [fonts2, setFonts2] = useState<ReadonlyArray<FontType>>([]);

  const initializeSlogans = useCallback(() => {
    try {
      const [selectedSlogans1, selectedSlogans2] = getRandomSubset(slogansMock, 8);
      
      setSlogans1(selectedSlogans1);
      setSlogans2(selectedSlogans2);
      
      const randomFonts1 = getRandomFonts(selectedSlogans1.length);
      const remainingFonts = FONTS.filter(font => !randomFonts1.includes(font));
      const randomFonts2 = [...remainingFonts]
        .sort(() => Math.random() - 0.5)
        .slice(0, selectedSlogans2.length);
      
      setFonts1(randomFonts1);
      setFonts2(randomFonts2);
    } catch {
      const defaultSlogans1 = slogansMock.slice(0, 4);
      const defaultSlogans2 = slogansMock.slice(4, 8);
      setSlogans1(defaultSlogans1);
      setSlogans2(defaultSlogans2);
      
      const fallbackFonts1 = getRandomFonts(defaultSlogans1.length);
      const fallbackRemainingFonts = FONTS.filter(font => !fallbackFonts1.includes(font));
      const fallbackFonts2 = [...fallbackRemainingFonts]
        .sort(() => Math.random() - 0.5)
        .slice(0, defaultSlogans2.length);
      
      setFonts1(fallbackFonts1);
      setFonts2(fallbackFonts2);
    }
  }, []);

  useEffect(() => {
    initializeSlogans();
  }, [initializeSlogans]);

  return (
    <section className="w-full overflow-hidden bg-main-100 py-28 space-y-10 relative">
      <MarqueeRow slogans={slogans1} fonts={fonts1} color="text-main-600" />
      <MarqueeRow slogans={slogans2} fonts={fonts2} reverse={true} color="text-main-500" />
    </section>
  );
};

export default memo(SloganMarquee);
