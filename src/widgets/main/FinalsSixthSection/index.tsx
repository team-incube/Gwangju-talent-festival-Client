import { cn } from "@/shared/utils/cn";
import { Map } from "@/entities/home/ui/Map";
import { SectionTitle } from "@/shared/ui/SectionTitle";

const FinalsSixthSection = () => {
  return (
    <section id="FinalsSixthSection" className={cn("flex flex-col items-center")}>
      <div className={cn("w-[70%] mobile:w-full mobile:px-16")}>
        <SectionTitle
          title="본선"
          description="光탈페(본선) 입상팀 중 경연을 통해 선정된 우수팀을 대상으로 별도 심사과정을 거쳐 선발된
            학생들에게 「2025 학생 글로벌 리더 세계 한 바퀴 프로그램(光탈페)」 참여 혜택 제공 및
            진로 체험 기회 확대를 통한 전공 심화 역량 강화"
          className={cn("mt-[66px] mobile:mt-[1.7rem]")}
        />

        <div>
          <p className={cn("text-title4b mobile:text-body2b place-self-start mb-24")}>오시는 길</p>
          <p className={cn("text-body2r text-gray-500 mobile:text-body3r mobile:py-[1rem]")}>
            대상: 光트로(예선) 합격팀
            <br />∙ 2025. 8. 8.(금) 15:00, 광주학생예술누리터 꿈이룸관(예정)
          </p>
          <Map />
        </div>
      </div>
    </section>
  );
};

export default FinalsSixthSection;
