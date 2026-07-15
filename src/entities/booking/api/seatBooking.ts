import { Seat } from "../model/types";
import { toApiSeat } from "../model/seatLayouts";
import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

export const seatBooking = async (data: Omit<Seat, "status">) => {
  try {
    const response = await axios.post("/seat", toApiSeat(data));

    return { data: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError?.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : "좌석 예매에 실패했습니다.";
    throw new Error(errorMessage);
  }
};
