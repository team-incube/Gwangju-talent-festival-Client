"use client";

import { cn } from "@/shared/utils/cn";
import { useEffect, useMemo, useState } from "react";

const allSlogans = [
  "너와 나, 우리가 만들어 갈 빛나는 축제 속으로!",
  "미래에 빛이 될 너, 지금 너의 모습을 맘껏 뽐내봐!",
  "언제나 빛나는 나, 너, 우리, 모두 함께 빛나자!",
  "빛나는 재능, 함께 꽃피우는 광탈페",
  "꿈을 향한 순간, 우리는 하나!",
  "펼쳐라 너의 꿈을! 펼쳐라 너의 미래를!",
  "별보다 빛나는 너의 재능 맘껏 펼쳐봐!",
  "꿈꾸라 친구들아, 펼쳐라 광탈페로, 빛나라 우리의 내일",
  "주체할 수 없는 너의 끼! 세상을 바꾸는 힘! 너의 끼를 보여줘!",
  "맘껏 꿈을 펼치는 거야, 바로 지금!",
  "성장할 수록 광이 나는 우리들! 반짝반짝 빛나는 광주의 미래!",
  "빛나는 광주의 미래! 우리들의 재능을 펼쳐라!",
  "꿈과 끼가 넘치는 너! 광탈페로 오라!",
  "꿈을 키울 수 있는 곳! 함께할 수 있는 곳! 광주학생탈렌트페스티벌!",
  "오늘 여기 광주의 주인공은 너야너!",
  "꿈꾸는 너를 위한 무대, 바로 지금이야",
  "열정의 날개를 펼쳐라, 세상의 한계를 넘어!",
];

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
    const [s1, s2] = getRandomSubset(allSlogans, 8);
    const [f1, f2] = getRandomSubset(allFonts, 1);
    setSlogans1(s1);
    setSlogans2(s2);
    setFont1(f1[0]);
    setFont2(f2[0]);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-[#f5e6ff] py-4 space-y-2 relative">
      <MarqueeRow slogans={slogans1} font={font1} colorClass="text-purple-600" />
      <MarqueeRow slogans={slogans2} font={font2} reverse colorClass="text-purple-700" />
    </div>
  );
};

export default SloganMarquee;
