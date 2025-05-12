import React from "react";
import { useRouter } from "next/navigation";
import PrizeItem from "@/entities/home/ui/PrizeItem";
import SloganMarquee from "@/entities/home/ui/SloganMarquee";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";

const SloganSecondSection = () => {
  const R = useRouter();
  const prizes = [
    { rank: "2등", bg: "bg-gray-400", emoji: "🍗", desc: "치킨 세트" },
    { rank: "1등", bg: "bg-yellow-300", emoji: "🎁", desc: "수상자 해당 학습 간식" },
    { rank: "3등", bg: "bg-orange-700", emoji: "🍔", desc: "햄버거 세트" },
  ];

  return (
    <section id="SloganSecondSection" className={cn("w-full text-center")}>
      <p className={cn("text-title1b pt-[4.7rem] mobile:text-body1b mobile:pt-[1.7rem]")}>
        슬로건 공모
      </p>
      <p
        className={cn(
          "text-body1r pt-[1.5rem] text-gray-500 mobile:text-body3r mobile:pt-[1rem] mb-[28px]",
        )}
      >
        <span className={cn("block")}>2025 광탈페(광주학생탈렌트페스티벌),</span>
        <span className={cn("inline-block")}>
          <span className={cn("inline-block")}>
            참여자가 직접 만든 슬로건으로 학생이 주인공이 되는{"\u00A0"}
          </span>
          <span className={cn("inline-block")}>오디션 프로그램의 가치를 높이고{"\u00A0"}</span>
        </span>
        <span className={cn("inline-block")}>광탈페에 대한 이해와 관심을 더욱 끌어올립니다!</span>
      </p>

      <SloganMarquee />

      <div className={cn("flex flex-col items-center p-6 bg-white my-[28px]")}>
        <div className={cn("flex justify-center gap-[40px]")}>
          {prizes.map(prize => (
            <PrizeItem key={prize.rank} {...prize} />
          ))}
        </div>

        <Button onClick={() => R.push("/slogan")} className={cn("my-[24px] gap-10 px-28")}>
          <span className={cn("text-body2b")}>슬로건 공모하러가기</span>
          <span>➔</span>
        </Button>

        <div className={cn("text-caption1r text-gray-400")}>공모기간 : 2025.04.27~2025.04.30</div>
      </div>
    </section>
  );
};

export default SloganSecondSection;
