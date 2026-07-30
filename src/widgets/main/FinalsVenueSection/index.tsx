"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { isFinalsLineupReleased } from "@/shared/config/dateConfig";
import { TEAM_GENRE_LABELS } from "@/entities/team/model/types";
import { useGetTeams } from "../model/useGetTeams";

const VENUE = {
  name: "광주교육대학교 풍향문화관",
  date: "2026년 9월 5일 (토)",
};

const MAP_QUERY = encodeURIComponent("광주교육대학교 풍향문화관");

const MAP_LINKS = [
  {
    name: "카카오맵",
    icon: "/images/mapLogo/kakaomap.png",
    url: `https://map.kakao.com/?q=${MAP_QUERY}`,
  },
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
  const { data: teams = [], isLoading } = useGetTeams();
  const half = Math.ceil(teams.length / 2);
  const lineupLeft = teams.slice(0, half);
  const lineupRight = teams.slice(half);

  const [isLineupReleased, setIsLineupReleased] = useState(false);

  useEffect(() => {
    const check = () => setIsLineupReleased(isFinalsLineupReleased());
    check();
    const timer = setInterval(check, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={cn("flex flex-col items-center")}>
      <div className={cn("w-[70%] mobile:w-full mobile:px-16")}>
        <SectionTitle
          title="2026 광탈페 본선"
          description={
            <>
              {VENUE.date} · {VENUE.name}
            </>
          }
          className={cn("mt-66 mobile:mt-[1.7rem] mb-40 mobile:mb-24")}
        />

        {/* 본선 진출팀 */}
        <div className={cn("mb-24 flex flex-col gap-12")}>
          <h3 className="text-body2b mobile:text-body3b text-black">본선 진출팀</h3>
          {!isLineupReleased ? (
            <div className="flex flex-col items-center gap-4 rounded-xl bg-gray-50 py-40 text-center">
              <p className="text-body3b mobile:text-caption1b text-gray-700">
                본선 진출팀은 7월 31일(금) 오전 10시에 발표됩니다
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col gap-8">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-32 w-full rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <div className="py-24 text-center text-gray-400">본선 진출팀 정보가 없습니다.</div>
          ) : (
            <>
              {/* 데스크톱: 2열 표 */}
              <div className="w-full overflow-x-auto mobile:hidden">
                <div className="min-w-[720px] overflow-hidden rounded-xl">
                  <table className="w-full border-collapse text-center text-caption1r">
                    <thead className="bg-gray-50 text-caption1b text-gray-700">
                      <tr>
                        <th className="border border-t-0 border-l-0 border-solid border-gray-200 px-12 py-10">
                          번호
                        </th>
                        <th className="border border-t-0 border-solid border-gray-200 px-12 py-10">
                          분야
                        </th>
                        <th className="border border-t-0 border-solid border-gray-200 px-12 py-10">
                          팀명(소속)
                        </th>
                        <th className="border border-t-0 border-solid border-gray-200 px-12 py-10">
                          신청자명
                        </th>
                        <th className="border border-t-0 border-solid border-gray-200 px-12 py-10">
                          번호
                        </th>
                        <th className="border border-t-0 border-solid border-gray-200 px-12 py-10">
                          분야
                        </th>
                        <th className="border border-t-0 border-solid border-gray-200 px-12 py-10">
                          팀명(소속)
                        </th>
                        <th className="border border-t-0 border-r-0 border-solid border-gray-200 px-12 py-10">
                          신청자명
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineupLeft.map((left, index) => {
                        const right = lineupRight[index];
                        return (
                          <tr key={left.teamId}>
                            <td className="border border-l-0 border-solid border-gray-200 px-12 py-10">
                              {left.performOrder}
                            </td>
                            <td className="border border-solid border-gray-200 px-12 py-10">
                              {TEAM_GENRE_LABELS[left.teamGenre]}
                            </td>
                            <td className="border border-solid border-gray-200 px-12 py-10 text-left">
                              {left.school ? `${left.teamName}(${left.school})` : left.teamName}
                            </td>
                            <td className="border border-solid border-gray-200 px-12 py-10">
                              {left.applicantName}
                            </td>
                            <td className="border border-solid border-gray-200 px-12 py-10">
                              {right?.performOrder}
                            </td>
                            <td className="border border-solid border-gray-200 px-12 py-10">
                              {right && TEAM_GENRE_LABELS[right.teamGenre]}
                            </td>
                            <td className="border border-solid border-gray-200 px-12 py-10 text-left">
                              {right &&
                                (right.school
                                  ? `${right.teamName}(${right.school})`
                                  : right.teamName)}
                            </td>
                            <td className="border border-r-0 border-solid border-gray-200 px-12 py-10">
                              {right?.applicantName}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-50 text-caption1b">
                        <td className="border border-b-0 border-l-0 border-solid border-gray-200 px-12 py-10">
                          계
                        </td>
                        <td
                          colSpan={6}
                          className="border border-b-0 border-solid border-gray-200 px-12 py-10"
                        >
                          국악1, 밴드4, 댄스2, 보컬3
                        </td>
                        <td className="border border-b-0 border-r-0 border-solid border-gray-200 px-12 py-10 bg-orange-50 text-orange-500">
                          총 36명
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 모바일: 1열 나열 */}
              <div className="hidden mobile:flex flex-col overflow-hidden rounded-xl border border-solid border-gray-200">
                {teams.map((team) => (
                  <div
                    key={team.teamId}
                    className="flex items-center gap-8 border-b border-solid border-gray-100 px-14 py-10 text-caption1r last:border-b-0"
                  >
                    <span className="w-20 shrink-0 text-center text-gray-500">
                      {team.performOrder}
                    </span>
                    <span className="w-36 shrink-0 text-center text-caption2b text-orange-500">
                      {TEAM_GENRE_LABELS[team.teamGenre]}
                    </span>
                    <span className="flex-1 truncate text-left text-black">
                      {team.school ? `${team.teamName}(${team.school})` : team.teamName}
                    </span>
                    <span className="shrink-0 text-gray-600">{team.applicantName}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-8 bg-gray-50 px-14 py-10 text-caption1b">
                  <span className="text-gray-700">계</span>
                  <span className="text-gray-700">국악1, 밴드4, 댄스2, 보컬3</span>
                  <span className="text-orange-500">총 36명</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={cn("flex gap-24 mb-90 mobile:mb-38 mobile:flex-col mobile:gap-20")}>
          {/* 오시는 길 */}
          <div className={cn("flex w-1/2 mobile:w-full flex-col gap-24")}>
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
