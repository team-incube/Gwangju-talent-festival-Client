"use client";

import { useRef } from "react";
import { cn } from "@/shared/utils/cn";
import BackHeader from "@/shared/ui/BackHeader";

type Team = {
  id: number;
  field: string;
  name: string;
  school: string;
  representative: string;
};

const PRELIMINARY_TEAMS: Team[] = [
  { id: 1, field: "국악", name: "살레시오초", school: "", representative: "김현*" },
  { id: 2, field: "보컬", name: "Blas", school: "대촌중", representative: "박서*" },
  { id: 3, field: "보컬", name: "전남여자고", school: "", representative: "김민*" },
  { id: 4, field: "보컬", name: "영천초", school: "", representative: "김시*" },
  { id: 5, field: "보컬", name: "이음", school: "문정여자고 외", representative: "염민*" },
  { id: 6, field: "보컬", name: "광주석산고", school: "", representative: "임준*" },
  { id: 7, field: "보컬", name: "광주화정중", school: "", representative: "전람*" },
  { id: 8, field: "보컬", name: "쿠쿠다쓰", school: "하백초", representative: "장연*" },
  { id: 9, field: "댄스", name: "Ate", school: "수완고 외", representative: "유현*" },
  { id: 10, field: "댄스", name: "Luna.X", school: "살레시오중", representative: "박시*" },
  { id: 11, field: "댄스", name: "ON:BEAT", school: "문산중 외", representative: "강도*" },
  { id: 12, field: "댄스", name: "PLAY", school: "성덕중", representative: "임수*" },
  { id: 13, field: "댄스", name: "베아트리스. Beat", school: "동일미래과학고", representative: "이준*" },
  { id: 14, field: "밴드", name: "B.O.D", school: "서강중", representative: "임도*" },
  { id: 15, field: "밴드", name: "Be 정상", school: "문정여고 외", representative: "박지*" },
  { id: 16, field: "밴드", name: "EVA밴드", school: "고려고 외", representative: "박지*" },
  { id: 17, field: "밴드", name: "Made in stop", school: "광주예술고 외", representative: "양윤*" },
  { id: 18, field: "밴드", name: "권오건 밴드", school: "광주고 외", representative: "권오*" },
  { id: 19, field: "밴드", name: "플로우", school: "금호중", representative: "전다*" },
  { id: 20, field: "밴드", name: "밴드유아이어스", school: "숭덕고", representative: "박준*" },
  { id: 21, field: "밴드", name: "수피아밴드", school: "광주수피아여고", representative: "진단*" },
  { id: 22, field: "밴드", name: "신가밴드", school: "신가중", representative: "신지*" },
  { id: 23, field: "밴드", name: "원미동사람들", school: "광주숭일중", representative: "배서*" },
  { id: 24, field: "밴드", name: "일퍼센", school: "광주여고 외", representative: "최사*" },
];

const MEETING_INFO = [
  { label: "일시", value: "2026. 7. 15.(수) 17:00~18:00 (등록 ~16:50)" },
  {
    label: "대상",
    value:
      "예선(오디션) 선정 팀 대표(24개 팀, 팀당 1명 필참, 사진학생증(신분증, 여권, 청소년증, 주민등록증, 생기부 1면 등))",
  },
  { label: "장소", value: "광주학생예술누리터 꿈이룸관(2층)" },
];

const VENUE = {
  name: "광주학생예술누리터",
  address: "광주광역시 동구 제봉로 167 광주학생예술누리터",
  phone: "운영실 222-7301,2,4,5 / 관리실 222-7306",
};

const MEETING_AGENDA = [
  "2026 光탈페(광주학생탈렌트페스티벌) 예선(오디션) 운영 전반 사항 안내",
  "예선일정 확정(7. 24.(금) / 7. 25.(토) 경연장르 확정)",
  "예선 경연 순서 추첨",
  "예선 참여 곡명 및 무대 지원 필요 사항 점검 등",
  "홍보자료 제작용 팀 소개 관련 자료 수합 안내(사진, 팀 소개, 연주곡 소개 등)",
];

const PreliminaryResultView = () => {
  const meetingGuideRef = useRef<HTMLElement>(null);

  return (
    <main className={cn("min-h-screen bg-white")}>
      <div className={cn("max-w-[900px] mx-auto px-[5%] pb-80 mobile:pb-52")}>
        <BackHeader text="예선 진출팀" goto="/home" />

        {/* 헤더 */}
        <div className={cn("flex flex-col items-center text-center gap-16 py-40 mobile:py-28")}>
          <h1 className={cn("text-title2b mobile:text-h4b text-black")}>
            2026 광탈페 예선 진출팀
          </h1>
          <div className={cn("flex flex-col gap-6 text-body3r mobile:text-caption1r text-gray-600")}>
            <p>오디션에 선정되신 <strong className="text-orange-500">24개 팀</strong>의 대표는 신분증을 지참하여 협의회에 참석해주세요.</p>
            <p>각 팀의 대표는 사전 협의회 참석 명단을 이메일로 제출해주세요.</p>
            <p>진출하신 모든 팀을 진심으로 축하드립니다.</p>
          </div>
          <a
            href="#meeting-guide"
            onClick={(e) => {
              e.preventDefault();
              meetingGuideRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className={cn(
              "inline-flex items-center gap-4 text-body3b mobile:text-caption1b text-orange-500",
              "underline underline-offset-4 hover:text-orange-400 transition-colors duration-200",
            )}
          >
            협의회 참석 관련 안내 →
          </a>
        </div>

        {/* 구분선 */}
        <div className="w-full h-[1px] bg-gray-100 mb-40 mobile:mb-28" />

        {/* 팀 카드 그리드 */}
        <div className={cn("grid grid-cols-3 tablet:grid-cols-2 mobile:grid-cols-2 gap-14 mobile:gap-8")}>
          {PRELIMINARY_TEAMS.map((team) => (
            <div
              key={team.id}
              className={cn(
                "relative overflow-hidden rounded-2xl p-24 mobile:p-16",
                "bg-gradient-to-br from-orange-50 to-white",
                "border border-orange-100",
              )}
            >
              {/* 배경 워터마크 번호 */}
              <span
                className="absolute -bottom-10 -right-4 text-[80px] mobile:text-[60px] font-bold text-orange-200 leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                {String(team.id).padStart(2, "0")}
              </span>

              {/* 콘텐츠 */}
              <div className={cn("relative z-10 flex flex-col gap-10 mobile:gap-8")}>
                <span className={cn("text-caption2b text-orange-400")}>
                  {String(team.id).padStart(2, "0")} · {team.field}
                </span>
                <div className={cn("flex flex-col gap-4")}>
                  <p className={cn("text-body3b mobile:text-caption1b text-black break-keep leading-snug")}>
                    {team.name}
                    <span className={cn("ml-6 text-caption1r mobile:text-caption2r text-gray-400 font-normal")}>
                      ({team.representative})
                    </span>
                  </p>
                  {team.school && (
                    <p className={cn("text-caption2r text-gray-400 break-keep")}>{team.school}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="w-full h-[1px] bg-gray-100 my-40 mobile:my-28" />

        {/* 사전 협의회 참석 안내 */}
        <section
          id="meeting-guide"
          ref={meetingGuideRef}
          className={cn("flex flex-col gap-24 mobile:gap-16 scroll-mt-80")}
        >
          <h2 className={cn("text-title4b mobile:text-body1b text-black")}>
            예선진출팀 사전 협의회 참석 안내
          </h2>

          <div className={cn("flex flex-col gap-16 mobile:gap-12")}>
            {MEETING_INFO.map((item) => (
              <div key={item.label} className={cn("flex gap-12 mobile:gap-8")}>
                <span className={cn("shrink-0 text-body3b mobile:text-caption1b text-orange-500")}>
                  {item.label}
                </span>
                <p className={cn("text-body3r mobile:text-caption1r text-gray-700 break-keep")}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className={cn("flex flex-col gap-8 rounded-xl bg-gray-50 p-20 mobile:p-16")}>
            <p className={cn("text-body3b mobile:text-caption1b text-black")}>{VENUE.name}</p>
            <p className={cn("text-caption1r mobile:text-caption2r text-gray-600")}>{VENUE.address}</p>
            <p className={cn("text-caption1r mobile:text-caption2r text-gray-600")}>{VENUE.phone}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mt-4 inline-flex w-fit items-center gap-4 text-caption1b mobile:text-caption2b text-orange-500",
                "underline underline-offset-4 hover:text-orange-400 transition-colors duration-200",
              )}
            >
              지도에서 보기 →
            </a>
          </div>
        </section>

        {/* 구분선 */}
        <div className="w-full h-[1px] bg-gray-100 my-40 mobile:my-28" />

        {/* 사전 협의회 주요 내용 */}
        <section className={cn("flex flex-col gap-24 mobile:gap-16")}>
          <h2 className={cn("text-title4b mobile:text-body1b text-black")}>
            예선팀 대표 사전 협의회 주요 내용
          </h2>
          <ul className={cn("flex flex-col gap-10 mobile:gap-8")}>
            {MEETING_AGENDA.map((content) => (
              <li
                key={content}
                className={cn("flex gap-8 text-body3r mobile:text-caption1r text-gray-700 break-keep")}
              >
                <span className="text-orange-400" aria-hidden="true">
                  ○
                </span>
                {content}
              </li>
            ))}
          </ul>
        </section>

      </div>
    </main>
  );
};

export default PreliminaryResultView;
