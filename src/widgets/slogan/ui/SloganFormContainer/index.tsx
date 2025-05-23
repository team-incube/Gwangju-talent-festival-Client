"use client";

import { useState, useEffect } from "react";
import Search from "@/shared/asset/svg/Search";
import { cn } from "@/shared/utils/cn";
import { handleSloganFormSubmit } from "@/entities/slogan/lib/handleSloganFormSubmit";
import { Button, Input } from "@/shared/ui";
import CountLength from "@/entities/slogan/ui/CountLength";
import { useDebounce } from "@/entities/slogan/lib/useDebounce";
import { useGetSchool } from "@/entities/slogan/api/useGetSchool";
import SloganHeader from "@/entities/slogan/ui/SloganHeader";
import { SloganFormValues, sloganSchema } from "@/entities/slogan/model/schema";
import SloganFormSuccess from "@/entities/slogan/ui/SloganFormSuccess";
import Textarea from "@/entities/slogan/ui/Textarea";
import ComingSoon from "@/shared/ui/ComingSoon";
import { isShow } from "@/shared/lib/show";

export default function SloganFormContainer() {
  const [sloganLength, setSloganLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [formValues, setFormValues] = useState<SloganFormValues>({
    slogan: "",
    description: "",
    school: "",
    grade: "",
    class_num: "",
    phone_number: "",
  });
  const [state, setState] = useState({
    isValid: false,
    isSubmitted: false,
  });

  useEffect(() => {
    const isValid = sloganSchema.safeParse(formValues);
    setState(prevState => ({
      ...prevState,
      isValid: isValid.success,
    }));
  }, [formValues]);

  const debouncedSchoolName = useDebounce<string>(formValues.school, 400);
  const { data: schoolData, isSuccess: isSchoolFetched } = useGetSchool(debouncedSchoolName);
  const schoolList = schoolData?.schoolInfo?.length === 2 ? schoolData.schoolInfo[1].row : [];
  if (isShow("slogan")) {
    return <ComingSoon />;
  }
  if (state.isSubmitted) {
    return <SloganFormSuccess />;
  }
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        const res = await handleSloganFormSubmit(formValues);
        setState({ ...state, isSubmitted: res });
      }}
      className={cn("flex px-12 mt-[32px] flex-col pb-5 gap-[6.25rem]")}
    >
      <div>
        <SloganHeader />
        <div className={cn("flex flex-col mt-[3.5rem] gap-24")}>
          <CountLength length={sloganLength}>
            <Input
              value={formValues.slogan}
              onChange={e => {
                const value = e.target.value;
                setSloganLength(value.length);
                setFormValues({ ...formValues, slogan: value });
              }}
              max={100}
              name="slogan"
              label="슬로건 입력"
              placeholder="슬로건을 입력해주세요"
            />
          </CountLength>
          <CountLength length={descriptionLength} max={1000}>
            <Textarea
              value={formValues.description}
              onChange={e => {
                const value = e.target.value;
                setDescriptionLength(value.length);
                setFormValues({ ...formValues, description: value });
              }}
              name="description"
              maxLength={1000}
              label="슬로건 설명"
              placeholder="슬로건 설명을 입력해주세요"
            />
          </CountLength>
          <div>
            <div className="relative">
              <Input
                name="school"
                value={formValues.school}
                onChange={e => setFormValues({ ...formValues, school: e.target.value })}
                label="학교"
                placeholder="학교를 입력해주세요"
              />
              <span className={cn("absolute top-4 right-0 mt-[2.5rem] mr-[1.25rem]")}>
                <Search />
              </span>
            </div>
            {isSchoolFetched && formValues.school !== "" && schoolList.length > 0 && (
              <div className="flex flex-col overflow-y-auto absolute bg-white w-full max-w-[708px] shadow-xl rounded mt-8">
                {schoolList
                  .filter(school => school.SCHUL_NM !== formValues.school)
                  .map((school, i) => (
                    <div key={school.SD_SCHUL_CODE}>
                      {i !== 0 && <div className="h-px bg-gray-100 mx-12" />}
                      <div
                        className="cursor-pointer p-16 hover:bg-gray-100 rounded"
                        onClick={() =>
                          setFormValues({
                            ...formValues,
                            school: school.SCHUL_NM,
                          })
                        }
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
              value={formValues.grade}
              onChange={e => setFormValues({ ...formValues, grade: e.target.value })}
              label="학년"
              placeholder="학년을 입력해주세요"
            />
            <Input
              name="class"
              type="number"
              value={formValues.class_num}
              onChange={e => setFormValues({ ...formValues, class_num: e.target.value })}
              label="반"
              placeholder="반을 입력해주세요"
            />
          </div>
          <Input
            name="phone"
            value={formValues.phone_number}
            onChange={e => setFormValues({ ...formValues, phone_number: e.target.value })}
            label="전화번호"
            placeholder="전화번호를 입력해주세요"
          />
        </div>
      </div>
      <Button type="submit" isDisabled={!state.isValid}>
        응모하기
      </Button>
    </form>
  );
}
