"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { isPreliminaryResultOpen } from "@/shared/config/dateConfig";

const PreliminaryResultSection = () => {
  const isOpen = isPreliminaryResultOpen();
  return (
    <section
      className={cn("relative w-full overflow-hidden bg-white py-[80px] mobile:py-[52px]")}
    >
      {/* 좌측 데코 — 와이드 데스크탑에서만 표시 */}
      <div className="absolute left-[5%] top-0 pointer-events-none select-none mobile:hidden tablet:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/apply-deco-left.png" alt="" width={300} height={300} className="w-full h-auto" />
      </div>

      {/* 우측 데코 — 와이드 데스크탑에서만 표시 */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 pointer-events-none select-none mobile:hidden tablet:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/apply-deco-right.png" alt="" width={300} height={300} className="w-full h-auto" />
      </div>

      {/* 모바일 좌상단 데코 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/apply-deco-left.png" alt="" width={120} height={120} className="absolute left-0 top-0 pointer-events-none select-none hidden mobile:block w-[120px] h-auto" />

      {/* 모바일 우하단 데코 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/apply-deco-right.png" alt="" width={120} height={120} className="absolute right-0 bottom-0 pointer-events-none select-none hidden mobile:block w-[120px] h-auto" />

      {/* 블러 원 데코 */}
      <div className="absolute top-[-60px] left-[-80px] w-[320px] h-[320px] rounded-full bg-orange-300 opacity-60 blur-[80px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-60px] right-[-80px] w-[280px] h-[280px] rounded-full bg-orange-400 opacity-50 blur-[80px] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-[40%] left-[55%] w-[200px] h-[200px] rounded-full bg-orange-200 opacity-60 blur-[60px] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center text-center px-[80px] tablet:px-[40px] mobile:px-16 gap-24 mobile:gap-16">
        {/* 제목 */}
        <div className="flex flex-col gap-12 mobile:gap-8">
          <h2 className="text-title2b mobile:text-body1b text-black">
            2026 광탈페 光트로 예선 진출팀
          </h2>
          <p className="text-body3r mobile:text-caption1r text-gray-700">
            총 <strong className="text-orange-500 text-body2b mobile:text-body3b">24팀</strong>이 예선에 진출합니다
          </p>
        </div>

        {/* CTA 버튼 */}
        {isOpen ? (
          <Link
            href="/preliminary-result"
            className={cn(
              "inline-flex items-center justify-center gap-10",
              "h-[50px] rounded-lg",
              "bg-orange-500 text-white text-body3b font-bold",
              "hover:bg-orange-400 transition-colors duration-200",
              "px-28 mobile:w-full",
            )}
          >
            <span className="flex items-center justify-center px-[60px] mobile:px-0 mobile:w-full">
              결과 보러가기
            </span>
          </Link>
        ) : (
          <button
            disabled
            className={cn(
              "inline-flex items-center justify-center",
              "h-[50px] rounded-lg cursor-not-allowed",
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
    </section>
  );
};

export default PreliminaryResultSection;
