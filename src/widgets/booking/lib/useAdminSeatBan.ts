import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { banSeat, cancelSeatBan } from "@/entities/booking/api/banSeat";
import { Seat, formatSeatLabel } from "@/entities/booking/model/types";
import { applySeatChange } from "@/entities/booking/lib/useSeatState";

export function useAdminSeatBan() {
  const queryClient = useQueryClient();

  // 재조회 대신 캐시 직접 갱신 — 백엔드 조회 응답에 밴 상태가 늦게 반영돼도
  // 화면에서는 즉시 회색/흰색으로 전환된다
  const setSeatAvailability = (seat: Omit<Seat, "status">, isAvailable: boolean) => {
    applySeatChange(queryClient, {
      seat_section: seat.section,
      seat_row: seat.row,
      seat_number: Number(seat.seatNumber),
      is_available: isAvailable,
    });
  };

  const ban = useMutation({
    mutationFn: (seat: Omit<Seat, "status">) => banSeat(seat),
    onSuccess: (_result, seat) => {
      setSeatAvailability(seat, false);
      toast.success(`${formatSeatLabel(seat)} 좌석을 밴했습니다.`);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "좌석 밴에 실패했습니다.");
    },
  });

  const unban = useMutation({
    mutationFn: (seat: Omit<Seat, "status">) => cancelSeatBan(seat),
    onSuccess: (_result, seat) => {
      setSeatAvailability(seat, true);
      toast.success(`${formatSeatLabel(seat)} 좌석 밴을 해제했습니다.`);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "좌석 밴 해제에 실패했습니다.");
    },
  });

  return { ban, unban };
}
