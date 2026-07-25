"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/shared/ui/Button";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { cn } from "@/shared/utils/cn";
import { getTokenFromCookie } from "@/shared/utils/auth";
import PenField from "./ui/PenField";

const INFO_FIELDS = ["소속", "지위", "이름"];
const JUDGING_HREF = "/admin/evaluation";

const JudgeInfoSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(getTokenFromCookie("role"));
  }, []);

  if (userRole !== "JUDGE") return null;

  return (
    <section
      id="JudgeInfoSection"
      className="w-full bg-white px-40 py-40 mobile:px-16 tablet:px-24"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-32">
        <h2 className="text-title2b text-gray-900 mobile:text-h4b">심사위원 정보</h2>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          {INFO_FIELDS.map((field, index) => (
            <div
              key={field}
              className={cn("flex items-stretch", index > 0 && "border-t border-gray-200")}
            >
              <div className="flex w-[180px] shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 text-body2b text-gray-900 mobile:w-[88px] mobile:text-body3b">
                {field}
              </div>
              <div className="min-w-0 flex-1">
                <PenField />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mobile:justify-center">
          <Button
            type="button"
            onClick={() => router.push(JUDGING_HREF)}
            className="h-[72px] rounded-xl px-48 mobile:w-full"
          >
            <span className="flex items-center justify-center gap-12 text-body1b">
              심사하러 가기
              <RightArrow color="white" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JudgeInfoSection;
