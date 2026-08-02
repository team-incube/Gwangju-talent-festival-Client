"use client";

import { memo, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";
import { useSeatMapZoom } from "@/entities/booking/lib/useSeatMapZoom";
import { cn } from "@/shared/utils/cn";
import { Seat, SeatLayout, SECTIONS, getSectionLabel } from "@/entities/booking/model/types";
import { SeatItem } from "../SeatItem";
import { getSeatPattern, getSeatLayout, getRowLabels } from "@/entities/booking/model/seatLayouts";

const NOOP_SEAT_SELECT = () => {};

const DEFAULT_ZOOM_SINGLE_SECTION = 5;
const DEFAULT_ZOOM_ALL_SECTIONS = 4;

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
  allowOccupiedSelect?: boolean;
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
    allowOccupiedSelect = false,
  }) => {
    const queryClient = useQueryClient();
    const { containerRef, cellSize } = useSeatMapZoom(
      layout ? DEFAULT_ZOOM_SINGLE_SECTION : DEFAULT_ZOOM_ALL_SECTIONS,
    );

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
      return [SECTIONS.slice(0, 3), SECTIONS.slice(3, 6), SECTIONS.slice(6)].filter(
        row => row.length > 0,
      );
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
      <div className="w-max mx-auto flex flex-col justify-start">
        {seatGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 mb-4">
            {row.map(({ seat, key }) => (
              <div key={key} className={cellSize}>
                {seat ? (
                  <SeatItem
                    seat={seat}
                    isSelected={getSeatSelectedState(seat)}
                    onSelect={mySeat ? NOOP_SEAT_SELECT : handleSeatSelect}
                    allowOccupiedSelect={allowOccupiedSelect}
                    className={cellSize}
                  />
                ) : (
                  <div className={cellSize} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    const sectionSeatMaps = useMemo(() => {
      const seatsBySection = new Map<(typeof SECTIONS)[number], Seat[]>();
      allSeats?.forEach(seat => {
        const bucket = seatsBySection.get(seat.section);
        if (bucket) {
          bucket.push(seat);
        } else {
          seatsBySection.set(seat.section, [seat]);
        }
      });

      const maps = new Map<(typeof SECTIONS)[number], Map<string, Seat>>();

      SECTIONS.forEach(section => {
        const cachedSeats = queryClient.getQueryData<Seat[]>(seatQueryKeys.seatState(section));
        const allSectionSeats = seatsBySection.get(section);
        const sectionLayout = getSeatLayout(section);
        const seatsToUse =
          allSectionSeats && allSectionSeats.length > 0
            ? allSectionSeats
            : cachedSeats || sectionLayout.seats;

        const seatMap = new Map<string, Seat>();
        seatsToUse.forEach(seat => {
          seatMap.set(`${seat.row}-${seat.seatNumber}`, seat);
        });
        maps.set(section, seatMap);
      });

      return maps;
    }, [allSeats, queryClient]);

    const renderSectionMiniGrid = (section: (typeof SECTIONS)[number]) => {
      const pattern = getSeatPattern(section);
      const rowLabels = getRowLabels(section);
      const seatMap = sectionSeatMaps.get(section)!;

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
                    <div key={key} className={cellSize}>
                      {seat ? (
                        <SeatItem
                          seat={seat}
                          isSelected={getSeatSelectedState(seat)}
                          onSelect={mySeat ? NOOP_SEAT_SELECT : handleSeatSelect}
                          className={cn(cellSize, "text-transparent")}
                        />
                      ) : (
                        <div className={cellSize}></div>
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
      <div className="w-max mx-auto flex flex-col gap-8 items-center">
        {allSectionsGrid.map((sectionsRow, rowIndex) => (
          <div key={rowIndex} className="flex gap-8 items-end">
            {sectionsRow.map(section => (
              <div key={section}>{renderSectionMiniGrid(section)}</div>
            ))}
          </div>
        ))}
      </div>
    );

    return (
      <div className={cn("min-h-0", className)}>
        <div className="relative bg-gray-800 rounded-lg w-full p-3">
          {/* 한 손가락 스크롤은 살리고 두 손가락 핀치만 가로채 확대·축소로 쓴다 */}
          <div ref={containerRef} className="overflow-auto touch-pan-x touch-pan-y">
            {layout ? renderSingleSectionGrid() : renderAllSectionsGrid()}
          </div>
        </div>
      </div>
    );
  },
);

SeatGrid.displayName = "SeatGrid";

export default SeatGrid;
