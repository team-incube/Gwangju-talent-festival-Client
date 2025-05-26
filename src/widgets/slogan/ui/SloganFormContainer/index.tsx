"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

export default function SloganFormContainer() {
  const [sloganLength, setSloganLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [formValues, setFormValues] = useState<SloganFormValues>({
    slogan: "",
    description: "",
    school: "",
    grade: "",
    name: "",
    classroom: "",
    phone_number: "",
  });
  const [state, setState] = useState({
    isValid: false,
    isSubmitted: false,
    isSubmitting: false,
  });

  const isValid = useMemo(() => {
    return sloganSchema.safeParse(formValues).success;
  }, [formValues]);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      isValid,
    }));
  }, [isValid]);

  const handleSloganChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSloganLength(value.length);
    setFormValues(prev => ({ ...prev, slogan: value }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescriptionLength(value.length);
    setFormValues(prev => ({ ...prev, description: value }));
  }, []);

  const handleFieldChange = useCallback((field: keyof SloganFormValues) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues(prev => ({ ...prev, [field]: e.target.value }));
    }, []);

  const handleSchoolSelect = useCallback((schoolName: string) => {
    setFormValues(prev => ({ ...prev, school: schoolName }));
  }, []);

  const debouncedSchoolName = useDebounce<string>(formValues.school, 400);
  const { data: schoolData, isSuccess: isSchoolFetched } = useGetSchool(debouncedSchoolName);
  
  const schoolList = useMemo(() => 
    schoolData?.schoolInfo?.length === 2 ? schoolData.schoolInfo[1].row : [],
    [schoolData]
  );

  const filteredSchools = useMemo(() => 
    schoolList.filter(school => school.SCHUL_NM !== formValues.school),
    [schoolList, formValues.school]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prevState => ({ ...prevState, isSubmitting: true }));
    try {
      const res = await handleSloganFormSubmit(formValues);
      setState(prevState => ({ ...prevState, isSubmitted: res, isSubmitting: false }));
    } catch (error) {
      setState(prevState => ({ ...prevState, isSubmitting: false }));
    }
  }, [formValues]);

  if (state.isSubmitted) {
    return <SloganFormSuccess />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex px-12 mt-[32px] flex-col pb-5 gap-[6.25rem]")}
    >
      <div>
        <SloganHeader />
        <div className={cn("flex flex-col mt-[3.5rem] gap-24")}>
          <CountLength length={sloganLength}>
            <Input
              value={formValues.slogan}
              onChange={handleSloganChange}
              max={100}
              name="slogan"
              label="슬로건 입력"
              placeholder="슬로건을 입력해주세요"
            />
          </CountLength>
          <CountLength length={descriptionLength} max={1000}>
            <Textarea
              value={formValues.description}
              onChange={handleDescriptionChange}
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
                onChange={handleFieldChange("school")}
                label="학교"
                placeholder="학교를 입력해주세요"
              />
              <span className={cn("absolute top-4 right-0 mt-[2.5rem] mr-[1.25rem]")}>
                <Search />
              </span>
            </div>
            {isSchoolFetched && formValues.school !== "" && filteredSchools.length > 0 && (
              <div className="flex flex-col overflow-y-auto absolute bg-white w-full max-w-[708px] shadow-xl rounded mt-8">
                {filteredSchools.map((school, i) => (
                  <div key={school.SD_SCHUL_CODE}>
                    {i !== 0 && <div className="h-px bg-gray-100 mx-12" />}
                    <div
                      className="cursor-pointer p-16 hover:bg-gray-100 rounded"
                      onClick={() =>
                        handleSchoolSelect(school.SCHUL_NM)
                      }
                    >
                      {school.SCHUL_NM}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Input
            name="name"
            value={formValues.name}
            onChange={handleFieldChange("name")}
            label="이름"
            placeholder="이름을 입력해주세요"
          />
          <div className="flex gap-24">
            <Input
              name="grade"
              type="number"
              value={formValues.grade}
              onChange={handleFieldChange("grade")}
              label="학년"
              placeholder="학년을 입력해주세요"
            />
            <Input
              name="class"
              type="number"
              value={formValues.classroom}
              onChange={handleFieldChange("classroom")}
              label="반"
              placeholder="반을 입력해주세요"
            />
          </div>
          <Input
            name="phone"
            value={formValues.phone_number}
            onChange={handleFieldChange("phone_number")}
            label="전화번호"
            placeholder="전화번호를 입력해주세요"
          />
        </div>
      </div>
      <Button type="submit" isDisabled={!state.isValid || state.isSubmitting}>
        응모하기
      </Button>
    </form>
  );
}
