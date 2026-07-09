"use client";

import { useCallback, useState, useEffect } from "react";
import SelectSection from "@/widgets/booking/ui/SelectSection";
import SeatSection from "@/widgets/booking/ui/SeatSection";
import Button from "@/shared/ui/Button";
import BackHeader from "@/shared/ui/BackHeader";
import { useSeatSelection } from "@/widgets/booking/lib/useSeatSelection";
import { usePerformerSeatSelection } from "@/widgets/booking/lib/usePerformerSeatSelection";
import { SectionType, Seat } from "@/entities/booking/model/types";
import { useSeatBooking, useMultipleSeatBooking } from "@/widgets/booking/lib/useSeatBooking";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/shared/utils/auth";
import { useMyBookedSeats } from "@/entities/booking/lib/useMySeat";

const BookingPage = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const { seats: myBookedSeats } = useMyBookedSeats();

  const {
    selectedSection,
    selectedSeat,
    selectedSeatInfo,
    setSelectedSection,
    selectSeat,
    isComplete,
  } = useSeatSelection();

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

  useEffect(() => {
    const role = getTokenFromCookie("role");
    setUserRole(role);
  }, []);

  const isPerformer = userRole === "PERFORMER";
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

  const handleBookingClick = useCallback(() => {
    if (isPerformer) {
      if (canBook && selectedSeats.length > 0) {
        multipleSeatBookingMutation.mutate(selectedSeats);
        router.push("/home");
      }
    } else {
      if (isComplete && selectedSeatInfo) {
        seatBookingMutation.mutate({
          section: selectedSeatInfo.seat.section,
          row: selectedSeatInfo.seat.row,
          seatNumber: selectedSeatInfo.seat.seatNumber,
        });
        toast.success("예매가 완료되었습니다.");
        router.push("/home");
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
    <main className="w-full max-w-[480px] mx-auto min-h-screen bg-white flex flex-col overflow-hidden">
      <div className="px-4">
        <BackHeader goto="/home" text="예매하기" />
      </div>

      <div className="flex-1 flex flex-col p-4 pt-8 gap-8 min-h-0">
        <div className="flex-shrink-0">
          <SelectSection onSectionSelect={handleSectionSelect} />
        </div>
        <div className="flex-shrink-0 overflow-hidden">
          <SeatSection
            selectedSection={isPerformer ? performerSelectedSection : selectedSection}
            selectedSeat={isPerformer ? null : selectedSeat}
            onSeatSelect={handleSeatSelect}
            selectedSeatInfo={isPerformer ? null : selectedSeatInfo}
            selectedSeats={isPerformer ? selectedSeats : undefined}
            isSeatSelected={isPerformer ? isSeatSelected : undefined}
            isPerformerMode={isPerformer}
            myBookedSeats={isPerformer ? myBookedSeats : undefined}
            removeOccupiedSeat={isPerformer ? removeOccupiedSeat : undefined}
          />
        </div>
        <Button
          className="fixed bottom-[48px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[448px] h-[48px]"
          onClick={handleBookingClick}
          disabled={isPerformer ? !canBook || maxSelectableSeats === 0 : !isComplete}
        >
          {getButtonText()}
        </Button>
      </div>
    </main>
  );
};

export default BookingPage;
