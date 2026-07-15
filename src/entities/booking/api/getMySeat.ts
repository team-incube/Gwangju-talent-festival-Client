import { Seat } from "../model/types";
import { fromApiSeat } from "../model/seatLayouts";
import { getTokenFromCookie } from "@/shared/utils/auth";
import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

interface MySeatApiResponse {
  seatSection: string;
  seatNumber: number;
}

type PerformerSeatsApiResponse = MySeatApiResponse[];

const toSeat = ({ seatSection, seatNumber }: MySeatApiResponse): Seat | null => {
  const seat = fromApiSeat(seatSection, seatNumber);
  return seat ? { ...seat, status: "selected" as const } : null;
};

export const getMySeats = async (): Promise<Seat[]> => {
  try {
    const response = await axios.get<PerformerSeatsApiResponse>("/seat/myself/performer");

    return response.data.map(toSeat).filter((seat): seat is Seat => seat !== null);
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError?.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : "내 좌석 정보를 가져올 수 없습니다.";
    throw new Error(errorMessage);
  }
};

export const getMySeat = async (): Promise<Seat | null> => {
  try {
    const role = getTokenFromCookie("role");

    const endpoint = role === "PERFORMER" ? "/seat/myself/performer" : "/seat/myself";

    const response = await axios.get<MySeatApiResponse | PerformerSeatsApiResponse>(endpoint);

    if (role === "PERFORMER") {
      const data = response.data as PerformerSeatsApiResponse;
      if (data.length === 0) {
        return null;
      }
      return toSeat(data[0]);
    } else {
      return toSeat(response.data as MySeatApiResponse);
    }
  } catch (error: unknown) {
    if (
      (error as AxiosError)?.response?.status === 404 ||
      (error as AxiosError)?.response?.status === 400
    ) {
      return null;
    }
    console.warn(error);
    return null;
  }
};
