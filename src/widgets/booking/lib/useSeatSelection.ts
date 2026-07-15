import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Section, Seat, SelectedSeatInfo, SEAT_STATUS } from "@/entities/booking/model/types";
import { banSeat, cancelSeatBan, SeatBanError } from "@/entities/booking/api/banSeat";

const isSameSeat = (a: Seat, b: Seat) =>
  a.seatNumber === b.seatNumber && a.row === b.row && a.section === b.section;

export const useSeatSelection = () => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const releaseHold = useCallback((seat: Seat) => {
    cancelSeatBan(seat).catch(() => {});
  }, []);

  const holdSeat = useCallback((seat: Seat) => {
    banSeat(seat)
      .catch(async (error: SeatBanError) => {
        // 409 외(권한 없음 등)는 선택 유지하고 예매 시점에 판정
        if (error.status !== 409) return;
        // 본인이 이전에 남긴 홀드일 수 있으니 해제 후 1회 재시도
        await cancelSeatBan(seat).catch(() => {});
        await banSeat(seat);
      })
      .catch(() => {
        setSelectedSeat(current => (current && isSameSeat(current, seat) ? null : current));
        toast.error("이미 다른 사용자가 선택한 좌석입니다.");
      });
  }, []);

  const handleSectionChange = useCallback(
    (section: Section | null) => {
      setSelectedSection(section);
      setSelectedSeat(current => {
        if (current) releaseHold(current);
        return null;
      });
    },
    [releaseHold],
  );

  const selectSeat = useCallback(
    (seat: Seat) => {
      if (seat.status === SEAT_STATUS.OCCUPIED) return;

      if (selectedSeat && isSameSeat(selectedSeat, seat)) {
        releaseHold(selectedSeat);
        setSelectedSeat(null);
      } else {
        if (selectedSeat) releaseHold(selectedSeat);
        setSelectedSeat(seat);
        setSelectedSection(seat.section);
        holdSeat(seat);
      }
    },
    [selectedSeat, releaseHold, holdSeat],
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
