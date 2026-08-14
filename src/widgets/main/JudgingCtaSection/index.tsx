"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/shared/ui/Button";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { cn } from "@/shared/utils/cn";
import { getTokenFromCookie } from "@/shared/utils/auth";
import { useMyBookedSeats } from "@/entities/booking/lib/useMySeat";
import {
  isTicketOpen,
  daysUntil,
  performerTicketOpenDate,
  ticketOpenDate,
  ticketCloseDate,
} from "@/shared/config/dateConfig";

const pad = (value: number) => String(value).padStart(2, "0");
const formatDateTime = (date: Date) =>
  `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

// ADMIN은 채점 API(JUDGE 전용) 접근 권한이 없어 모니터링 페이지로, JUDGE는 채점 페이지로 안내한다
const ROLE_CTA: Record<string, { label: string; href: string }> = {
  ADMIN: { label: "심사 모니터링", href: "/admin/judging-result" },
  JUDGE: { label: "심사하러 가기", href: "/admin/evaluation" },
};

const JudgingCtaSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    setUserRole(getTokenFromCookie("role"));
  }, []);

  // 오픈 시각에 페이지를 켜둔 채 기다리는 사용자가 새로고침 없이 예매로 넘어갈 수 있어야 한다
  useEffect(() => {
    const openDate = userRole === "PERFORMER" ? performerTicketOpenDate : ticketOpenDate;
    const sync = () => {
      setIsOpen(isTicketOpen(userRole));
      setDaysLeft(daysUntil(openDate));
    };
    sync();
    const timer = setInterval(sync, 1000);
    return () => clearInterval(timer);
  }, [userRole]);

  const { seats } = useMyBookedSeats();
  const hasBookedSeats = userRole === "PERFORMER" && seats.length > 0;

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

  const openDate = isPerformer ? performerTicketOpenDate : ticketOpenDate;

  return (
    <section
      id="JudgingCtaSection"
      className="relative w-full overflow-hidden bg-orange-100 py-[80px] mobile:py-[52px]"
    >
      <div aria-hidden className="pointer-events-none">
        <div className="absolute left-[1%] top-0 h-full w-[26%] mobile:w-[30%]">
          <Image src="/images/left_line.png" alt="" fill sizes="30vw" />
        </div>
        <div className="absolute right-[4%] top-0 h-full w-[26%] mobile:w-[30%]">
          <Image src="/images/right_line.png" alt="" fill sizes="30vw" />
        </div>
        <div className="absolute left-0 top-1/2 w-[30%] aspect-square translate-y-[-50%] mobile:w-[40%] mobile:left-[-4%]">
          <Image src="/images/left_star.png" alt="" fill sizes="40vw" />
        </div>
        <div className="absolute right-[4%] top-1/2 w-[30%] aspect-square translate-y-[-50%] mobile:w-[40%] mobile:right-[-10%]">
          <Image src="/images/right_star.png" alt="" fill sizes="40vw" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-32 px-16 mobile:gap-20">
        <SectionTitle title="공연 관람 좌석 예매" />

        <div
          className={cn(
            "w-[280px] rounded-[12px] px-24 py-20 text-center flex flex-col gap-16 mobile:w-full mobile:max-w-[280px]",
            isOpen ? "bg-white" : "bg-gradient-to-b from-orange-300 to-orange-500 text-white",
          )}
        >
          {hasBookedSeats ? (
            <Button
              type="button"
              onClick={() => router.push("/booking/my")}
              className="w-full h-[40px] text-caption1b"
            >
              예매 확인하기
            </Button>
          ) : (
            <>
              <span className="text-caption1b">좌석 예매</span>
              <strong
                className={cn("text-title2b mobile:text-title4b", isOpen && "text-orange-500")}
              >
                {isOpen ? "OPEN" : daysLeft > 0 ? `D-${daysLeft}` : "D-Day"}
              </strong>
              <p className="flex items-center justify-center gap-8 text-caption1b">
                {isOpen ? "티켓마감" : "티켓오픈"}
                <span className={cn("font-normal", isOpen ? "text-gray-500" : "text-orange-100")}>
                  {formatDateTime(isOpen ? ticketCloseDate : openDate)}
                </span>
              </p>
              <Button
                type="button"
                disabled={!isOpen}
                onClick={() => router.push("/booking")}
                className="w-full h-[40px] text-caption1b"
              >
                예매 하러가기
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default JudgingCtaSection;
