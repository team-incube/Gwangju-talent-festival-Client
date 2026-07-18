"use client";

import { memo, useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Section, Seat, SelectedSeatInfo, SEAT_STATUS } from "@/entities/booking/model/types";
import { SeatGrid } from "@/entities/booking/ui/SeatGrid";
import { SelectedSeatDisplay } from "@/entities/booking/ui/SelectedSeatDisplay";
import {
  useSectionSeatState,
  useAllSectionsSeatState,
} from "@/entities/booking/lib/useSeatState";
import { getSeatLayout } from "@/entities/booking/model/seatLayouts";

const NOOP_SEAT_SELECT = () => {};

interface SeatSectionProps {
  selectedSection: Section | null;
  selectedSeat: Seat | null;
  onSeatSelect: (seat: Seat | null) => void;
  selectedSeatInfo: SelectedSeatInfo | null;
  className?: string;
  selectedSeats?: Seat[];
  isSeatSelected?: (seat: Seat) => boolean;
  isPerformerMode?: boolean;
  myBookedSeats?: Seat[];
  allowOccupiedSelect?: boolean;
}

export const SeatSection = memo<SeatSectionProps>(
  ({
    selectedSection,
    selectedSeat,
    onSeatSelect,
    selectedSeatInfo,
    className,
    selectedSeats,
    isSeatSelected,
    isPerformerMode = false,
    myBookedSeats,
    allowOccupiedSelect = false,
  }) => {
    const { data: sectionSeats, isLoading, error } = useSectionSeatState(selectedSection!);
    const { data: allSeats, isLoading: isAllSeatsLoading } = useAllSectionsSeatState();
    const [realTimeSeats, setRealTimeSeats] = useState<Seat[] | null>(null);

    useEffect(() => {
      if (!selectedSection) {
        if (allSeats && allSeats.length > 0) {
          setRealTimeSeats(allSeats);
        }
        return;
      }

      const allSectionSeats = allSeats?.filter(seat => seat.section === selectedSection);

      const dataToUse =
        allSectionSeats && allSectionSeats.length > 0 ? allSectionSeats : sectionSeats;

      if (dataToUse) {
        setRealTimeSeats(dataToUse);
      }
    }, [allSeats, sectionSeats, selectedSection, isAllSeatsLoading]);

    const getLayout = () => {
      if (selectedSection) {
        const getFallbackSeats = () => {
          const layout = getSeatLayout(selectedSection);
          return layout.seats.map(seat => ({
            ...seat,
            status: SEAT_STATUS.OCCUPIED,
          }));
        };

        const allSectionSeats = allSeats?.filter(seat => seat.section === selectedSection);

        const seatsToUse =
          realTimeSeats ||
          (allSectionSeats && allSectionSeats.length > 0 ? allSectionSeats : null) ||
          sectionSeats ||
          getFallbackSeats();

        return {
          section: selectedSection,
          seats: seatsToUse,
        };
      } else {
        return null;
      }
    };

    const layout = getLayout();

    return (
      <div className={cn("pb-24", className)}>
        <SeatGrid
          layout={layout}
          selectedSeat={selectedSeat}
          onSeatSelect={isLoading || !!error ? NOOP_SEAT_SELECT : onSeatSelect}
          allSeats={realTimeSeats}
          selectedSeats={selectedSeats}
          isSeatSelected={isSeatSelected}
          isPerformerMode={isPerformerMode}
          mySeat={!isPerformerMode && !allowOccupiedSelect ? (myBookedSeats?.[0] ?? null) : null}
          myAllSeats={myBookedSeats}
          allowOccupiedSelect={allowOccupiedSelect}
        />

        <div className="pt-8">
          <SelectedSeatDisplay
            selectedSeat={!isPerformerMode ? selectedSeatInfo : null}
            selectedSection={selectedSection}
            selectedSeats={isPerformerMode ? selectedSeats : undefined}
          />
        </div>
      </div>
    );
  },
);

SeatSection.displayName = "SeatSection";

export default SeatSection;
