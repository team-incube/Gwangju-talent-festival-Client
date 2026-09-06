"use client";

import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import YouTubeLazyEmbed from "@/shared/ui/YouTubeLazyEmbed";

const FINALS_LIVE_VIDEO_ID = "lfg5purSCOI";
const FINALS_LABEL = "2026. 9. 5(토) 光탈페 본선 다시보기";

const FinalsVenueSection = () => {
  return (
    <section className={cn("flex flex-col items-center")}>
      <div className={cn("w-[70%] mobile:w-full mobile:px-16")}>
        <SectionTitle
          title="2026 광탈페 본선 다시보기"
          className={cn("mt-66 mobile:mt-[1.7rem] mb-40 mobile:mb-24")}
        />

        <div className="mb-90 mobile:mb-38 flex flex-col gap-8">
          <span className="text-body3b mobile:text-caption1b text-black">{FINALS_LABEL}</span>
          <YouTubeLazyEmbed videoId={FINALS_LIVE_VIDEO_ID} title={FINALS_LABEL} />
        </div>
      </div>
    </section>
  );
};

export default FinalsVenueSection;
