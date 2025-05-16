import Image from "next/image";
import ImageCarousel from "@/entities/home/ui/ImageCarousel";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";

const SLIDES = [
  "/images/ParticipationThirdSection/slide1.png",
  "/images/ParticipationThirdSection/slide1.png",
  "/images/ParticipationThirdSection/slide1.png",
];

const BackgroundImages = () => (
  <div className={cn("mobile:hidden z-0")}>
    <div className={cn("absolute left-[1%] top-0 h-full w-[24%]")}>
      <Image src="/images/starline.png" alt="Star Line" fill />
    </div>
    <div className={cn("absolute right-[4%] top-0 h-full w-[24%]")}>
      <Image src="/images/trophyline.png" alt="Trophy Line" fill />
    </div>
    <div
      className={cn(
        "absolute left-[-10%] top-[55%] translate-y-[-50%] w-[40%] aspect-square tablet:left-0",
      )}
    >
      <Image src="/images/star.png" alt="Star" fill />
    </div>
    <div
      className={cn("absolute right-[-7%] top-[30%] translate-y-[-50%] w-[40%] aspect-square z-0")}
    >
      <Image src="/images/trophy.png" alt="Trophy" fill />
    </div>
  </div>
);

const ParticipationThirdSection = () => {
  return (
    <section
      id="ParticipationThirdSection"
      className={cn(
        "relative min-h-screen bg-purple-100 overflow-hidden tablet:h-[800px] justify-items-center mobile:min-h-0",
      )}
    >
      <BackgroundImages />

      <div
        className={cn(
          "w-[70%] min-h-screen flex flex-col justify-center mobile:w-full gap-[60px] mobile:min-h-0 mobile:gap-[24px]",
        )}
      >
        <div id="apply" className={cn("relative w-full text-center mt-[66px] mobile:mt-[1.7rem]")}>
          <SectionTitle
            title="참여 신청"
            description={
              <>
                온·오프라인 참여 홍보 및 신청 접수 →
                <span className={cn("inline-block")}>
                  {" "}
                  1차 영상 심사 및 光트로(예선) 참가팀 선정 →{" "}
                </span>
                <span className={cn("inline-block")}>光트로 참가팀 사전 협의 및 안내</span>
              </>
            }
          />

          <button
            className={cn(
              "inline-flex items-center text-main-600 font-bold text-body2b mobile:text-sm hover:underline group",
            )}
          >
            2025.00.00일부터 신청기간 입니다
          </button>
        </div>
        <ImageCarousel slides={SLIDES} />
      </div>
    </section>
  );
};

export default ParticipationThirdSection;
