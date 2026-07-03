// import ImageCarousel from "@/entities/home/ui/ImageCarousel";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import YouTubeLazyEmbed from "@/shared/ui/YouTubeLazyEmbed";

// const SLIDES_1 = [
//   "/images/Preliminary/slide1_1.jpg",
//   "/images/Preliminary/slide1_2.jpg",
//   "/images/Preliminary/slide1_3.jpg",
// ];

// const SLIDES_2 = [
//   "/images/Preliminary/slide2_1.jpg",
//   "/images/Preliminary/slide2_2.jpg",
//   "/images/Preliminary/slide2_3.jpg",
// ];

const PRELIMINARY_VIDEOS = [
  { title: "2025. 7. 25(금) 光트로 예선1 다시보기", videoId: "KbnIFWzWU2Y" },
  { title: "2025. 7. 26(토) 光트로 예선2 다시보기", videoId: "n1o5Q2AVs88" },
] as const;

const PreliminaryFourthSection = () => {
  return (
    <section className={cn("flex flex-col items-center")}>
      <div className={cn("w-[70%] mobile:w-full")}>
        <SectionTitle
          title="2025 광탈페 예선 다시보기"
          className={cn("mt-66 mobile:mt-[1.7rem] mb-24")}
        />

        <div className={cn("flex w-full gap-10 mobile:flex-col")}>
          {PRELIMINARY_VIDEOS.map(({ title, videoId }) => (
            <div
              key={videoId}
              className={cn(
                "flex w-full flex-col items-start gap-10 justify-between mb-90 mobile:mb-38 mobile:px-16",
              )}
            >
              <h3
                className={cn(
                  "text-body2b mobile:text-body3b place-self-start mb-8 mobile:mb-0",
                )}
              >
                {title}
              </h3>
              <div className={cn("w-full mobile:mt-16")}>
                <YouTubeLazyEmbed videoId={videoId} title={title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreliminaryFourthSection;
