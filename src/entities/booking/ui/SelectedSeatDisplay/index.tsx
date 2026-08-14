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
  formatSeatLabel,
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

    // 전역 리셋의 div { border: 0 }이 border-style까지 none으로 만든다. border-solid가 없으면
    // 테두리 폭이 0으로 계산돼 안 보이고, 세 개 중 하나만 넣으면 크기가 달라 보인다
    const LEGEND_ITEMS = [
      { label: "가능", color: "bg-white border-gray-500" },
      { label: "불가능", color: "bg-gray-400 border-gray-400" },
      { label: "선택", color: "bg-orange-500 border-orange-500" },
    ];

    const Legend = () => (
      <div className="flex gap-4 text-xs">
        {LEGEND_ITEMS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={cn("w-3 h-3 border border-solid", color)} />
            <span className="text-gray-600 text-caption1r">{label}</span>
          </div>
        ))}
      </div>
    );

    const section = selectedSeat?.section || selectedSection;
    const seatPosition =
      selectedSeats && selectedSeats.length > 0
        ? selectedSeats.map(formatSeatLabel).join(", ")
        : selectedSeat
          ? formatSeatLabel(selectedSeat.seat)
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
      <div className={cn("relative min-h-24 p-4 rounded-lg border border-orange-200 bg-white", className)}>
        <div className="flex items-center justify-between h-full">
          <div className="flex flex-col justify-center gap-1">
            <div>
              <span className="text-body3r text-gray-600">좌석번호 </span>
              <span className="text-body3b font-bold text-orange-500">{seatPosition || ""}</span>
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
