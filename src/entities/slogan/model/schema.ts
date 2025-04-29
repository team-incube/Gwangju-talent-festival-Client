import { phoneNumberSchema } from "@/shared/model/phoneNumberSchema";
import { z } from "zod";

export const sloganNameSchema = z
  .string()
  .min(1, "슬로건을 입력해주세요.")
  .max(100, "슬로건은 최대 100자까지 가능합니다.");

export const sloganDescriptionSchema = z
  .string()
  .min(1, "슬로건 설명을 입력해주세요.")
  .max(1000, "슬로건 설명은 최대 1000자까지 가능합니다.");

export const sloganSchema = z.object({
  slogan: sloganNameSchema,
  description: sloganDescriptionSchema,
  school: z.string().min(1, "학교를 선택해주세요."),
  grade: z.string().min(1, "학년을 선택해주세요."),
  class: z.string().min(1, "반을 선택해주세요."),
  phoneNumber: phoneNumberSchema,
});

export type SloganFormValues = z.infer<typeof sloganSchema>;
