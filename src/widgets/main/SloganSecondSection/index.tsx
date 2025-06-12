import React from "react";
// import { useRouter } from "next/navigation";
import PrizeItem from "@/entities/home/ui/PrizeItem";
import SloganMarquee from "@/entities/home/ui/SloganMarquee";
// import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";
// import { formatDate } from "@/shared/utils/formatDate";

const PRIZES = [
  {
    rank: "2등",
    bg: "bg-gray-400",
    emoji: "광주SW마이스터고 2학년 ",
    desc: "허O서",
    slogan: '"광주의 빛나는, 또 빛날 별들의 향연"',
  },
  {
    rank: "1등",
    bg: "bg-yellow-300",
    emoji: "전대사대부고 2학년 ",
    desc: "김O은",
    slogan: '"세상의 무대 위, 광탈페! 너의 꿈이 시작되는 순간!"',
  },
  {
    rank: "3등",
    bg: "bg-orange-700",
    emoji: "빛고을고 2학년 ",
    desc: "최O원",
    slogan: '"재능이 피어나는 시간, 가능성이 자라는 무대"',
  },
];

// const SLOGAN_START = new Date("2025-05-26T00:00:00+09:00");
// const SLOGAN_END = new Date("2025-05-30T17:59:59+09:00");

const SloganSecondSection = () => {
  // const R = useRouter();

  // const isSloganPeriod = React.useMemo(() => {
  //   const now = new Date();
  //   return now >= SLOGAN_START && now <= SLOGAN_END;
  // }, []);

  // const submissionPeriodText = React.useMemo(() => {
  //   const startText = formatDate(SLOGAN_START);
  //   const endText = formatDate(SLOGAN_END);
  //   return `공모기간 : 2025.${startText}~${endText} 18:00까지`;
  // }, []);

  return (
    <section id="SloganSecondSection" className={cn("w-full mt-[3.5rem] mobile:mt-20 text-center")}>
      <SectionTitle
        title="2025 광탈페 슬로건"
        description={
          <>
            <h3 className="text-black text-body2b">
              세상의 무대 위, 광탈페! 너의 꿈이 시작되는 순간!
            </h3>
            <span className={cn("block")}>
              2025년 모두가 주인공이 되는 광주학생탈렌트페스티벌의 꿈의 무대가 펼쳐집니다.
            </span>
          </>
        }
      />

      <SloganMarquee />

      <div className={cn("flex flex-col items-center p-6 bg-white my-30")}>
        <div className={cn("flex flex-col items-center gap-[40px]")}>
          <div className="flex justify-center">
            <PrizeItem key={PRIZES[1].rank} {...PRIZES[1]} />
          </div>
          <div className="flex justify-center gap-[40px]">
            <PrizeItem key={PRIZES[0].rank} {...PRIZES[0]} />
            <PrizeItem key={PRIZES[2].rank} {...PRIZES[2]} />
          </div>
        </div>
        {/* 
        <Button
          onClick={() => R.push("/slogan")}
          className={cn("my-[24px] mobile:mb-[12px] px-28")}
          isDisabled={!isSloganPeriod}
        >
          <span className={cn("text-body2b mobile:text-body3b flex items-center gap-10")}>
            {isSloganPeriod ? "슬로건 공모하러가기" : "공모기간이 아닙니다"} <span>➔</span>
          </span>
        </Button>

        <div className={cn("text-caption1r mobile:text-caption2r text-gray-400")}>
          {submissionPeriodText}
        </div> */}
      </div>
    </section>
  );
};

export default SloganSecondSection;
