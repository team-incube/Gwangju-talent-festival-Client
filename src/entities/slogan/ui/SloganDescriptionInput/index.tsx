import React from "react";
import CountLength from "../CountLength";
import Textarea from "../Textarea";

type SloganDescriptionInputProps = {
  value: string;
  length: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SloganDescriptionInput = ({ value, length, onChange }: SloganDescriptionInputProps) => {
  return (
    <CountLength length={length} max={1000}>
      <Textarea
        value={value}
        onChange={onChange}
        name="description"
        maxLength={1000}
        label="슬로건 설명"
        placeholder="슬로건 설명을 입력해주세요"
      />
    </CountLength>
  );
};

export default React.memo(SloganDescriptionInput); 