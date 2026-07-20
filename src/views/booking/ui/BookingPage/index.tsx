"use client";

import { useCallback, useState, useEffect } from "react";
import SelectSection from "@/widgets/booking/ui/SelectSection";
import SeatSection from "@/widgets/booking/ui/SeatSection";
import Button from "@/shared/ui/Button";
import BackHeader from "@/shared/ui/BackHeader";
import { useSeatSelection } from "@/widgets/booking/lib/useSeatSelection";
import { usePerformerSeatSelection } from "@/widgets/booking/lib/usePerformerSeatSelection";
import { SectionType, Seat, SeatChangeEvent, SEAT_STATUS } from "@/entities/booking/model/types";
import { useSeatBooking, useMultipleSeatBooking } from "@/widgets/booking/lib/useSeatBooking";
import { useAdminSeatBan } from "@/widgets/booking/lib/useAdminSeatBan";
import { useSeatChangeSSE } from "@/entities/booking/lib/useSeatChangeSSE";
import { applySeatChange } from "@/entities/booking/lib/useSeatState";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/shared/utils/auth";
import { useMyBookedSeats } from "@/entities/booking/lib/useMySeat";

const BookingPage = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const { seats: myBookedSeats } = useMyBookedSeats();

  const isAdmin = userRole === "ADMIN";
  const isPerformer = userRole === "PERFORMER";

  const {
    selectedSection,
    selectedSeat,
    selectedSeatInfo,
    setSelectedSection,
    selectSeat,
    isComplete,
  } = useSeatSelection({ allowOccupied: isAdmin });

  const {
    selectedSection: performerSelectedSection,
    selectedSeats,
    setSelectedSection: setPerformerSelectedSection,
    selectSeat: selectPerformerSeat,
    isSeatSelected,
    canBook,
    maxSelectableSeats,
    removeOccupiedSeat,
  } = usePerformerSeatSelection(myBookedSeats?.length || 0);

  const seatBookingMutation = useSeatBooking();
  const multipleSeatBookingMutation = useMultipleSeatBooking();
  const { ban: seatBanMutation, unban: seatUnbanMutation } = useAdminSeatBan();

  useEffect(() => {
    const role = getTokenFromCookie("role");
    setUserRole(role);
  }, []);

  const queryClient = useQueryClient();

  // 백엔드가 유저당 SSE 연결을 1개만 유지하므로 페이지에서 연결 하나만 열고 공용 처리
  const handleSeatChange = useCallback(
    (event: SeatChangeEvent) => {
      applySeatChange(queryClient, event);
      if (!event.is_available && isPerformer) {
        removeOccupiedSeat(event.seat_section, event.seat_row, event.seat_number.toString());
      }
    },
    [queryClient, isPerformer, removeOccupiedSeat],
  );

  useSeatChangeSSE({ onSeatChange: handleSeatChange });

  const handleSectionSelect = useCallback(
    (section: SectionType) => {
      if (isPerformer) {
        setPerformerSelectedSection(section);
      } else {
        setSelectedSection(section);
      }
    },
    [isPerformer, setPerformerSelectedSection, setSelectedSection],
  );

  const handleSeatSelect = useCallback(
    (seat: Seat | null) => {
      if (seat) {
        if (isPerformer) {
          selectPerformerSeat(seat);
        } else {
          selectSeat(seat);
        }
      }
    },
    [isPerformer, selectPerformerSeat, selectSeat],
  );

  const handleBanClick = useCallback(() => {
    if (!isComplete || !selectedSeat) return;

    const seat = selectedSeat;
    const mutation = seat.status === SEAT_STATUS.OCCUPIED ? seatUnbanMutation : seatBanMutation;
    mutation.mutate(seat, {
      onSuccess: () => selectSeat(seat),
    });
  }, [isComplete, selectedSeat, seatBanMutation, seatUnbanMutation, selectSeat]);

  const handleBookingClick = useCallback(() => {
    if (isPerformer) {
      if (canBook && selectedSeats.length > 0) {
        multipleSeatBookingMutation.mutate(selectedSeats, {
          onSuccess: () => router.push("/booking/my"),
        });
      }
    } else {
      if (isComplete && selectedSeatInfo) {
        seatBookingMutation.mutate(
          {
            section: selectedSeatInfo.seat.section,
            row: selectedSeatInfo.seat.row,
            seatNumber: selectedSeatInfo.seat.seatNumber,
          },
          {
            onSuccess: () => {
              toast.success("예매가 완료되었습니다.");
              router.push("/booking/my");
            },
          },
        );
      }
    }
  }, [
    isPerformer,
    canBook,
    selectedSeats,
    multipleSeatBookingMutation,
    isComplete,
    selectedSeatInfo,
    seatBookingMutation,
    router,
  ]);

  const isSelectedSeatOccupied = selectedSeat?.status === SEAT_STATUS.OCCUPIED;

  const getBanButtonText = () => {
    if (seatBanMutation.isPending || seatUnbanMutation.isPending) {
      return "처리 중...";
    }
    if (!selectedSeat) {
      return "좌석을 선택해주세요";
    }
    return isSelectedSeatOccupied ? "밴 해제하기" : "밴하기";
  };

  const getButtonText = () => {
    if (isPerformer) {
      if (multipleSeatBookingMutation.isPending) {
        return "예매 중...";
      }
      if (!performerSelectedSection) {
        return "구역을 선택해주세요";
      }
      if (selectedSeats.length === 0) {
        const remainingSlots = maxSelectableSeats;
        if (remainingSlots === 0) {
          return "최대 예매 가능 좌석 수 도달";
        }
        return `좌석을 선택해주세요 (최대 ${remainingSlots}개 추가 가능)`;
      }
      return `${selectedSeats.length}개 좌석 예매하기`;
    } else {
      if (seatBookingMutation.isPending) {
        return "예매 중...";
      }
      if (!selectedSection) {
        return "구역을 선택해주세요";
      }
      if (!selectedSeat) {
        return "좌석을 선택해주세요";
      }
      return "예매하기";
    }
  };

  return (
    <main className="w-full max-w-[480px] mx-auto min-h-screen bg-white flex flex-col">
      <div className="px-4">
        <BackHeader goto="/home" text="예매하기" />
      </div>

      <div className="flex flex-col p-4 pt-8 gap-8">
        <div>
          <SelectSection
            selectedSection={isPerformer ? performerSelectedSection : selectedSection}
            onSectionSelect={handleSectionSelect}
          />
        </div>
        <div>
          <SeatSection
            selectedSection={isPerformer ? performerSelectedSection : selectedSection}
            selectedSeat={isPerformer ? null : selectedSeat}
            onSeatSelect={handleSeatSelect}
            selectedSeatInfo={isPerformer ? null : selectedSeatInfo}
            selectedSeats={isPerformer ? selectedSeats : undefined}
            isSeatSelected={isPerformer ? isSeatSelected : undefined}
            isPerformerMode={isPerformer}
            myBookedSeats={myBookedSeats}
            allowOccupiedSelect={isAdmin}
          />
        </div>
        <div className="pb-4">
          <div className={`w-full ${isAdmin ? "flex gap-2" : ""}`}>
            <Button
              className={`h-[48px] ${isAdmin ? "flex-1" : "w-full"}`}
              onClick={handleBookingClick}
              disabled={
                isPerformer
                  ? !canBook || maxSelectableSeats === 0
                  : !isComplete || isSelectedSeatOccupied
              }
            >
              {getButtonText()}
            </Button>
            {isAdmin && (
              <Button className="flex-1 h-[48px]" onClick={handleBanClick} disabled={!isComplete}>
                {getBanButtonText()}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingPage;
