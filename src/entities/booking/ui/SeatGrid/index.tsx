"use client";

import { memo, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";
import { cn } from "@/shared/utils/cn";
import { Seat, SeatLayout, SECTIONS, getSectionLabel } from "@/entities/booking/model/types";
import { SeatItem } from "../SeatItem";
import { getSeatPattern, getSeatLayout, getRowLabels } from "@/entities/booking/model/seatLayouts";

export interface SeatGridProps {
  layout: SeatLayout | null;
  selectedSeat: Seat | null;
  onSeatSelect: (seat: Seat | null) => void;
  mySeat?: Seat | null;
  allSeats?: Seat[] | null;
  className?: string;
  selectedSeats?: Seat[];
  isSeatSelected?: (seat: Seat) => boolean;
  isPerformerMode?: boolean;
  myAllSeats?: Seat[];
  selectedSeatsForCancel?: Set<string>;
}

export const SeatGrid = memo<SeatGridProps>(
  ({
    layout,
    selectedSeat,
    onSeatSelect,
    mySeat,
    allSeats,
    className,
    isSeatSelected,
    isPerformerMode = false,
    myAllSeats,
    selectedSeatsForCancel,
  }) => {
    const queryClient = useQueryClient();

    const handleSeatSelect = useCallback(
      (seat: Seat) => {
        onSeatSelect(seat);
      },
      [onSeatSelect],
    );

    const seatGrid = useMemo(() => {
      if (!layout?.section) return [];

      const pattern = getSeatPattern(layout.section);
      const rowLabels = getRowLabels(layout.section);
      const seatMap = new Map<string, Seat>();

      layout.seats.forEach(seat => {
        seatMap.set(`${seat.row}-${seat.seatNumber}`, seat);
      });

      return pattern.map((row, rowIndex) =>
        row.map((seatNumber, colIndex) => {
          const seat = seatNumber
            ? seatMap.get(`${rowLabels[rowIndex]}-${seatNumber}`) || null
            : null;
          const key = seat
            ? `${seat.section}-${seat.row}-${seat.seatNumber}`
            : `${rowIndex}-${colIndex}`;

          return {
            seatNumber,
            seat,
            key,
          };
        }),
      );
    }, [layout?.section, layout?.seats]);

    const allSectionsGrid = useMemo(() => {
      const sectionsRow1 = SECTIONS.slice(0, 3);
      const sectionsRow2 = SECTIONS.slice(3, 6);

      return [sectionsRow1, sectionsRow2];
    }, []);

    const getSeatSelectedState = useCallback(
      (seat: Seat): boolean => {
        if (!seat) return false;

        if (selectedSeatsForCancel) {
          const seatId = `${seat.section}-${seat.row}-${seat.seatNumber}`;
          return selectedSeatsForCancel.has(seatId);
        }

        if (mySeat) {
          if (myAllSeats && myAllSeats.length > 1) {
            return myAllSeats.some(
              (s: Seat) =>
                s.seatNumber === seat.seatNumber && s.row === seat.row && s.section === seat.section,
            );
          }
          return (
            mySeat.seatNumber === seat.seatNumber &&
            mySeat.row === seat.row &&
            mySeat.section === seat.section
          );
        }

        if (isPerformerMode && typeof isSeatSelected === "function") {
          return isSeatSelected(seat) === true;
        }
        return (
          selectedSeat?.seatNumber === seat.seatNumber &&
          selectedSeat?.row === seat.row &&
          selectedSeat?.section === seat.section
        );
      },
      [mySeat, myAllSeats, isPerformerMode, isSeatSelected, selectedSeat, selectedSeatsForCancel],
    );

    const renderSingleSectionGrid = () => (
      <div className="min-w-max flex flex-col justify-start">
        {seatGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-8 mb-8">
            {row.map(({ seat, key }) => (
              <div key={key} className="w-5 h-5">
                {seat ? (
                  <SeatItem
                    seat={seat}
                    isSelected={getSeatSelectedState(seat)}
                    onSelect={mySeat ? () => {} : handleSeatSelect}
                  />
                ) : (
                  <div className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    const renderSectionMiniGrid = (section: (typeof SECTIONS)[number]) => {
      const cachedSeats = queryClient.getQueryData<Seat[]>(seatQueryKeys.seatState(section));
      const allSectionSeats = allSeats?.filter(seat => seat.section === section);
      const sectionLayout = getSeatLayout(section);
      const pattern = getSeatPattern(section);
      const rowLabels = getRowLabels(section);

      const seatMap = new Map<string, Seat>();
      const seatsToUse =
        allSectionSeats && allSectionSeats.length > 0
          ? allSectionSeats
          : cachedSeats || sectionLayout.seats;

      seatsToUse.forEach(seat => {
        seatMap.set(`${seat.row}-${seat.seatNumber}`, seat);
      });

      return (
        <div className="flex flex-col items-center border rounded-lg mb-6">
          <div className="text-white text-sm font-bold mb-1">{getSectionLabel(section)}</div>
          <div className="flex flex-col gap-1">
            {pattern.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((seatNumber, colIndex) => {
                  const seat = seatNumber
                    ? seatMap.get(`${rowLabels[rowIndex]}-${seatNumber}`) || null
                    : null;
                  const key = seat
                    ? `${seat.section}-${seat.row}-${seat.seatNumber}`
                    : `${rowIndex}-${colIndex}`;
                  return (
                    <div key={key} className="w-6 h-6">
                      {seat ? (
                        <SeatItem
                          seat={seat}
                          isSelected={getSeatSelectedState(seat)}
                          onSelect={mySeat ? () => {} : handleSeatSelect}
                          className="w-6 h-6 text-transparent"
                        />
                      ) : (
                        <div className="w-6 h-6"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderAllSectionsGrid = () => (
      <div className="flex flex-col gap-8 items-center">
        {allSectionsGrid.map((sectionsRow, rowIndex) => (
          <div key={rowIndex} className="flex gap-8 items-end">
            {sectionsRow.map(section => (
              <div key={section}>{renderSectionMiniGrid(section)}</div>
            ))}
          </div>
        ))}
      </div>
    );

    const getGridContainerStyles = () => {
      return "relative bg-gray-800 rounded-lg w-full flex justify-center p-3 overflow-x-auto";
    };

    return (
      <div className={cn(className)}>
        <div className={getGridContainerStyles()}>
          {layout ? renderSingleSectionGrid() : renderAllSectionsGrid()}
        </div>
      </div>
    );
  },
);

SeatGrid.displayName = "SeatGrid";

export default SeatGrid;
