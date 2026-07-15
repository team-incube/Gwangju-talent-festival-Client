import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { banSeat, cancelSeatBan } from "@/entities/booking/api/banSeat";
import { Seat, formatSeatLabel } from "@/entities/booking/model/types";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";

export function useAdminSeatBan() {
  const queryClient = useQueryClient();

  const invalidateSeat = (seat: Pick<Seat, "section">) => {
    queryClient.invalidateQueries({ queryKey: seatQueryKeys.seatState(seat.section) });
    queryClient.invalidateQueries({ queryKey: ["allSectionsSeatState"] });
  };

  const ban = useMutation({
    mutationFn: (seat: Omit<Seat, "status">) => banSeat(seat),
    onSuccess: (_result, seat) => {
      invalidateSeat(seat);
      toast.success(`${formatSeatLabel(seat)} 좌석을 밴했습니다.`);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "좌석 밴에 실패했습니다.");
    },
  });

  const unban = useMutation({
    mutationFn: (seat: Omit<Seat, "status">) => cancelSeatBan(seat),
    onSuccess: (_result, seat) => {
      invalidateSeat(seat);
      toast.success(`${formatSeatLabel(seat)} 좌석 밴을 해제했습니다.`);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "좌석 밴 해제에 실패했습니다.");
    },
  });

  return { ban, unban };
}
