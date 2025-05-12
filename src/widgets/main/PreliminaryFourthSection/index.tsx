import ImageCarousel from "../../../entities/home/ui/ImageCarousel";
import { cn } from "@/shared/utils/cn";

const slides = [
  "/images/ParticipationThirdSection/slide1.png",
  "/images/ParticipationThirdSection/slide1.png",
  "/images/ParticipationThirdSection/slide1.png",
  "/images/ParticipationThirdSection/slide1.png",
];

const PreliminaryFourthSection = () => {
  return (
    <section id="PreliminaryFourthSection" className={cn("flex flex-col items-center")}>
      <div className={cn("w-[70%] mobile:w-full")}>
        <div className={cn("relative w-full text-center mt-[66px] mobile:mt-[1.7rem]")}>
          <p className={cn("text-title1b mobile:text-body1b")}>예선</p>
          <p
            className={cn(
              "text-body2r text-gray-500 pt-[1.5rem] mobile:text-body3r mobile:pt-[1rem] mb-[24px]",
            )}
          >
            예선 설명 예선 설명
          </p>
        </div>
        <div
          className={cn(
            "flex w-full items-start justify-between mb-[90px] mobile:flex-col mobile:mb-[38px]",
          )}
        >
          <div className={cn("w-[25%] mobile:w-full mobile:px-16")}>
            <p className={cn("text-title4b mobile:text-body2b place-self-start mb-24")}>1차 예선</p>
            <p className={cn("text-body2r text-gray-500 mobile:text-body3r mobile:py-[1rem]")}>
              ※ 영상 재생 오류 및 링크 형태(유튜브, 드라이브 등)의 영상 제출 시 신청 대상에서 제외 ※
              전체 영상이 3분 초과일 경우 3분 내외의 심사용 영상에 적합한 구간으로 편집하여 제출{" "}
            </p>
          </div>
          <div className={cn("w-[70%] mobile:w-full")}>
            <ImageCarousel wide={true} slides={slides} />
          </div>
        </div>
        <div className={cn("flex w-full items-start justify-between mobile:flex-col-reverse")}>
          <div className={cn("w-[70%] mobile:w-full")}>
            <ImageCarousel wide={true} slides={slides} />
          </div>
          <div className={cn("w-[25%] mobile:w-full mobile:px-16")}>
            <p className={cn("text-title4b mobile:text-body2b place-self-start mb-24")}>2차 예선</p>
            <p className={cn("text-body2r text-gray-500 mobile:text-body3r mobile:py-[1rem]")}>
              심사 기준: 예술적 기능 및 역량(테크닉), 무대 구성 및 완성도, 무대에서의 끼와 표현력,
              무대 장악력 등
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PreliminaryFourthSection;
