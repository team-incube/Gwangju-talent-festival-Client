"use client";

import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import YouTubeLazyEmbed from "@/shared/ui/YouTubeLazyEmbed";

const LIVE_STREAMS = [
  { label: "2026. 7. 24(금) 光트로 예선1 다시보기", videoId: "nL0pdTRB6Hc" },
  { label: "2026. 7. 25(토) 光트로 예선2 다시보기", videoId: "518wlDEojOs" },
] as const;

const PreliminaryLiveSection = () => {
  return (
    <section className={cn("relative w-full overflow-hidden bg-white py-[80px] mobile:py-[52px]")}>
      {/* 블러 원 데코 */}
      <div
        className="absolute top-[-60px] left-[-80px] w-[320px] h-[320px] rounded-full bg-orange-300 opacity-60 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-60px] right-[-80px] w-[280px] h-[280px] rounded-full bg-orange-400 opacity-50 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-[70%] mobile:w-full flex-col gap-40 mobile:gap-28 px-16">
        <SectionTitle title="2026 광탈페 예선 다시보기" />

        <div className="flex flex-col gap-16">
          <div className="flex gap-16 mobile:flex-col">
            {LIVE_STREAMS.map(({ label, videoId }) => (
              <div key={videoId} className="flex flex-1 flex-col gap-8">
                <span className="text-body3b mobile:text-caption1b text-black">{label}</span>
                <YouTubeLazyEmbed videoId={videoId} title={label} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreliminaryLiveSection;
