"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";

const VENUE = {
  name: "광주교육대학교 풍향문화관",
  address: "광주광역시 북구 필문대로 55",
  date: "2026년 9월 5일 (토)",
};

const MAP_QUERY = encodeURIComponent("광주교육대학교 풍향문화관");

const MAP_LINKS = [
  { name: "카카오맵", icon: "/images/mapLogo/kakaomap.png", url: `https://map.kakao.com/?q=${MAP_QUERY}` },
  {
    name: "네이버지도",
    icon: "/images/mapLogo/navermap.png",
    url: `https://map.naver.com/p/search/${MAP_QUERY}`,
  },
] as const;

const BUS_ROUTES = [
  { stop: "정문 · 교육대 정류장", buses: "순환01, 수완03, 지원15, 문흥80, 충효187" },
  { stop: "후문 · 풍향삼거리 정류장", buses: "지원15, 문흥80, 충효187" },
] as const;

const FinalsVenueSection = () => {
  return (
    <section className={cn("flex flex-col items-center")}>
      <div className={cn("w-[70%] mobile:w-full mobile:px-16")}>
        <SectionTitle
          title="2026 광탈페 光트로 본선"
          description={<>{VENUE.date} · {VENUE.name}</>}
          className={cn("mt-66 mobile:mt-[1.7rem] mb-40 mobile:mb-24")}
        />

        {/* 위치 안내 */}
        <div className={cn("mb-24 flex flex-col gap-12")}>
          <h3 className="text-body2b mobile:text-body3b text-black">광탈페 위치</h3>
          <Image
            src="/images/finals-location.jpg"
            alt="2026 광탈페 본선 위치 안내"
            width={3508}
            height={2480}
            className="w-full h-auto rounded-lg border border-gray-100"
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        </div>

        <div className={cn("flex gap-24 mb-90 mobile:mb-38 mobile:flex-col mobile:gap-20")}>
          {/* 장소·오시는 길 */}
          <div className={cn("flex w-1/2 mobile:w-full flex-col gap-24")}>
            <div className={cn("flex flex-col gap-12 rounded-xl bg-gray-50 p-24 mobile:p-16")}>
              <div className={cn("flex gap-12")}>
                <span className="shrink-0 text-body3b mobile:text-caption1b text-orange-500">일시</span>
                <p className="text-body3r mobile:text-caption1r text-gray-700">{VENUE.date}</p>
              </div>
              <div className={cn("flex gap-12")}>
                <span className="shrink-0 text-body3b mobile:text-caption1b text-orange-500">장소</span>
                <div className="flex flex-col gap-4">
                  <p className="text-body3r mobile:text-caption1r text-gray-700 break-keep">
                    {VENUE.name}
                  </p>
                  <p className="text-caption1r mobile:text-caption2r text-gray-400">
                    {VENUE.address}
                  </p>
                </div>
              </div>
            </div>

            <div className={cn("flex flex-col gap-12")}>
              <h3 className="text-body2b mobile:text-body3b text-black">오시는 길</h3>
              <div className={cn("flex gap-10 mobile:flex-col")}>
                {MAP_LINKS.map(({ name, icon, url }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex flex-1 items-center justify-center gap-8 rounded-lg border border-gray-200",
                      "py-12 text-body3b mobile:text-caption1b text-gray-700",
                      "hover:border-orange-300 hover:bg-orange-50 transition-colors duration-200",
                    )}
                  >
                    <Image src={icon} alt="" width={20} height={20} className="h-20 w-20" />
                    {name}
                  </a>
                ))}
              </div>
              <div className={cn("flex flex-col gap-12 rounded-lg bg-gray-50 p-20 mobile:p-16")}>
                {BUS_ROUTES.map(({ stop, buses }) => (
                  <div key={stop} className={cn("flex flex-col gap-4")}>
                    <span className="text-caption1b mobile:text-caption2b text-orange-500">
                      {stop}
                    </span>
                    <p className="text-body3r mobile:text-caption1r text-gray-700 break-keep">
                      {buses}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 풍향문화관 사진 */}
          <div className={cn("flex w-1/2 mobile:w-full flex-col gap-12")}>
            <h3 className="text-body2b mobile:text-body3b text-black">풍향문화관</h3>
            <Image
              src="/images/punghyang-hall.png"
              alt="광주교육대학교 풍향문화관 전경"
              width={2560}
              height={1002}
              className="w-full h-auto rounded-lg border border-gray-100"
              sizes="(max-width: 768px) 100vw, 35vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalsVenueSection;
