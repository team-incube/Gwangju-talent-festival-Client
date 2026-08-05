import { useState, useCallback, useMemo } from "react";
import { Section, Seat, SEAT_STATUS } from "@/entities/booking/model/types";

export const MAX_PERFORMER_SEATS = 2;

export const usePerformerSeatSelection = (existingSeatsCount: number = 0) => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const maxSelectableSeats = Math.max(0, MAX_PERFORMER_SEATS - existingSeatsCount);

  const handleSectionChange = useCallback((section: Section | null) => {
    setSelectedSection(section);
    setSelectedSeats([]);
  }, []);

  const selectSeat = useCallback(
    (seat: Seat) => {
      if (seat.status === SEAT_STATUS.OCCUPIED) return;

      // 전체 지도에서 좌석을 바로 누른 경우 — 구역까지 같이 옮기고 선택은 그 좌석만 남긴다
      if (seat.section !== selectedSection) {
        setSelectedSection(seat.section);
        setSelectedSeats(maxSelectableSeats > 0 ? [seat] : []);
        return;
      }

      setSelectedSeats(prev => {
        const isAlreadySelected = prev.some(
          s => s.seatNumber === seat.seatNumber && s.row === seat.row && s.section === seat.section,
        );

        if (isAlreadySelected) {
          return prev.filter(
            s => !(s.seatNumber === seat.seatNumber && s.row === seat.row && s.section === seat.section),
          );
        } else {
          if (prev.length >= maxSelectableSeats) {
            return [...prev.slice(1), seat];
          } else {
            return [...prev, seat];
          }
        }
      });
    },
    [maxSelectableSeats, selectedSection],
  );

  const canSelectSeat = useCallback((seat: Seat) => {
    return seat.status === SEAT_STATUS.AVAILABLE;
  }, []);

  const isSeatSelected = useCallback(
    (seat: Seat) => {
      return selectedSeats.some(
        s => s.seatNumber === seat.seatNumber && s.row === seat.row && s.section === seat.section,
      );
    },
    [selectedSeats],
  );

  const isComplete = useMemo(() => {
    return !!(selectedSection && selectedSeats.length === MAX_PERFORMER_SEATS);
  }, [selectedSection, selectedSeats.length]);

  const canBook = useMemo(() => {
    return selectedSeats.length > 0 && selectedSeats.length <= maxSelectableSeats;
  }, [selectedSeats.length, maxSelectableSeats]);

  const removeOccupiedSeat = useCallback((section: Section, row: string, seatNumber: string) => {
    setSelectedSeats(prev =>
      prev.filter(
        seat => !(seat.section === section && seat.row === row && seat.seatNumber === seatNumber),
      ),
    );
  }, []);

  return {
    selectedSection,
    selectedSeats,
    setSelectedSection: handleSectionChange,
    selectSeat,
    canSelectSeat,
    isSeatSelected,
    isComplete,
    canBook,
    maxSelectableSeats,
    removeOccupiedSeat,
  };
};
