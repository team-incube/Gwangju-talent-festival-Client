import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

export const cancelSeatBooking = async () => {
  try {
    const response = await axios.delete("/seat");

    return { data: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError?.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : "좌석 취소에 실패했습니다.";
    throw new Error(errorMessage);
  }
};
