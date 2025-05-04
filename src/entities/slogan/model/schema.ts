import { phoneNumberSchema } from "@/shared/model/phoneNumberSchema";
import { z } from "zod";

export const sloganNameSchema = z
  .string()
  .min(1, "슬로건을 입력해주세요.")
  .max(100);

export const sloganDescriptionSchema = z
  .string()
  .min(1, "슬로건 설명을 입력해주세요.")
  .max(1000);

export const sloganSchema = z.object({
  slogan: sloganNameSchema,
  description: sloganDescriptionSchema,
  school: z.string().min(1),
  grade: z.string().min(1),
  class: z.string().min(1),
  phone: phoneNumberSchema,
});

export type SloganFormValues = z.infer<typeof sloganSchema>;
