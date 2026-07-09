import { useState, useCallback, useMemo } from "react";
import { Section, Seat, SelectedSeatInfo, SEAT_STATUS } from "@/entities/booking/model/types";

export const useSeatSelection = () => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const handleSectionChange = useCallback((section: Section | null) => {
    setSelectedSection(section);
    setSelectedSeat(null);
  }, []);

  const selectSeat = useCallback(
    (seat: Seat) => {
      if (seat.status === SEAT_STATUS.OCCUPIED) return;

      if (
        selectedSeat?.seatNumber === seat.seatNumber &&
        selectedSeat?.row === seat.row &&
        selectedSeat?.section === seat.section
      ) {
        setSelectedSeat(null);
      } else {
        setSelectedSeat(seat);
      }
    },
    [selectedSeat],
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
