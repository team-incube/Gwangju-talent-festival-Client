import React from "react";
import { useRouter } from "next/navigation";
import SloganMarquee from "@/widgets/main/SloganSecondSection/ui/SloganMarquee";

const SloganSecondSection = () => {
  const R = useRouter();
  const prizes = [
    { rank: "2등", bg: "bg-gray-400", emoji: "🍗", desc: "치킨 세트" },
    { rank: "1등", bg: "bg-yellow-300", emoji: "🎁", desc: "수상자 해당 학습 간식" },
    { rank: "3등", bg: "bg-orange-700", emoji: "🍔", desc: "햄버거 세트" },
  ];

  return (
    <div id="slogan" className="w-full   text-center ">
      <p className="text-title1b pt-[4.7rem] mobile:text-body1b mobile:pt-[1.7rem]">슬로건 공모</p>
      <p className="text-body1r pt-[1.5rem] text-gray-500 mobile:text-body3r mobile:pt-[1rem] mb-[24px]">
        <span className="block">2025 광탈페(광주학생탈렌트페스티벌),</span>
        <span className="inline-block">
          <span className="inline-block">
            참여자가 직접 만든 슬로건으로 학생이 주인공이 되는{"\u00A0"}
          </span>
          <span className="inline-block">오디션 프로그램의 가치를 높이고{"\u00A0"}</span>
        </span>
        <span className="inline-block">광탈페에 대한 이해와 관심을 더욱 끌어올립니다!</span>
      </p>

      <SloganMarquee />

      <div className="flex flex-col items-center p-6 bg-white my-[24px]">
        <div className="flex justify-center gap-[40px]">
          {prizes.map(({ rank, bg, emoji, desc }) => (
            <div key={rank} className="flex flex-col items-center gap-[16px]">
              <div
                className={`w-[60px] h-[60px] flex justify-center items-center rounded-full text-white text-body1r ${bg}`}
              >
                {rank}
              </div>
              <div className="text-lg font-semibold">
                {emoji} {desc}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => R.push("/slogan")}
          className="bg-purple-500 text-white font-semibold rounded-xl px-6 py-3 text-base flex items-center gap-2 my-[24px]"
        >
          <span>슬로건 공모하러가기</span>
          <span className="text-lg">➔</span>
        </button>

        <div className="text-sm text-gray-400">공모기간 : 2025.04.27~2025.04.30</div>
      </div>
    </div>
  );
};

export default SloganSecondSection;
