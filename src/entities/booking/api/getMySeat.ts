import { Seat, Section } from "../model/types";
import { getTokenFromCookie } from "@/shared/utils/auth";
import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

interface MySeatApiResponse {
  seat_section: string;
  seat_row: string;
  seat_number: number;
}

type PerformerSeatsApiResponse = MySeatApiResponse[];

export const getMySeats = async (): Promise<Seat[]> => {
  try {
    const response = await axios.get<PerformerSeatsApiResponse>("/api/seat/myself/performer");

    return response.data.map(({ seat_section, seat_row, seat_number }) => ({
      section: seat_section as Section,
      row: seat_row,
      seatNumber: seat_number.toString(),
      status: "selected" as const,
    }));
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

    const endpoint = role === "PERFORMER" ? "/api/seat/myself/performer" : "/api/seat/myself";

    const response = await axios.get<MySeatApiResponse | PerformerSeatsApiResponse>(endpoint);

    if (role === "PERFORMER") {
      const data = response.data as PerformerSeatsApiResponse;
      if (data.length === 0) {
        return null;
      }
      const { seat_section, seat_row, seat_number } = data[0];
      return {
        section: seat_section as Section,
        row: seat_row,
        seatNumber: seat_number.toString(),
        status: "selected" as const,
      };
    } else {
      const data = response.data as MySeatApiResponse;
      const { seat_section, seat_row, seat_number } = data;

      return {
        section: seat_section as Section,
        row: seat_row,
        seatNumber: seat_number.toString(),
        status: "selected" as const,
      };
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
