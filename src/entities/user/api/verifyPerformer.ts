import instance from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { PerformerVerifyRequest, SignInResponse } from "../model/schema";

export const verifyPerformer = async (data: PerformerVerifyRequest): Promise<SignInResponse> => {
  try {
    return (await instance.post("/performer/verify", data)).data;
  } catch (error) {
    const message = (error as AxiosError<{ message?: string }>).response?.data?.message;
    throw new Error(message || "참가자 인증에 실패했습니다.");
  }
};
