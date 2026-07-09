import { Seat } from "../model/types";
import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

export const cancelPerformerSeats = async (seats: Seat[]) => {
  try {
    const cancelPromises = seats.map(seat =>
      axios.delete("/api/seat/performer", {
        data: {
          seat_section: seat.section,
          seat_row: seat.row,
          seat_number: seat.seatNumber,
        },
      }),
    );

    const results = await Promise.allSettled(cancelPromises);

    const successful = results.filter(result => result.status === "fulfilled");
    const failed = results.filter(result => result.status === "rejected");

    if (failed.length > 0) {
      const errorMessages = failed
        .map((result, index) => {
          if (result.status === "rejected") {
            const seat = seats[index];
            return `${seat.section}-${seat.seatNumber} 좌석 취소 실패`;
          }
          return "";
        })
        .filter(Boolean);

      throw new Error(`일부 좌석 취소에 실패했습니다: ${errorMessages.join(", ")}`);
    }

    const responses = (successful as PromiseFulfilledResult<{ data: Seat }>[]).map(
      result => result.value.data,
    );

    return {
      data: responses,
      message: `${seats.length}개 좌석이 성공적으로 취소되었습니다.`,
    };
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
