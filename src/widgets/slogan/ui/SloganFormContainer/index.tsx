"use client";

import { useState } from "react";
import { useActionState } from "react";
import Search from "@/shared/asset/svg/Search";
import { cn } from "@/shared/utils/cn";
import { SloganFormState } from "@/entities/slogan/model/sloganFormState";
import { handleSloganFormSubmit } from "@/entities/slogan/lib/handleSloganFormSubmit";
import { Button, Input } from "@/shared/ui";
import CountLength from "@/entities/slogan/ui/CountLength";
import { useDebounce } from "@/entities/slogan/lib/useDebounce";
import { useGetSchool } from "@/entities/api/useGetSchool";
import SloganHeader from "@/entities/slogan/ui/SloganHeader";
import Share from "@/shared/asset/Share";
import { Logo } from "@/shared/asset/svg/Logo";
import { colors } from "@/shared/utils/color";

export default function SloganFormContainer() {
  const [sloganLength, setSloganLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [schoolName, setSchoolName] = useState("");

  const debouncedSchoolName = useDebounce<string>(schoolName, 400);
  const { data: schoolData, isSuccess: isSchoolFetched } =
    useGetSchool(debouncedSchoolName);

  const initialState: SloganFormState = {
    values: {
      slogan: "",
      description: "",
      school: "",
      grade: "",
      class: "",
      phone: "",
    },
    isValid: false,
    submitted: false,
  };

  const [state, formAction] = useActionState(
    handleSloganFormSubmit,
    initialState
  );

  const schoolList =
    schoolData?.schoolInfo?.length === 2 ? schoolData.schoolInfo[1].row : [];

  if (state.submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{ height: "calc(100vh - 70px)" }}
      >
        <Logo height={131} color={colors.main[600]} width={211} />
        <div className="mt-[52px]">
          <h1 className="text-title1b  text-main-600">
            응모가 완료되었습니다!
          </h1>
          <div className="flex gap-24 items-center justify-center mt-32">
            <Share width={37} height={36} />
            <span className="text-body1r underline">
              친구들에게도 공유해주세요
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <form
      action={formAction}
      className={cn("flex mt-[32px] flex-col gap-[6.25rem]")}
    >
      <div>
        <SloganHeader />
        <div className={cn("flex flex-col mt-[3.5rem] gap-24")}>
          <CountLength length={sloganLength}>
            <Input
              onChange={(e) => setSloganLength(e.target.value.length)}
              max={100}
              name="slogan"
              label="슬로건 입력"
              placeholder="슬로건을 입력해주세요"
            />
          </CountLength>
          <CountLength length={descriptionLength} max={1000}>
            <Input
              onChange={(e) => setDescriptionLength(e.target.value.length)}
              max={1000}
              name="description"
              label="슬로건 설명"
              placeholder="슬로건 설명을 입력해주세요"
            />
          </CountLength>
          <div>
            <div className="relative">
              <Input
                name="school"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                label="학교"
                placeholder="학교를 입력해주세요"
              />
              <span
                className={cn(
                  "absolute top-4 right-0 mt-[2.5rem] mr-[1.25rem]"
                )}
              >
                <Search />
              </span>
            </div>

            {isSchoolFetched && schoolName !== "" && schoolList.length > 0 && (
              <div className="flex flex-col overflow-y-auto absolute bg-white w-full max-w-[708px] shadow-xl rounded mt-8">
                {schoolList
                  .filter((school) => school.SCHUL_NM !== schoolName)
                  .map((school, i) => (
                    <div key={school.SD_SCHUL_CODE}>
                      {i !== 0 && <div className="h-px bg-gray-100 mx-12" />}
                      <div
                        className="cursor-pointer p-16 hover:bg-gray-100 rounded"
                        onClick={() => setSchoolName(school.SCHUL_NM)}
                      >
                        {school.SCHUL_NM}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="flex gap-24">
            <Input
              name="grade"
              type="number"
              label="학년"
              placeholder="학년을 입력해주세요"
            />
            <Input
              name="class"
              type="number"
              label="반"
              placeholder="반을 입력해주세요"
            />
          </div>
          <Input
            name="phoneNumber"
            label="전화번호"
            placeholder="전화번호를 입력해주세요"
          />
        </div>
      </div>
      <Button type="submit">응모하기</Button>
    </form>
  );
}
