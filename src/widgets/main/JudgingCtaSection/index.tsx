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
        "w-full flex flex-col items-center text-center gap-24 py-[80px] mobile:py-[52px] px-16 bg-gray-50",
      )}
    >
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
    </section>
  );
};

export default JudgingCtaSection;
