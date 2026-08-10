import instance from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { PerformerVerifyRequest, SignInResponse } from "../model/schema";

export const verifyPerformer = async (
  data: PerformerVerifyRequest,
): Promise<SignInResponse> => {
  try {
    const response = await instance.post("/performer/verify", data);

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError?.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : "출연진 인증에 실패했습니다.";
    throw new Error(errorMessage);
  }
};
