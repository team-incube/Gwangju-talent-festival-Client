import instance from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { TeamOrderItem } from "../model/types";

export const updateTeamOrder = async (orderItems: TeamOrderItem[]) => {
  try {
    return await instance.patch("/team/order", { orderItems });
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError?.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : "팀 순서 변경에 실패했습니다.";
    throw new Error(errorMessage);
  }
};
