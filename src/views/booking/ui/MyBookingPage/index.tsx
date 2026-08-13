"use client";

import { cn } from "@/shared/utils/cn";
import { SeatGrid } from "@/entities/booking/ui/SeatGrid";
import { BookingInfoDisplay } from "@/entities/booking/ui/BookingInfoDisplay";
import { useMyBookedSeats } from "@/entities/booking/lib/useMySeat";
import { toast } from "sonner";
import { stringifyError } from "next/dist/shared/lib/utils";
import BackHeader from "@/shared/ui/BackHeader";
import Button from "@/shared/ui/Button";
import { useCallback, useEffect, useRef } from "react";
import { cancelSeatBooking } from "@/entities/booking/api/cancelSeatBooking";
import { cancelPerformerSeats } from "@/entities/booking/api/cancelPerformerSeats";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Seat, formatSeatLabel } from "@/entities/booking/model/types";
import { MAX_PERFORMER_SEATS } from "@/widgets/booking/lib/usePerformerSeatSelection";

const MyBookingPage = () => {
  const { seats, isMultiple, isLoading, isFetching, error } = useMyBookedSeats();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isCancelingRef = useRef(false);
  const layout = null;

  const canSelectIndividualSeats = isMultiple && seats.length >= 2;
  // 참가자는 2석까지라 아직 여유가 있을 때만 추가 예매를 안내한다
  const canBookMore = isMultiple && !isLoading && seats.length < MAX_PERFORMER_SEATS;

  useEffect(() => {
    if (error) toast.error(stringifyError(error));
  }, [error]);

  // 재조회 중에는 예매 직전의 빈 캐시가 보이므로 결과가 확정된 뒤에만 판단한다
  useEffect(() => {
    if (!isLoading && !isFetching && seats.length === 0 && !isCancelingRef.current) {
      toast.error("예약된 좌석이 없습니다.");
      router.push("/booking");
    }
  }, [isLoading, isFetching, seats.length, router]);

  const handleIndividualSeatCancel = useCallback(
    async (seat: Seat) => {
      isCancelingRef.current = true;

      const originalSeats = seats;
      const updatedSeats = seats.filter(
        s =>
          !(s.section === seat.section && s.row === seat.row && s.seatNumber === seat.seatNumber),
      );

      queryClient.setQueryData(["mySeats"], updatedSeats);
      if (updatedSeats.length === 0) {
        queryClient.setQueryData(["mySeat"], null);
      }

      try {
        await cancelPerformerSeats([seat]);
        toast.success(`${formatSeatLabel(seat)} 좌석 예매가 취소되었습니다.`);

        queryClient.invalidateQueries({ queryKey: ["mySeat"] });
        queryClient.invalidateQueries({ queryKey: ["mySeats"] });

        if (updatedSeats.length === 0) {
          router.push("/home");
        }
      } catch (error) {
        queryClient.setQueryData(["mySeats"], originalSeats);
        if (originalSeats.length > 0) {
          queryClient.setQueryData(["mySeat"], originalSeats[0]);
        }

        toast.error(stringifyError(error as Error));
        isCancelingRef.current = false;
      }
    },
    [seats, router, queryClient],
  );

  const handleAllCancelClick = useCallback(async () => {
    isCancelingRef.current = true;

    const originalSeats = seats;

    queryClient.setQueryData(["mySeats"], []);
    queryClient.setQueryData(["mySeat"], null);

    try {
      if (isMultiple) {
        await cancelPerformerSeats(seats);
        toast.success(`${seats.length}개 좌석 예매가 취소되었습니다.`);
      } else {
        await cancelSeatBooking();
        toast.success("예매가 취소되었습니다.");
      }

      router.push("/home");

      queryClient.invalidateQueries({ queryKey: ["mySeat"] });
      queryClient.invalidateQueries({ queryKey: ["mySeats"] });
    } catch (error) {
      queryClient.setQueryData(["mySeats"], originalSeats);
      if (originalSeats.length > 0) {
        queryClient.setQueryData(["mySeat"], originalSeats[0]);
      }

      toast.error(stringifyError(error as Error));
      isCancelingRef.current = false;
    }
  }, [seats, isMultiple, router, queryClient]);

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-16 pb-32 space-y-24")}>
      <BackHeader text="좌석 예매" goto="/home" />
      <div className="w-full">
        <SeatGrid
          layout={layout}
          selectedSeat={null}
          onSeatSelect={() => {}}
          mySeat={isLoading ? null : seats[0]}
          myAllSeats={isMultiple ? seats : undefined}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <BookingInfoDisplay
          mySeat={!isMultiple ? seats[0] || null : null}
          mySeats={isMultiple ? seats : undefined}
          className="w-full"
        />
      </div>

      <div className="w-full space-y-12">
        <Button className="w-full h-[48px]" onClick={() => router.push("/home")}>
          예매 확정하기
        </Button>

        {canBookMore && (
          <Button
            variant="outline"
            className="w-full h-[48px]"
            onClick={() => router.push("/booking")}
          >
            좌석 추가로 예매하기
          </Button>
        )}

        {canSelectIndividualSeats ? (
          <>
            <div
              className={cn(
                "grid gap-12",
                seats.length === 2
                  ? "grid-cols-2"
                  : seats.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2",
              )}
            >
              {seats.map(seat => (
                <Button
                  key={`${seat.section}-${seat.row}-${seat.seatNumber}`}
                  variant="outline"
                  className="h-[40px] text-sm"
                  onClick={() => handleIndividualSeatCancel(seat)}
                  disabled={seats.length === 0}
                >
                  {formatSeatLabel(seat)} 취소
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full h-[48px]"
              onClick={handleAllCancelClick}
              disabled={seats.length === 0}
            >
              전체 {seats.length}개 좌석 취소
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="w-full h-[48px]"
            onClick={handleAllCancelClick}
            disabled={seats.length === 0}
          >
            예매 취소
          </Button>
        )}
      </div>
    </div>
  );
};

export default MyBookingPage;
