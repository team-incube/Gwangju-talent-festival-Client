"use client";

import { memo, useCallback } from "react";
import { cn } from "@/shared/utils/cn";
import { Seat, SEAT_STATUS } from "../../model/types";

export interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seat: Seat) => void;
  className?: string;
  allowOccupiedSelect?: boolean;
  isMine?: boolean;
}

export const SeatItem = memo<SeatItemProps>(
  ({ seat, isSelected, onSelect, className, allowOccupiedSelect = false, isMine = false }) => {
    const isOccupied = seat.status === SEAT_STATUS.OCCUPIED;
    const isDisabled = isOccupied && !allowOccupiedSelect;

    const handleClick = useCallback(() => {
      if (seat.status === SEAT_STATUS.OCCUPIED && !allowOccupiedSelect) return;
      onSelect(seat);
    }, [seat, onSelect, allowOccupiedSelect]);

    const getSeatStyles = () => {
      const baseStyles =
        "w-5 h-5 text-xs font-medium transition-all duration-200 flex items-center justify-center";

      if (isSelected) {
        return cn(baseStyles, "bg-orange-500 text-white shadow-lg scale-110 cursor-pointer");
      }

      // 내가 이미 예매한 좌석은 서버가 occupied로 내려주므로 회색보다 먼저 판정해야 한다
      if (isMine) {
        return cn(baseStyles, "bg-orange-500 text-white cursor-not-allowed");
      }

      if (isOccupied) {
        return cn(
          baseStyles,
          "bg-gray-400 text-gray-600",
          isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        );
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
        disabled={isDisabled}
        title={`좌석 ${seat.seatNumber} - ${isMine ? "내 좌석" : isDisabled ? "선택불가" : "선택가능"}`}
        aria-label={`좌석 ${seat.seatNumber}`}
      >
        {getSeatNumber()}
      </button>
    );
  },
);

SeatItem.displayName = "SeatItem";

export default SeatItem;
