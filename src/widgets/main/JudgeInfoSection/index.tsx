"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/shared/ui/Button";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
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

        <div className="flex flex-col gap-16">
          {INFO_FIELDS.map(field => (
            <div
              key={field}
              className="flex overflow-hidden rounded-2xl border border-solid border-gray-200 bg-white shadow-sm"
            >
              <div className="flex w-[180px] shrink-0 items-center justify-center border-r border-solid border-gray-200 bg-gray-50 text-body1b text-gray-900 mobile:w-[88px] mobile:text-body2b">
                {field}
              </div>
              <div className="flex-1">
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
