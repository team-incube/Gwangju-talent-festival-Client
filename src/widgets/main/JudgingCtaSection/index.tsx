"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/shared/ui/Button";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { cn } from "@/shared/utils/cn";
import { getTokenFromCookie } from "@/shared/utils/auth";

const JudgingCtaSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(getTokenFromCookie("role"));
  }, []);

  if (userRole !== "ADMIN" && userRole !== "JUDGE") return null;

  return (
    <section
      id="JudgingCtaSection"
      className={cn(
        "w-full flex flex-col items-center text-center gap-24 py-[80px] mobile:py-[52px] px-16 bg-gray-50",
      )}
    >
      <Button
        type="button"
        onClick={() => router.push("/admin/evaluation")}
        className="px-28 rounded-lg mobile:w-full"
      >
        <span className="text-body3b flex items-center justify-center gap-10 px-[60px] mobile:px-0 mobile:w-full">
          심사하러 가기
          <RightArrow color="white" />
        </span>
      </Button>
    </section>
  );
};

export default JudgingCtaSection;
