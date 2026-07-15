"use client";

import { memo, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";
import { cn } from "@/shared/utils/cn";
import { Seat, SeatLayout, SECTIONS, getSectionLabel } from "@/entities/booking/model/types";
import { getSeatPattern, getSeatLayout, getRowLabels } from "@/entities/booking/model/seatLayouts";
import { SeatItem } from "../SeatItem";

const NOOP_SEAT_SELECT = () => {};

export interface LotterySeatGridProps {
  layout: SeatLayout | null;
  lotterySeats: Seat[];
  currentSeat: Seat | null;
  isAnimating: boolean;
  revealedSeats: Seat[];
  disabledSeats?: Array<{ section: Seat["section"]; row: string; seatNumber: string }>;
  className?: string;
}

const ANIMATING_COUNT = 10;

const keyOf = (s: { section: Seat["section"]; row: string; seatNumber: string }) =>
  `${s.section}-${s.row}-${s.seatNumber}`;

const parseNum = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const hash = (str: string) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return h >>> 0;
};

const rng = (seed: number) => {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleDet = <T,>(arr: T[], seed: number) => {
  const a = arr.slice();
  const random = rng(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const isAdjacentSameSection = (a: Seat, b: Seat) => {
  if (a.section !== b.section || a.row !== b.row) return false;
  const na = parseNum(a.seatNumber);
  const nb = parseNum(b.seatNumber);
  if (na == null || nb == null) return false;
  return Math.abs(na - nb) <= 1;
};

export const LotterySeatGrid = memo<LotterySeatGridProps>(
  ({
    layout,
    lotterySeats,
    currentSeat,
    isAnimating,
    revealedSeats,
    disabledSeats = [],
    className,
  }) => {
    const queryClient = useQueryClient();

    const disabledSet = useMemo(() => {
      const set = new Set<string>();
      disabledSeats.forEach(s => set.add(keyOf(s)));
      return set;
    }, [disabledSeats]);

    const isRevealed = (s: Seat) =>
      revealedSeats?.some(
        r => r.section === s.section && r.row === s.row && r.seatNumber === s.seatNumber,
      );

    const animatingKeys = useMemo(() => {
      if (!isAnimating || !currentSeat) return new Set<string>();

      const set = new Set<string>();
      const picked: Seat[] = [];

      const curKey = keyOf(currentSeat);
      set.add(curKey);
      picked.push(currentSeat);

      const candidates = lotterySeats.filter(s => !isRevealed(s) && keyOf(s) !== curKey);

      const seed = hash(
        `${currentSeat.section}-${currentSeat.row}-${currentSeat.seatNumber}-${revealedSeats.length}`,
      );
      const shuffled = shuffleDet(candidates, seed);

      for (const s of shuffled) {
        if (set.size >= ANIMATING_COUNT) break;
        if (picked.some(p => isAdjacentSameSection(p, s))) continue;
        set.add(keyOf(s));
        picked.push(s);
      }

      if (set.size < ANIMATING_COUNT) {
        for (const s of shuffled) {
          if (set.size >= ANIMATING_COUNT) break;
          const k = keyOf(s);
          if (!set.has(k)) {
            set.add(k);
            picked.push(s);
          }
        }
      }

      return set;
    }, [
      isAnimating,
      currentSeat?.section,
      currentSeat?.row,
      currentSeat?.seatNumber,
      lotterySeats,
      revealedSeats,
    ]);

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
          return { seatNumber, seat, key };
        }),
      );
    }, [layout?.section, layout?.seats]);

    const allSectionsGrid = useMemo(() => {
      return [SECTIONS.slice(0, 3), SECTIONS.slice(3, 6), SECTIONS.slice(6)].filter(
        row => row.length > 0,
      );
    }, []);

    const getSeatStatus = (seat: Seat) => {
      if (disabledSet.has(keyOf(seat))) return "occupied";
      if (isRevealed(seat)) return "selected";
      if (isAnimating && animatingKeys.has(keyOf(seat))) return "selected";
      return seat.status;
    };

    const isSeatSelected = (seat: Seat) =>
      isRevealed(seat) || (isAnimating && animatingKeys.has(keyOf(seat)));

    const renderSingleSectionGrid = () => (
      <div className="min-w-max flex flex-col justify-start">
        {seatGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 mb-4">
            {row.map(({ seat, key }) => (
              <div key={key} className="w-5 h-5">
                {seat ? (
                  <SeatItem
                    seat={{ ...seat, status: getSeatStatus(seat) }}
                    isSelected={isSeatSelected(seat)}
                    onSelect={NOOP_SEAT_SELECT}
                    className={cn(
                      "w-5 h-5 border-2 bg-gray-500",
                      disabledSet.has(keyOf(seat)) && "pointer-events-none opacity-40",
                    )}
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
      const sectionLayout = getSeatLayout(section);
      const pattern = getSeatPattern(section);
      const rowLabels = getRowLabels(section);

      const seatMap = new Map<string, Seat>();
      const seatsToUse = cachedSeats || sectionLayout.seats;
      seatsToUse.forEach(seat => {
        seatMap.set(`${seat.row}-${seat.seatNumber}`, seat);
      });

      return (
        <div className="flex flex-col items-center border rounded-lg mb-28">
          <div className="text-white text-lg font-bold mb-2">{getSectionLabel(section)}</div>
          <div className="flex flex-col gap-4">
            {pattern.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-4">
                {row.map((seatNumber, colIndex) => {
                  const seat = seatNumber
                    ? seatMap.get(`${rowLabels[rowIndex]}-${seatNumber}`) || null
                    : null;
                  const key = seat
                    ? `${seat.section}-${seat.row}-${seat.seatNumber}`
                    : `${rowIndex}-${colIndex}`;

                  if (!seat) return <div key={key} className="w-20 h-20" />;

                  const disabled = disabledSet.has(keyOf(seat));
                  const isRevealedSeat = isRevealed(seat);
                  const isAnimatingSeat = isAnimating && animatingKeys.has(keyOf(seat));

                  const status = disabled
                    ? "occupied"
                    : isRevealedSeat
                      ? "selected"
                      : isAnimatingSeat
                        ? "selected"
                        : seat.status;

                  return (
                    <div key={key} className="w-20 h-20">
                      <SeatItem
                        seat={{ ...seat, status }}
                        isSelected={isRevealedSeat || isAnimatingSeat}
                        onSelect={NOOP_SEAT_SELECT}
                        className={cn(
                          "w-20 h-20 text-sm",
                          disabled && "pointer-events-none opacity-40",
                        )}
                      />
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
      <div className="flex flex-col gap-20 items-center">
        {allSectionsGrid.map((sectionsRow, rowIndex) => (
          <div key={rowIndex} className="flex gap-20 items-end">
            {sectionsRow.map(section => (
              <div key={section}>{renderSectionMiniGrid(section)}</div>
            ))}
          </div>
        ))}
      </div>
    );

    return (
      <div className={cn("w-full h-full flex justify-center", className)}>
        <div className="w-full h-full overflow-auto flex justify-center">
          {layout ? renderSingleSectionGrid() : renderAllSectionsGrid()}
        </div>
      </div>
    );
  },
);

LotterySeatGrid.displayName = "LotterySeatGrid";

export default LotterySeatGrid;
