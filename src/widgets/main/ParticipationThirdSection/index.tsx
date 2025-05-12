import Image from "next/image";
import ImageCarousel from "@/entities/home/ui/ImageCarousel";
import { cn } from "@/shared/utils/cn";

const slides = [
  "/images/ParticipationThirdSection/slide1.png",
  "/images/ParticipationThirdSection/slide1.png",
  "/images/ParticipationThirdSection/slide1.png",
];

const ParticipationThirdSection = () => {
  return (
    <section
      id="ParticipationThirdSection"
      className={cn(
        "relative min-h-screen bg-purple-100 overflow-hidden tablet:h-[800px] justify-items-center mobile:min-h-0",
      )}
    >
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
          className={cn(
            "absolute right-[-7%] top-[30%] translate-y-[-50%] w-[40%] aspect-square z-0",
          )}
        >
          <Image src="/images/trophy.png" alt="Trophy" fill />
        </div>
      </div>

      <div
        className={cn(
          "w-[70%] min-h-screen flex flex-col justify-center mobile:w-full gap-[60px] mobile:min-h-0 mobile:gap-[24px]",
        )}
      >
        <div id="apply" className={cn("relative w-full text-center mt-[66px] mobile:mt-[1.7rem]")}>
          <p className={cn("text-title1b mobile:text-body1b")}>참여 신청</p>
          <p
            className={cn(
              "text-body2r text-gray-500 pt-[1.5rem] mobile:text-body3r mobile:pt-[1rem] mb-[24px]",
            )}
          >
            온·오프라인 참여 홍보 및 신청 접수 →
            <span className={cn("inline-block")}>
              {" "}
              1차 영상 심사 및 光트로(예선) 참가팀 선정 →{" "}
            </span>
            <span className={cn("inline-block")}>光트로 참가팀 사전 협의 및 안내</span>
          </p>

          <button
            className={cn(
              "inline-flex items-center text-purple-600 font-bold text-base mobile:text-sm hover:underline group",
            )}
          >
            2025.00.00일부터 신청기간 입니다
          </button>
        </div>
        <ImageCarousel slides={slides} />
      </div>
    </section>
  );
};

export default ParticipationThirdSection;
