import { phoneNumberSchema } from "@/shared/model/phoneNumberSchema";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
  .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, "비밀번호는 영문과 숫자를 포함해야 합니다.");

export const verificationCodeSchema = z
  .string()
  .min(1, "인증번호를 입력해주세요.")
  .length(6, "인증번호는 6자리여야 합니다.");

export const signinSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  phoneNumber: phoneNumberSchema,
  verificationCode: verificationCodeSchema,
  password: passwordSchema,
  passwordConfirm: passwordSchema,
});

export const phoneVerificationRequestSchema = z.object({
  phoneNumber: phoneNumberSchema,
});

export const performerVerifySchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  code: z.string().trim().min(1, "인증코드를 입력해주세요."),
});

export interface SignInRequest {
  phoneNumber: string;
  password: string;
}

export type Role = "USER" | "ADMIN" | "JUDGE" | "PERFORMER";

export interface SignInResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  role: Role;
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface SignUpRequest {
  phoneNumber: string;
  code: string;
  password: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type PerformerVerifyRequest = z.infer<typeof performerVerifySchema>;

export type SignInFormValues = z.infer<typeof signinSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type PhoneVerificationRequestValues = z.infer<typeof phoneVerificationRequestSchema>;
