import { phoneNumberSchema } from "@/shared/model/phoneNumberSchema";
import { z } from "zod";

export const sloganNameSchema = z.string().min(1, "슬로건을 입력해주세요.").max(100);

export const sloganDescriptionSchema = z.string().min(1, "슬로건 설명을 입력해주세요.").max(1000);

export const gradeSchema = z
  .string()
  .min(1)
  .regex(/^\d+$/, "학년은 숫자만 입력할 수 있습니다.");

export const classroomSchema = z
  .string()
  .min(1)
  .regex(/^\d+$/, "반은 숫자만 입력할 수 있습니다.");

export const sloganSchema = z.object({
  slogan: sloganNameSchema,
  description: sloganDescriptionSchema,
  school: z.string().min(1),
  name: z.string().min(1),
  grade: gradeSchema,
  classroom: classroomSchema,
  phone_number: phoneNumberSchema,
});

export type SloganFormValues = z.infer<typeof sloganSchema>;
