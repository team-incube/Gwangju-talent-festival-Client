import Image from "next/image";
import ImageCarousel from "@/entities/home/ui/ImageCarousel";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import React from "react";
import { formatDate } from "@/shared/utils/formatDate";

const SLIDES = [
  "/images/Participation/slide1.jpg",
  "/images/Participation/slide2.jpg",
  "/images/Participation/slide3.jpg",
  "/images/Participation/slide4.jpg",
  "/images/Participation/slide5.jpg",
];

const SUBMISSION_START = new Date('2025-06-16T00:00:00+09:00');
const SUBMISSION_END = new Date('2025-06-19T22:00:00+09:00');

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
  const isSubmissionPeriod =
    new Date() >= SUBMISSION_START && new Date() <= SUBMISSION_END;

  return (
    <section
      id="ParticipationThirdSection"
      className={cn(
        "relative h-[900px] bg-main-100 overflow-hidden tablet:h-[800px] justify-items-center mobile:h-[32rem]",
      )}
    >
      <BackgroundImages />

      <div
        className={cn(
          "w-[70%] h-full flex flex-col justify-center mobile:w-full gap-[60px] mobile:gap-[24px]",
        )}
      >
        <div id="apply" className={cn("relative text-center mt-20 mobile:mt-[1.7rem]")}>
          <SectionTitle
            title="참여 신청"
            description={
              <>
                댄스, 보컬, 밴드, 연주, 실용음악 분야에 재능있는 분(팀)의 신청을 받습니다.
                <span className={cn("inline-block")}>
                  {" "}
                  (신청서 작성 및 영상제출 → 1차 영상 심사 → 예선(光트로))
                </span>
              </>
            }
          />

          <button
            className={cn(
              "inline-flex items-center font-bold text-body2b mobile:text-sm group",
              isSubmissionPeriod 
                ? "text-main-600 hover:underline cursor-pointer"
                : "text-gray-600 cursor-not-allowed"
            )}
          >
            {isSubmissionPeriod 
              ? `신청하러 가기 (${formatDate(SUBMISSION_START)} ~ ${formatDate(SUBMISSION_END)})`
              : `${formatDate(SUBMISSION_START)}부터 신청할 수 있습니다.`
            }
          </button>
        </div>
        <ImageCarousel slides={SLIDES} />
      </div>
    </section>
  );
};

export default ParticipationThirdSection;
