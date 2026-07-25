"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/shared/ui/Button";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { getTokenFromCookie } from "@/shared/utils/auth";
import { useGetJudgeProfile, usePutJudgeProfile } from "@/entities/judge/model/useJudgeProfile";
import { JudgeProfile } from "@/entities/judge/model/types";
import PenField from "./ui/PenField";

const INFO_FIELDS = [
  { key: "affiliationStrokes", label: "소속" },
  { key: "positionStrokes", label: "지위" },
  { key: "nameStrokes", label: "이름" },
] as const;

const EMPTY_PROFILE: JudgeProfile = {
  affiliationStrokes: [],
  positionStrokes: [],
  nameStrokes: [],
};

const SAVE_DEBOUNCE_MS = 800;
const JUDGING_HREF = "/admin/evaluation";

const JudgeInfoSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [, setProfile] = useState<JudgeProfile>(EMPTY_PROFILE);

  useEffect(() => {
    setUserRole(getTokenFromCookie("role"));
  }, []);

  const { data } = useGetJudgeProfile(userRole === "JUDGE");
  const { mutate: saveProfile } = usePutJudgeProfile();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (data) setProfile(data);
  }, [data]);

  useEffect(() => () => clearTimeout(saveTimer.current ?? undefined), []);

  const handleStrokesChange = (key: keyof JudgeProfile, strokes: JudgeProfile[keyof JudgeProfile]) => {
    setProfile(prev => {
      const next = { ...prev, [key]: strokes };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveProfile(next), SAVE_DEBOUNCE_MS);
      return next;
    });
  };

  const handleSubmit = () => router.push(JUDGING_HREF);

  if (userRole !== "JUDGE") return null;

  return (
    <section
      id="JudgeInfoSection"
      className="w-full bg-white px-40 py-40 mobile:px-16 tablet:px-24"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-32">
        <h2 className="text-title2b text-gray-900 mobile:text-h4b">심사위원 정보</h2>

        <div className="flex flex-col gap-16">
          {INFO_FIELDS.map(({ key, label }) => (
            <div
              key={key}
              className="flex overflow-hidden rounded-2xl border border-solid border-gray-200 bg-white shadow-sm"
            >
              <div className="flex w-[180px] shrink-0 items-center justify-center border-r border-solid border-gray-200 bg-gray-50 text-body1b text-gray-900 mobile:w-[88px] mobile:text-body2b">
                {label}
              </div>
              <div className="flex-1">
                <PenField
                  value={data ? data[key] : undefined}
                  onChange={strokes => handleStrokesChange(key, strokes)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mobile:justify-center">
          <Button
            type="button"
            onClick={handleSubmit}
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
