import ImageCarousel from "@/entities/home/ui/ImageCarousel";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";

const SLIDES_1 = [
  "/images/Preliminary/slide1_1.jpg",
  "/images/Preliminary/slide1_2.jpg",
  "/images/Preliminary/slide1_3.jpg",
];

const SLIDES_2 = [
  "/images/Preliminary/slide2_1.jpg",
  "/images/Preliminary/slide2_2.jpg",
  "/images/Preliminary/slide2_3.jpg",
];

const PreliminaryFourthSection = () => {
  return (
    <section id="PreliminaryFourthSection" className={cn("flex flex-col items-center")}>
      <div className={cn("w-[70%] mobile:w-full")}>
        <SectionTitle
          title="예선"
          description=""
          className={cn("mt-[66px] mobile:mt-[1.7rem] mb-[24px]")}
        />

        <div
          className={cn(
            "flex w-full items-start justify-between mb-[90px] mobile:flex-col mobile:mb-[38px]",
          )}
        >
          <div className={cn("w-[25%] mobile:w-full mobile:px-16")}>
            <p className={cn("text-title4b mobile:text-body2b place-self-start mb-24")}>
              1차 영상 심사
            </p>
            <p className={cn("text-body2r text-gray-500 mobile:text-body3r mobile:py-[1rem]")}>
              신청서 내용과 제출영상을 바탕으로 전문위원 심사를 거쳐 예선전(光트로) 심사출연자를
              확정합니다.
            </p>
          </div>
          <div className={cn("w-[70%] mobile:w-full")}>
            <ImageCarousel wide={true} slides={SLIDES_1} />
          </div>
        </div>
        <div className={cn("flex w-full items-start justify-between mobile:flex-col-reverse")}>
          <div className={cn("w-[70%] mobile:w-full")}>
            <ImageCarousel wide={true} slides={SLIDES_2} />
          </div>
          <div className={cn("w-[25%] mobile:w-full mobile:px-16")}>
            <p className={cn("text-title4b mobile:text-body2b place-self-start mb-24")}>
              2차 예선(光트로)
            </p>
            <button
              className={cn(
                "inline-flex items-center text-main-600 font-bold text-body2b mobile:text-sm hover:underline group",
              )}
            >
              2025. 7. 25(금)~26.(토) 광주광역시교육청학생교육문화회관{" "}
            </button>
            <p className={cn("text-body2r text-gray-500 mobile:text-body3r mobile:py-[1rem]")}>
              1차 영상심사를 통과한 참가자들이 직접 무대에서 경연을 펼치게 됩니다. 전문 심사위원의
              심사를 거쳐 본선 진출자를 확정하게 됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreliminaryFourthSection;
