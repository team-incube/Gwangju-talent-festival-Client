import { cn } from "@/shared/utils/cn";
import { Map } from "@/entities/home/ui/Map";
import { SectionTitle } from "@/shared/ui/SectionTitle";

const FinalsSixthSection = () => {
  return (
    <section id="FinalsSixthSection" className={cn("flex flex-col items-center my-20")}>
      <div className={cn("w-[70%] mobile:w-full mobile:px-16")}>
        <SectionTitle
          title="본선"
          description="光트로(예선)을 거쳐 선정된 참가팀이 서로의 무대를 즐기며 재능과 끼를 맘껏 펼치고 서로 나누는 축제의 시간입니다.
"
          className={cn("mt-[66px] mobile:mt-[1.7rem]")}
        />

        <div className={cn("mt-[5rem] mobile:mt-20")}>
          <p className={cn("text-title4b mobile:text-body3b place-self-start mb-24 mobile:mb-0")}>오시는 길</p>
          <p className={cn("text-body2r text-gray-500 mobile:text-caption2r mobile:py-8")}>
            대상: 光트로(예선) 합격팀
            <br />∙ 2025.9.27.(토) 조선대학교 해오름관
          </p>
          <Map
            address="광주광역시 동구 필문대로 309 조선대학교 해오름관"
            className={cn("h-[300px]")}
          />
        </div>
      </div>
    </section>
  );
};

export default FinalsSixthSection;
