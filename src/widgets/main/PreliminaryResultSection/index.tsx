"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import YouTubeLazyEmbed from "@/shared/ui/YouTubeLazyEmbed";
import { isPreliminaryResultOpen } from "@/shared/config/dateConfig";

const LIVE_STREAMS = [
  { date: "7월 24일 (금) 1일차", videoId: "nL0pdTRB6Hc" },
  { date: "7월 25일 (토) 2일차", videoId: "eR3Tx134-dU" },
] as const;

const PreliminaryResultSection = () => {
  const isOpen = isPreliminaryResultOpen();

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
        <SectionTitle
          title="2026 광탈페 光트로 예선"
          description={<>7월 24일(금)·25일(토), 광주학생교육문화회관에서 열립니다</>}
        />

        <div className="flex flex-col gap-16">
          <h3 className="text-body2b mobile:text-body3b text-black">실시간 중계</h3>
          <div className="flex gap-20 mobile:flex-col mobile:gap-16">
            {LIVE_STREAMS.map(({ date, videoId }) => (
              <div key={videoId} className="flex flex-1 flex-col gap-8">
                <span className="w-fit rounded-full bg-orange-500 px-16 py-6 text-caption1b text-white">
                  {date}
                </span>
                <YouTubeLazyEmbed videoId={videoId} title={`2026 광탈페 예선 ${date} 실시간 중계`} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-16">
          <h3 className="text-body2b mobile:text-body3b text-black">예선 공연 순서</h3>
          <Image
            src="/images/preliminary-lineup.jpg"
            alt="2026 광탈페 예선 공연 순서"
            width={3508}
            height={2480}
            className="w-full h-auto rounded-lg border border-gray-100"
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        </div>

        <div className="flex justify-center">
          {isOpen ? (
            <Link
              href="/preliminary-result"
              className={cn(
                "inline-flex items-center justify-center gap-10 h-[50px] rounded-lg",
                "bg-orange-500 text-white text-body3b font-bold",
                "hover:bg-orange-400 transition-colors duration-200 px-28 mobile:w-full",
              )}
            >
              <span className="flex items-center justify-center px-[60px] mobile:px-0 mobile:w-full">
                예선 진출팀 명단 보기
              </span>
            </Link>
          ) : (
            <button
              disabled
              className={cn(
                "inline-flex items-center justify-center h-[50px] rounded-lg cursor-not-allowed",
                "bg-gray-100 text-gray-400 text-body3b font-bold border border-gray-200",
                "px-28 mobile:w-full",
              )}
            >
              <span className="flex items-center justify-center px-[60px] mobile:px-0 mobile:w-full">
                7월 3일(금) 10시에 공개됩니다
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PreliminaryResultSection;
