import instance from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { EvaluationScoreKey } from "../model/score";

export const saveScore = async (teamId: number, scores: Record<EvaluationScoreKey, number>) => {
  try {
    return await instance.patch("/judge/" + teamId, scores);
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError?.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : "심사 실패했습니다.";
    throw new Error(errorMessage);
  }
};
