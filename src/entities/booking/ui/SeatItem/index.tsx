"use client";

import { memo, useCallback } from "react";
import { cn } from "@/shared/utils/cn";
import { Seat, SEAT_STATUS } from "../../model/types";

export interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seat: Seat) => void;
  className?: string;
}

export const SeatItem = memo<SeatItemProps>(({ seat, isSelected, onSelect, className }) => {
  const handleClick = useCallback(() => {
    if (seat.status === SEAT_STATUS.OCCUPIED) return;
    onSelect(seat);
  }, [seat, onSelect]);

  const getSeatStyles = () => {
    const baseStyles =
      "w-5 h-5 text-xs font-medium transition-all duration-200 flex items-center justify-center";

    if (seat.status === SEAT_STATUS.OCCUPIED) {
      return cn(baseStyles, "bg-gray-400 text-gray-600 cursor-not-allowed");
    }

    if (isSelected) {
      return cn(baseStyles, "bg-main-600 text-white shadow-lg scale-110 cursor-pointer");
    }

    return cn(baseStyles, "bg-white text-gray-700 cursor-pointer");
  };

  const getSeatNumber = () => {
    return seat.seatNumber;
  };

  return (
    <button
      className={cn(getSeatStyles(), className)}
      onClick={handleClick}
      disabled={seat.status === SEAT_STATUS.OCCUPIED}
      title={`좌석 ${seat.seatNumber} - ${seat.status === SEAT_STATUS.OCCUPIED ? "선택불가" : "선택가능"}`}
      aria-label={`좌석 ${seat.seatNumber}`}
    >
      {getSeatNumber()}
    </button>
  );
});

SeatItem.displayName = "SeatItem";

export default SeatItem;
