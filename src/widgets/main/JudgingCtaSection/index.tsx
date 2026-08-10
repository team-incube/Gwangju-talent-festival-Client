"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/shared/ui/Button";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { cn } from "@/shared/utils/cn";
import { getTokenFromCookie } from "@/shared/utils/auth";

// ADMIN은 채점 API(JUDGE 전용) 접근 권한이 없어 모니터링 페이지로, JUDGE는 채점 페이지로 안내한다
// 출연진은 직접 가입·로그인한 뒤 일회성 코드로 권한을 받으므로, 로그인한 USER에게만 인증 경로를 노출한다
type Cta = {
  label: string;
  href: string;
  badge?: string;
  title?: string;
  description?: string;
};

const ROLE_CTA: Record<string, Cta> = {
  ADMIN: { label: "심사 모니터링", href: "/admin/judging-result" },
  JUDGE: { label: "심사하러 가기", href: "/admin/evaluation" },
  PERFORMER: { label: "예매하러 가기", href: "/booking" },
  USER: {
    label: "출연진 인증하기",
    href: "/performer",
    badge: "출연진 전용",
    title: "만약 출연진이라면?",
    description: "전달받은 일회성 인증코드를 입력하면 선예매가 열립니다.",
  },
};

const JudgingCtaSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(getTokenFromCookie("role"));
  }, []);

  const cta = userRole ? ROLE_CTA[userRole] : undefined;
  if (!cta) return null;

  const ctaButton = (
    <Button
      type="button"
      onClick={() => router.push(cta.href)}
      className="px-28 rounded-lg mobile:w-full"
    >
      <span className="text-body3b flex items-center justify-center gap-10 px-[60px] mobile:px-0 mobile:w-full">
        {cta.label}
        <RightArrow color="white" />
      </span>
    </Button>
  );

  return (
    <section
      id="JudgingCtaSection"
      className={cn(
        "w-full flex flex-col items-center text-center gap-16 py-[80px] mobile:py-[52px] px-16 bg-orange-100",
      )}
    >
      {cta.badge && (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-orange-500 px-14 py-4 text-caption1b text-white",
          )}
        >
          {cta.badge}
        </span>
      )}
      {cta.title && (
        <h2 className={cn("text-title4b break-keep mobile:text-body2b")}>{cta.title}</h2>
      )}
      {cta.description && (
        <p className={cn("text-body3r text-gray-700 break-keep mobile:text-caption1r")}>
          {cta.description}
        </p>
      )}
      <div className={cn("mt-8 flex justify-center mobile:mt-4 mobile:w-full")}>{ctaButton}</div>
    </section>
  );
};

export default JudgingCtaSection;
