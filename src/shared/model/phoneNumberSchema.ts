import { z } from "zod";

export const phoneNumberSchema = z
  .string()
  .min(1, "전화번호를 입력해주세요.")
  .regex(
    /^01([0|1|6|7|8|9])([0-9]{4})([0-9]{4})$/,
    "올바른 전화번호 형식이 아닙니다."
  );
