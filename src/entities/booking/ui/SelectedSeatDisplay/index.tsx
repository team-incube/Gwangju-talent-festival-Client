"use client";

import { memo } from "react";
import { cn } from "@/shared/utils/cn";
import {
  SEAT_INFO,
  SECTIONS,
  SelectedSeatInfo,
  Section,
  SEAT_STATUS,
  Seat,
  getSectionLabel,
} from "../../model/types";
import { useAllSectionsSeatState } from "../../lib/useSeatState";

export interface SelectedSeatDisplayProps {
  selectedSeat: SelectedSeatInfo | null;
  selectedSection?: Section | null;
  selectedSeats?: Seat[];
  className?: string;
}

export const SelectedSeatDisplay = memo<SelectedSeatDisplayProps>(
  ({ selectedSeat, selectedSection, selectedSeats, className }) => {
    const { data: allSeats } = useAllSectionsSeatState();

    const Legend = () => (
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-white border border-gray-300"></div>
          <span className="text-gray-600 text-caption1r">가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-400 border border-gray-400"></div>
          <span className="text-gray-600 text-caption1r">불가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-main-600 border border-main-600"></div>
          <span className="text-gray-600 text-caption1r">선택</span>
        </div>
      </div>
    );

    const section = selectedSeat?.section || selectedSection;
    const seatPosition =
      selectedSeats && selectedSeats.length > 0
        ? selectedSeats
            .map(seat => `${getSectionLabel(seat.section)}${seat.row}${seat.seatNumber}`)
            .join(", ")
        : selectedSeat
          ? `${getSectionLabel(selectedSeat.section)}${selectedSeat.seat.row}${selectedSeat.seat.seatNumber}`
          : null;

    let availableSeatsCount = 0;
    let totalSeats = 0;

    if (allSeats && allSeats.length > 0) {
      if (section) {
        const sectionSeats = allSeats.filter(seat => seat.section === section);
        availableSeatsCount = sectionSeats.filter(
          seat => seat.status === SEAT_STATUS.AVAILABLE,
        ).length;
        totalSeats = SEAT_INFO[section].total;
      } else {
        availableSeatsCount = allSeats.filter(seat => seat.status === SEAT_STATUS.AVAILABLE).length;
        totalSeats = SECTIONS.reduce((total, sec) => total + SEAT_INFO[sec].total, 0);
      }
    } else {
      if (section) {
        totalSeats = SEAT_INFO[section].total;
        availableSeatsCount = totalSeats;
      } else {
        totalSeats = SECTIONS.reduce((total, sec) => total + SEAT_INFO[sec].total, 0);
        availableSeatsCount = 0;
      }
    }

    return (
      <div className={cn("h-24 p-4 rounded-lg border border-main-200", className)}>
        <div className="flex items-center justify-between h-full">
          <div className="flex flex-col justify-center gap-1">
            <div>
              <span className="text-body3r text-gray-600">좌석번호 </span>
              <span className="text-body3b font-bold text-main-600">{seatPosition || ""}</span>
            </div>

            <div>
              <span className="text-body3r text-gray-600">남은좌석 </span>
              <span className="text-body3b font-bold text-gray-900">
                {availableSeatsCount} / {totalSeats}
              </span>
            </div>
          </div>

          <Legend />
        </div>
      </div>
    );
  },
);

SelectedSeatDisplay.displayName = "SelectedSeatDisplay";

export default SelectedSeatDisplay;
