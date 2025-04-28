"use client";

import Search from "@/shared/asset/svg/Search";
import { cn } from "@/shared/utils/cn";
import { useFormState } from "react-dom";
import { SloganFormState } from "@/entities/slogan/model/sloganFormState";
import { handleSloganFormSubmit } from "@/entities/slogan/lib/handleSloganFormSubmit";
import { Button, Input } from "@/shared/ui";
import CountLength from "@/entities/slogan/ui/CountLength";
import { useActionState } from "react";

export default function SloganFormContainer() {
  const initialState: SloganFormState = {
    values: {
      slogan: "",
      description: "",
      school: "",
      grade: "",
      class: "",
      phoneNumber: "",
    },
    isValid: false,
    submitted: false,
  };

  const formAction = useActionState(handleSloganFormSubmit, initialState)[1];

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-[6.25rem] mt-[3.5rem]")}
    >
      <div className={cn("flex flex-col gap-24")}>
        <CountLength>
          <Input
            max={100}
            name="slogan"
            label="슬로건 입력"
            placeholder="슬로건을 입력해주세요"
          />
        </CountLength>
        <CountLength>
          <Input
            max={1000}
            name="description"
            label="슬로건 설명"
            placeholder="슬로건 설명을 입력해주세요"
          />
        </CountLength>
        <div className={cn("relative")}>
          <Input name="school" label="학교" placeholder="학교를 입력해주세요" />
          <span
            className={cn("absolute top-4 right-0 mt-[2.5rem] mr-[1.25rem]")}
          >
            <Search />
          </span>
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
      <Button type="submit">응모하기</Button>
    </form>
  );
}
