import React from "react";
import { Input } from "@/shared/ui";
import CountLength from "../CountLength";

type SloganInputProps = {
  value: string;
  length: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SloganInput = ({ value, length, onChange }: SloganInputProps) => {
  return (
    <CountLength length={length}>
      <Input
        value={value}
        onChange={onChange}
        max={100}
        name="slogan"
        label="슬로건 입력"
        placeholder="슬로건을 입력해주세요"
      />
    </CountLength>
  );
};

export default React.memo(SloganInput); 