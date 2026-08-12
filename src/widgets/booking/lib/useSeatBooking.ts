import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookSeatWithRetry, bookSeatsBulkWithRetry } from "@/widgets/booking/lib/bookSeatWithRetry";
import { Seat } from "@/entities/booking/model/types";
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

  const revalidateSeats = (seats: Array<Omit<Seat, "status">>) => {
    [...new Set(seats.map(seat => seat.section))].forEach(section => {
      queryClient.invalidateQueries({ queryKey: seatQueryKeys.seatState(section) });
    });
    queryClient.invalidateQueries({ queryKey: ["allSectionsSeatState"] });
    queryClient.invalidateQueries({ queryKey: ["mySeat"] });
    queryClient.invalidateQueries({ queryKey: ["mySeats"] });
  };

  return useMutation({
    // 서버가 좌석 전체를 한 트랜잭션으로 처리하므로 부분 성공이 없다 — 요청도 한 번만 보낸다
    mutationFn: (seats: Array<Omit<Seat, "status">>) => bookSeatsBulkWithRetry(seats),
    onSuccess: (_result, seats) => {
      markSeatsOccupied(queryClient, seats);
      revalidateSeats(seats);

      toast.success(`${seats.length}개 좌석이 성공적으로 예매되었습니다.`);
    },
    // 전부 실패했더라도 다른 사용자가 좌석을 채웠을 수 있으니 서버 좌석 현황을 다시 불러온다
    onError: (error, seats) => {
      revalidateSeats(seats);

      console.error(error);
      toast.error(error.message ?? "알 수 없는 오류가 발생했습니다.");
    },
  });
}
