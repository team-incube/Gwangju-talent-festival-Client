"use client";

import { memo, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";
import { cn } from "@/shared/utils/cn";
import { Seat, SeatLayout, SECTIONS, getSectionLabel } from "@/entities/booking/model/types";
import { SeatItem } from "../SeatItem";
import { getSeatPattern, getSeatLayout, getRowLabels } from "@/entities/booking/model/seatLayouts";

const NOOP_SEAT_SELECT = () => {};

// 프로젝트 spacing 스케일이 px와 rem이 섞여 있어(w-6=6px, w-5=20px) 임의값으로 못 박는다
const SINGLE_SECTION_CELL = "w-[24px] h-[24px] text-[13px]";
const ALL_SECTIONS_CELL = "w-[10px] h-[10px] text-[6px]";

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
    const cellSize = layout ? SINGLE_SECTION_CELL : ALL_SECTIONS_CELL;

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
      <div className={cn("flex flex-col min-h-0", className)}>
        {/* 높이는 좌석 내용만큼만. 화면을 넘기면 flex shrink로 잘리고 안쪽에서 스크롤된다 */}
        <div className="relative flex flex-col bg-gray-800 rounded-lg w-full min-h-0 overflow-hidden p-3">
          {/* 구역을 고르면 그 구역만 보여서 무대와의 위치 관계가 사라진다 */}
          {!layout && (
            <div className="shrink-0 mx-auto mb-6 w-1/2 rounded bg-gray-600 py-2 text-center text-caption2b tracking-widest text-white">
              무대
            </div>
          )}
          <div className="flex-1 min-h-0 w-full overflow-auto">
            {layout ? renderSingleSectionGrid() : renderAllSectionsGrid()}
          </div>
        </div>
      </div>
    );
  },
);

SeatGrid.displayName = "SeatGrid";

export default SeatGrid;
