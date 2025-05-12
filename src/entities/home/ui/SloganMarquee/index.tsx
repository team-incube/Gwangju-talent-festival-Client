"use client";

import { cn } from "@/shared/utils/cn";
import { useEffect, useMemo, useState } from "react";
import { slogansMock } from "@/entities/home/mock/sloganMock";

const allFonts = ["Pretendard", "Arial", "NanumSquare", "DungGeunMo", "GmarketSans", "Orbitron"];

function getRandomSubset<T>(arr: T[], count: number): [T[], T[]] {
  const shuffled = arr.map((item, index) => ({ item, index })).sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  const selectedItems = selected.map(({ item }) => item);
  const selectedIndices = new Set(selected.map(({ index }) => index));
  const remaining = arr.filter((_, idx) => !selectedIndices.has(idx));
  return [selectedItems, remaining];
}

const renderSlogans = (slogans: string[]) =>
  slogans.map((slogan, index) => (
    <span key={index} className="mx-4 inline-block">
      {slogan}
    </span>
  ));

const MarqueeRow = ({
  slogans,
  font,
  reverse,
  colorClass,
}: {
  slogans: string[];
  font: string;
  reverse?: boolean;
  colorClass: string;
}) => {
  const rendered = useMemo(() => renderSlogans(slogans), [slogans]);

  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <div
        className={cn(
          "flex w-[200%] text-[24px] font-bold",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          colorClass,
        )}
        style={{ fontFamily: `${font}, sans-serif` }}
      >
        {rendered}
        {rendered}
      </div>
    </div>
  );
};

const SloganMarquee = () => {
  const [slogans1, setSlogans1] = useState<string[]>([]);
  const [slogans2, setSlogans2] = useState<string[]>([]);
  const [font1, setFont1] = useState<string>("Pretendard");
  const [font2, setFont2] = useState<string>("Arial");

  useEffect(() => {
    const [s1, s2] = getRandomSubset(slogansMock, 8);
    const [f1, f2] = getRandomSubset(allFonts, 1);
    setSlogans1(s1);
    setSlogans2(s2);
    setFont1(f1[0]);
    setFont2(f2[0]);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-main-100 py-28 space-y-10 relative">
      <MarqueeRow slogans={slogans1} font={font1} colorClass="text-main-600" />
      <MarqueeRow slogans={slogans2} font={font2} reverse colorClass="text-main-500" />
    </div>
  );
};

export default SloganMarquee;
