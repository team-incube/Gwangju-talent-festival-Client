import React from "react";
import { Input } from "@/shared/ui";
import { SloganFormValues } from "../../model/schema";

type PersonalInfoInputsProps = {
  formValues: {
    name: string;
    grade: string;
    classroom: string;
    phone_number: string;
  };
  onFieldChange: (field: keyof SloganFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoInputs = ({ formValues, onFieldChange }: PersonalInfoInputsProps) => {
  return (
    <>
      <Input
        name="name"
        value={formValues.name}
        onChange={onFieldChange("name")}
        label="이름"
        placeholder="이름을 입력해주세요"
      />
      <div className="flex gap-24">
        <Input
          name="grade"
          type="number"
          value={formValues.grade}
          onChange={onFieldChange("grade")}
          label="학년"
          placeholder="학년을 입력해주세요"
        />
        <Input
          name="class"
          type="number"
          value={formValues.classroom}
          onChange={onFieldChange("classroom")}
          label="반"
          placeholder="반을 입력해주세요"
        />
      </div>
      <Input
        name="phone"
        value={formValues.phone_number}
        onChange={onFieldChange("phone_number")}
        label="전화번호"
        placeholder="전화번호를 입력해주세요"
      />
    </>
  );
};

export default React.memo(PersonalInfoInputs); 