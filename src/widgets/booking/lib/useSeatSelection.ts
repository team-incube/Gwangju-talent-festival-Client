import { useState, useCallback, useMemo } from "react";
import { Section, Seat, SelectedSeatInfo, SEAT_STATUS } from "@/entities/booking/model/types";
import { isReservedSeat } from "@/entities/booking/model/reservedSeats";

const isSameSeat = (a: Seat, b: Seat) =>
  a.seatNumber === b.seatNumber && a.row === b.row && a.section === b.section;

interface UseSeatSelectionOptions {
  // 어드민은 밴 해제를 위해 점유(회색) 좌석도 선택할 수 있어야 한다
  allowOccupied?: boolean;
}

export const useSeatSelection = ({ allowOccupied = false }: UseSeatSelectionOptions = {}) => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const handleSectionChange = useCallback((section: Section | null) => {
    setSelectedSection(section);
    setSelectedSeat(null);
  }, []);

  const selectSeat = useCallback(
    (seat: Seat) => {
      if (isReservedSeat(seat) && !allowOccupied) return;
      if (seat.status === SEAT_STATUS.OCCUPIED && !allowOccupied) return;

      if (selectedSeat && isSameSeat(selectedSeat, seat)) {
        // 같은 좌석이라도 상태가 바뀐 경우(밴/해제)는 선택을 유지하고 상태만 갱신
        setSelectedSeat(selectedSeat.status !== seat.status ? seat : null);
      } else {
        setSelectedSeat(seat);
        setSelectedSection(seat.section);
      }
    },
    [selectedSeat, allowOccupied],
  );

  const canSelectSeat = useCallback((seat: Seat) => {
    return seat.status === SEAT_STATUS.AVAILABLE;
  }, []);

  const selectedSeatInfo = useMemo((): SelectedSeatInfo | null => {
    if (!selectedSeat || !selectedSection) return null;

    return {
      seat: selectedSeat,
      section: selectedSection,
    };
  }, [selectedSeat, selectedSection]);

  const isComplete = useMemo(() => {
    return !!(selectedSection && selectedSeat);
  }, [selectedSection, selectedSeat]);

  return {
    selectedSection,
    selectedSeat,
    selectedSeatInfo,
    setSelectedSection: handleSectionChange,
    selectSeat,
    canSelectSeat,
    isComplete,
  };
};
