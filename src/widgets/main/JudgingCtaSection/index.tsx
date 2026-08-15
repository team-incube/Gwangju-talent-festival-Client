"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/shared/ui/Button";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { getTokenFromCookie } from "@/shared/utils/auth";
import { useMyBookedSeats } from "@/entities/booking/lib/useMySeat";
import {
  isTicketOpen,
  isTicketClosed,
  daysUntil,
  ticketWindow,
  toKst,
} from "@/shared/config/dateConfig";

const pad = (value: number) => String(value).padStart(2, "0");
// 공지된 예매 시각은 KST 기준이라 디바이스 타임존이 달라도 같은 시각을 보여줘야 한다
const formatDateTime = (date: Date) => {
  const kst = toKst(date);
  return `${kst.getUTCFullYear()}.${pad(kst.getUTCMonth() + 1)}.${pad(kst.getUTCDate())} ${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}`;
};

// ADMIN은 채점 API(JUDGE 전용) 접근 권한이 없어 모니터링 페이지로, JUDGE는 채점 페이지로 안내한다
const ROLE_CTA: Record<string, { label: string; href: string }> = {
  ADMIN: { label: "심사 모니터링", href: "/admin/judging-result" },
  JUDGE: { label: "심사하러 가기", href: "/admin/evaluation" },
};

const JudgingCtaSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    setUserRole(getTokenFromCookie("role"));
  }, []);

  // 오픈 시각에 페이지를 켜둔 채 기다리는 사용자가 새로고침 없이 예매로 넘어갈 수 있어야 한다
  useEffect(() => {
    const sync = () => {
      setIsOpen(isTicketOpen(userRole));
      setIsClosed(isTicketClosed(userRole));
      setDaysLeft(daysUntil(ticketWindow(userRole).open));
    };
    sync();
    const timer = setInterval(sync, 1000);
    return () => clearInterval(timer);
  }, [userRole]);

  const { seats } = useMyBookedSeats();
  const hasBookedSeats = seats.length > 0;

  const isPerformer = userRole === "PERFORMER";
  // 로그인 전 방문자도 일반 예매 일정을 봐야 하므로 role이 없으면 일반 예매 안내로 취급한다
  const isBooking = isPerformer || !userRole || userRole === "USER";

  if (!isBooking) {
    const cta = ROLE_CTA[userRole];
    if (!cta) return null;

    return (
      <section
        id="JudgingCtaSection"
        className="w-full flex flex-col items-center gap-16 py-[80px] mobile:py-[52px] px-16 bg-orange-100"
      >
        <Button
          type="button"
          onClick={() => router.push(cta.href)}
          className="px-[88px] rounded-lg mobile:w-full mobile:px-28"
        >
          <span className="text-body3b flex items-center justify-center gap-10">
            {cta.label}
            <RightArrow color="white" />
          </span>
        </Button>
      </section>
    );
  }

  const { open: openDate, close: closeDate } = ticketWindow(userRole);

  return (
    <section
      id="JudgingCtaSection"
      className="relative w-full overflow-hidden bg-orange-200 py-[80px] mobile:py-[52px]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full aspect-[1092/1096] bg-[url('/images/left_line.png')] bg-contain bg-left bg-no-repeat hidden desktop:block" />
        <div className="absolute right-0 top-0 h-full aspect-[1092/1096] bg-[url('/images/right_line.png')] bg-contain bg-right bg-no-repeat hidden desktop:block" />
        <div className="absolute left-[3%] top-1/2 h-[62%] aspect-[1096/1046] -translate-y-1/2 bg-[url('/images/left_star.png')] bg-contain bg-center bg-no-repeat hidden desktop:block" />
        <div className="absolute right-[3%] top-1/2 h-[62%] aspect-[1328/1096] -translate-y-1/2 bg-[url('/images/right_star.png')] bg-contain bg-center bg-no-repeat hidden desktop:block" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-32 px-16 mobile:gap-20">
        <SectionTitle title={isPerformer ? "참가자 좌석 사전 예매" : "공연 관람 좌석 예매"} />

        <div className="w-[280px] rounded-[12px] bg-white px-24 py-20 text-center flex flex-col gap-16 mobile:w-full mobile:max-w-[280px]">
          <span className="text-caption1b">좌석 예매</span>
          <strong className="text-title2b text-orange-500 mobile:text-title4b">
            {hasBookedSeats
              ? "예매 완료"
              : isClosed
                ? "예매마감"
                : isOpen
                  ? "OPEN"
                  : daysLeft > 0
                    ? `D-${daysLeft}`
                    : "D-Day"}
          </strong>
          <p className="flex items-center justify-center gap-8 text-caption1b">
            {isOpen || isClosed ? "티켓마감" : "티켓오픈"}
            <span className="font-normal text-gray-500">
              {formatDateTime(isOpen || isClosed ? closeDate : openDate)}
            </span>
          </p>
          {hasBookedSeats ? (
            <Button
              type="button"
              onClick={() => router.push("/booking/my")}
              className="w-full h-[40px] text-caption1b"
            >
              예매 확인하기
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!isOpen}
              onClick={() => router.push("/booking")}
              className="w-full h-[40px] text-caption1b"
            >
              예매 하러가기
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default JudgingCtaSection;
