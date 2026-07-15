import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { seatBooking } from "@/entities/booking/api/seatBooking";
import { Seat, getSectionLabel } from "@/entities/booking/model/types";
import { useQueryClient } from "@tanstack/react-query";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";

export function useSeatBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Seat, "status">) => seatBooking(data),
    onSuccess: (_result, vars) => {
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
    mutationFn: async (seats: Array<Omit<Seat, "status">>) => {
      const bookingPromises = seats.map(seat => seatBooking(seat));
      const results = await Promise.allSettled(bookingPromises);

      const successful = results.filter(result => result.status === "fulfilled");
      const failed = results.filter(result => result.status === "rejected");

      if (failed.length > 0) {
        const errorMessages = failed
          .map((result, index) => {
            if (result.status === "rejected") {
              const seat = seats[index];
              return `${getSectionLabel(seat.section)}${seat.row}${seat.seatNumber} 좌석 예매 실패`;
            }
            return "";
          })
          .filter(Boolean);

        throw new Error(`일부 좌석 예매에 실패했습니다: ${errorMessages.join(", ")}`);
      }

      return {
        success: true,
        message: `${successful.length}개 좌석이 성공적으로 예매되었습니다.`,
        bookedSeats: seats,
      };
    },
    onSuccess: (result, vars) => {
      const sections = [...new Set(vars.map(seat => seat.section))];
      sections.forEach(section => {
        queryClient.invalidateQueries({ queryKey: seatQueryKeys.seatState(section) });
      });

      queryClient.invalidateQueries({ queryKey: ["mySeat"] });
      queryClient.invalidateQueries({ queryKey: ["mySeats"] });

      toast.success(result.message);
    },
    onError: error => {
      console.error(error);
      toast.error(error.message ?? "알 수 없는 오류가 발생했습니다.");
    },
  });
}
