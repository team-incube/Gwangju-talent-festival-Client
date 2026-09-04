import { Seat } from "../model/types";
import { fromApiSeat } from "../model/seatLayouts";
import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

interface SearchSeatApiResponse {
  seatSection: string;
  seatNumber: number;
}

const ERROR_MESSAGE_BY_STATUS: Record<number, string> = {
  400: "올바른 전화번호 형식이 아닙니다.",
  401: "로그인이 만료되었습니다. 다시 로그인해주세요.",
  403: "조회 권한이 없습니다.",
  404: "해당 전화번호로 예매한 좌석이 없습니다.",
};

export const searchSeatsByPhone = async (phoneNumber: string): Promise<Seat[]> => {
  try {
    const response = await axios.get<SearchSeatApiResponse[]>("/seat/search", {
      params: { phoneNumber },
    });

    const seats = response.data
      .map(({ seatSection, seatNumber }) => fromApiSeat(seatSection, seatNumber))
      .filter((seat): seat is Seat => seat !== null)
      .map(seat => ({ ...seat, status: "selected" as const }));

    // 변환 실패한 좌석이 조용히 사라지면 "예매 없음"으로 오인된다
    if (seats.length !== response.data.length) {
      console.warn("좌석 좌표로 변환하지 못한 응답이 있습니다", response.data);
    }

    return seats;
  } catch (error: unknown) {
    const status = (error as AxiosError)?.response?.status;
    throw new Error(
      (status && ERROR_MESSAGE_BY_STATUS[status]) || "좌석 조회에 실패했습니다.",
    );
  }
};
