import { Seat } from "../model/types";
import { toApiSeat } from "../model/seatLayouts";
import { getTokenFromCookie } from "@/shared/utils/auth";
import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

export type SeatBanError = Error & { status?: number };

const toSeatBanError = (error: unknown, fallback: string): SeatBanError => {
  const axiosError = error as AxiosError;
  const message =
    axiosError?.response?.data &&
    typeof axiosError.response.data === "object" &&
    "message" in axiosError.response.data
      ? (axiosError.response.data as { message: string }).message
      : fallback;
  return Object.assign(new Error(message), { status: axiosError?.response?.status });
};

export const banSeat = async (seat: Pick<Seat, "section" | "row" | "seatNumber">) => {
  try {
    const role = getTokenFromCookie("role") || "USER";
    const response = await axios.post("/seat/ban", { ...toApiSeat(seat), role });
    return { data: response.data };
  } catch (error: unknown) {
    throw toSeatBanError(error, "좌석 임시 저장에 실패했습니다.");
  }
};

export const cancelSeatBan = async (seat: Pick<Seat, "section" | "row" | "seatNumber">) => {
  try {
    const response = await axios.delete("/seat/ban", { data: toApiSeat(seat) });
    return { data: response.data };
  } catch (error: unknown) {
    throw toSeatBanError(error, "좌석 임시 저장 해제에 실패했습니다.");
  }
};
