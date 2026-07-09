"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Section, Seat, SelectedSeatInfo, SEAT_STATUS } from "@/entities/booking/model/types";
import { SeatGrid } from "@/entities/booking/ui/SeatGrid";
import { SelectedSeatDisplay } from "@/entities/booking/ui/SelectedSeatDisplay";
import {
  useSectionSeatState,
  useAllSectionsSeatState,
  seatQueryKeys,
} from "@/entities/booking/lib/useSeatState";
import { useSeatChangeSSE } from "@/entities/booking/lib/useSeatChangeSSE";
import { getSeatLayout } from "@/entities/booking/model/seatLayouts";
import { useQueryClient } from "@tanstack/react-query";

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
  removeOccupiedSeat?: (section: Section, row: string, seatNumber: string) => void;
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
    removeOccupiedSeat,
  }) => {
    const { data: sectionSeats, isLoading, error } = useSectionSeatState(selectedSection!);
    const { data: allSeats, isLoading: isAllSeatsLoading } = useAllSectionsSeatState();
    const [realTimeSeats, setRealTimeSeats] = useState<Seat[] | null>(null);
    const queryClient = useQueryClient();

    const handleSeatChange = useCallback(
      (event: {
        seat_section: Section;
        seat_row: string;
        seat_number: number;
        is_available: boolean;
      }) => {
        if (event.seat_section !== selectedSection) return;

        if (!event.is_available && isPerformerMode && removeOccupiedSeat) {
          removeOccupiedSeat(event.seat_section, event.seat_row, event.seat_number.toString());
        }

        setRealTimeSeats(prevSeats => {
          if (!prevSeats) return prevSeats;

          return prevSeats.map(seat => {
            if (seat.seatNumber === event.seat_number.toString() && seat.row === event.seat_row) {
              return {
                ...seat,
                status: event.is_available ? SEAT_STATUS.AVAILABLE : SEAT_STATUS.OCCUPIED,
              };
            }
            return seat;
          });
        });

        const sectionCache = queryClient.getQueryData<Seat[]>(
          seatQueryKeys.seatState(event.seat_section),
        );
        if (sectionCache) {
          const updatedSeats = sectionCache.map(seat => {
            if (seat.seatNumber === event.seat_number.toString() && seat.row === event.seat_row) {
              return {
                ...seat,
                status: event.is_available ? SEAT_STATUS.AVAILABLE : SEAT_STATUS.OCCUPIED,
              };
            }
            return seat;
          });
          queryClient.setQueryData(seatQueryKeys.seatState(event.seat_section), updatedSeats);
        }

        const allSeatsCache = queryClient.getQueryData<Seat[]>(["allSectionsSeatState"]);
        if (allSeatsCache) {
          const updatedAllSeats = allSeatsCache.map(seat => {
            if (
              seat.section === event.seat_section &&
              seat.row === event.seat_row &&
              seat.seatNumber === event.seat_number.toString()
            ) {
              const newStatus = event.is_available ? SEAT_STATUS.AVAILABLE : SEAT_STATUS.OCCUPIED;
              return {
                ...seat,
                status: newStatus,
              };
            }
            return seat;
          });
          queryClient.setQueryData(["allSectionsSeatState"], updatedAllSeats);
        }
      },
      [selectedSection, queryClient, isPerformerMode, removeOccupiedSeat],
    );

    useSeatChangeSSE({
      onSeatChange: handleSeatChange,
      enabled: !!selectedSection,
    });

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
      <div className={cn("pb-20", className)}>
        <div className="h-80">
          <SeatGrid
            layout={layout}
            selectedSeat={selectedSeat}
            onSeatSelect={isLoading || !!error ? () => {} : onSeatSelect}
            allSeats={realTimeSeats}
            selectedSeats={selectedSeats}
            isSeatSelected={isSeatSelected}
            isPerformerMode={isPerformerMode}
            myAllSeats={myBookedSeats}
          />
        </div>

        <div className="h-28"></div>

        <div className="h-24">
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
