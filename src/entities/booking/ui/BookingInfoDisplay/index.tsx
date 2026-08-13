"use client";

import { memo, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { Seat, formatSeatLabel } from "../../model/types";

interface InfoRowProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const InfoRow = ({ label, children, className }: InfoRowProps) => (
  <div className="flex items-center">
    <div className="w-[20%] text-gray-600 text-body3r">{label}</div>
    <div className={cn("ml-4 flex-1 text-gray-900 text-body3r", className)}>{children}</div>
  </div>
);

interface BookingInfoDisplayProps {
  mySeat: Seat | null;
  mySeats?: Seat[];
  className?: string;
}

export const BookingInfoDisplay = memo<BookingInfoDisplayProps>(
  ({ mySeat, mySeats, className }) => {
    return (
      <div className={cn("bg-white rounded-lg border border-gray-200 p-6 pb-24", className)}>
        <div className="mb-12">
          <h2 className="text-body2b text-gray-900 mb-1">예매정보</h2>
        </div>

        <div className="space-y-8">
          <InfoRow className="text-main-600 text-body1b" label="예약좌석">
            {mySeats && mySeats.length > 0
              ? mySeats.map(formatSeatLabel).join(", ")
              : mySeat
                ? formatSeatLabel(mySeat)
                : "좌석이 없습니다"}
          </InfoRow>
          <InfoRow label="관람일자">2026.9.5.(토)</InfoRow>
          <InfoRow label="장소">광주광역시 북구 필문대로 55 광주교육대학교 풍향문화관</InfoRow>
        </div>
      </div>
    );
  },
);

BookingInfoDisplay.displayName = "BookingInfoDisplay";

export default BookingInfoDisplay;
