"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/shared/ui/Button";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { cn } from "@/shared/utils/cn";
import { getTokenFromCookie } from "@/shared/utils/auth";

// ADMIN은 채점 API(JUDGE 전용) 접근 권한이 없어 모니터링 페이지로, JUDGE는 채점 페이지로 안내한다
const ROLE_CTA: Record<string, { label: string; href: string }> = {
  ADMIN: { label: "심사 모니터링", href: "/admin/judging-result" },
  JUDGE: { label: "심사하러 가기", href: "/admin/evaluation" },
  PERFORMER: { label: "예매하러 가기", href: "/booking" },
};

const JudgingCtaSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(getTokenFromCookie("role"));
  }, []);

  const cta = userRole ? ROLE_CTA[userRole] : undefined;
  if (!cta) return null;

  return (
    <section
      id="JudgingCtaSection"
      className={cn(
        "w-full flex flex-col items-center text-center gap-16 py-[80px] mobile:py-[52px] px-16 bg-orange-100",
      )}
    >
      {userRole === "PERFORMER" && (
        <>
          <span className="inline-flex items-center rounded-full bg-orange-500 px-14 py-4 text-caption1b text-white">
            참가자 선예매 진행 중
          </span>
          <h2 className="text-title4b break-keep mobile:text-body2b">좌석 예매가 열렸습니다</h2>
          <p className="text-body3r text-gray-700 break-keep mobile:text-caption1r">
            일반 예매보다 먼저 좌석을 선택할 수 있어요.
          </p>
        </>
      )}
      <Button
        type="button"
        onClick={() => router.push(cta.href)}
        className="px-28 rounded-lg mt-8 mobile:mt-4 mobile:w-full"
      >
        <span className="text-body3b flex items-center justify-center gap-10 px-[60px] mobile:px-0 mobile:w-full">
          {cta.label}
          <RightArrow color="white" />
        </span>
      </Button>
    </section>
  );
};

export default JudgingCtaSection;
