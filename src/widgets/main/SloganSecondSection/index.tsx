import React from "react";
import { useRouter } from "next/navigation";
import PrizeItem from "@/entities/home/ui/PrizeItem";
import SloganMarquee from "@/entities/home/ui/SloganMarquee";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { formatDate } from "@/shared/utils/formatDate";

const PRIZES = [
  { rank: "2등", bg: "bg-gray-400", emoji: "🍗", desc: "치킨 세트" },
  { rank: "1등", bg: "bg-yellow-300", emoji: "🎁", desc: "수상자 해당 학급 간식" },
  { rank: "3등", bg: "bg-orange-700", emoji: "🍔", desc: "햄버거 세트" },
];

const SLOGAN_START = new Date("2025-05-26T00:00:00+09:00");
const SLOGAN_END = new Date("2025-05-30T17:59:59+09:00");

const SloganSecondSection = () => {
  const R = useRouter();

  const isSloganPeriod = React.useMemo(() => {
    const now = new Date();
    return now >= SLOGAN_START && now <= SLOGAN_END;
  }, []);

  const submissionPeriodText = React.useMemo(() => {
    const startText = formatDate(SLOGAN_START);
    const endText = formatDate(SLOGAN_END);
    return `공모기간 : 2025.${startText}~${endText} 18:00까지`;
  }, []);

  return (
    <section id="SloganSecondSection" className={cn("w-full mt-[3.5rem] mobile:mt-20 text-center")}>
      <SectionTitle
        title="슬로건 공모"
        description={
          <>
            <span className={cn("block")}>2025 광탈페(광주학생탈렌트페스티벌),</span>
            <span className={cn("inline-block")}>
              참여자가 직접 만든 슬로건으로 학생이 주인공이 되는 오디션 프로그램의 가치를 높이고
              광탈페에 대한 이해와 관심을 더욱 끌어올립니다!
            </span>
          </>
        }
      />

      <SloganMarquee />

      <div className={cn("flex flex-col items-center p-6 bg-white my-30")}>
        <div className={cn("flex justify-center gap-[40px]")}>
          {PRIZES.map(prize => (
            <PrizeItem key={prize.rank} {...prize} />
          ))}
        </div>

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
          {submissionPeriodText} <br />
          <p className="text-main-600">
            광탈페 슬로건 공모 접수가 마감되었습니다. <br />
            결과발표는 6월중으로 개별안내 및 별도공지됩니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SloganSecondSection;
