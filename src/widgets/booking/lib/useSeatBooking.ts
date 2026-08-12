import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookSeatWithRetry } from "@/widgets/booking/lib/bookSeatWithRetry";
import { getMySeats } from "@/entities/booking/api/getMySeat";
import { Seat, formatSeatLabel } from "@/entities/booking/model/types";
import { useQueryClient } from "@tanstack/react-query";
import { seatQueryKeys, applySeatChange } from "@/entities/booking/lib/useSeatState";

// 재조회·SSE를 기다리지 않고 캐시를 먼저 갱신 — 예매 직후 좌석이 즉시 회색으로 전환된다
const markSeatsOccupied = (
  queryClient: ReturnType<typeof useQueryClient>,
  seats: Array<Omit<Seat, "status">>,
) => {
  seats.forEach(seat => {
    applySeatChange(queryClient, {
      seat_section: seat.section,
      seat_row: seat.row,
      seat_number: Number(seat.seatNumber),
      is_available: false,
    });
  });
};

export function useSeatBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Seat, "status">) => bookSeatWithRetry(data),
    onSuccess: (_result, vars) => {
      markSeatsOccupied(queryClient, [vars]);
      queryClient.invalidateQueries({ queryKey: seatQueryKeys.seatState(vars.section) });
      queryClient.invalidateQueries({ queryKey: ["mySeat"] });
      queryClient.invalidateQueries({ queryKey: ["mySeats"] });
    },
    onError: error => {
      console.error(error);
      toast.error(error.message ?? "알 수 없는 오류가 발생했습니다.");
    },
  });
}

export function useMultipleSeatBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    // 좌석을 동시에 요청하면 서버 rate limit(429)에 걸리므로 한 건씩 순차로 보내고, 429는 재시도한다
    mutationFn: async (seats: Array<Omit<Seat, "status">>) => {
      const failures: Array<{ seat: Omit<Seat, "status">; detail: string }> = [];

      for (const seat of seats) {
        try {
          await bookSeatWithRetry(seat);
        } catch (error) {
          const detail = error instanceof Error ? error.message : "예매에 실패했습니다.";
          failures.push({ seat, detail });
        }
      }

      // 429가 예매를 처리한 뒤에 떨어지는 경우가 있어 에러만 믿으면 성공을 실패로 알린다.
      // 실패로 잡힌 좌석은 서버 상태로 한 번 더 확인한다
      let unbooked = failures;
      if (failures.length > 0) {
        const bookedSeats = await getMySeats().catch(() => null);
        if (bookedSeats) {
          unbooked = failures.filter(
            ({ seat }) =>
              !bookedSeats.some(
                booked =>
                  booked.section === seat.section &&
                  booked.row === seat.row &&
                  booked.seatNumber === seat.seatNumber,
              ),
          );
        }
      }

      if (unbooked.length > 0) {
        const errorMessages = unbooked.map(({ seat, detail }) => `${formatSeatLabel(seat)} ${detail}`);
        throw new Error(`일부 좌석 예매에 실패했습니다: ${errorMessages.join(", ")}`);
      }

      return {
        success: true,
        message: `${seats.length}개 좌석이 성공적으로 예매되었습니다.`,
        bookedSeats: seats,
      };
    },
    onSuccess: (result, vars) => {
      markSeatsOccupied(queryClient, vars);

      const sections = [...new Set(vars.map(seat => seat.section))];
      sections.forEach(section => {
        queryClient.invalidateQueries({ queryKey: seatQueryKeys.seatState(section) });
      });

      queryClient.invalidateQueries({ queryKey: ["mySeat"] });
      queryClient.invalidateQueries({ queryKey: ["mySeats"] });

      toast.success(result.message);
    },
    // 일부만 실패해도 성공한 좌석은 이미 예매됐으므로 좌석 상태를 다시 불러온다
    onError: (error, vars) => {
      const sections = [...new Set(vars.map(seat => seat.section))];
      sections.forEach(section => {
        queryClient.invalidateQueries({ queryKey: seatQueryKeys.seatState(section) });
      });

      queryClient.invalidateQueries({ queryKey: ["mySeat"] });
      queryClient.invalidateQueries({ queryKey: ["mySeats"] });

      console.error(error);
      toast.error(error.message ?? "알 수 없는 오류가 발생했습니다.");
    },
  });
}
