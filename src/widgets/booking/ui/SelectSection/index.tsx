"use client";

import { useCallback, memo, useMemo, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { cn } from "@/shared/utils/cn";
import { SectionButtons } from "@/entities/booking/ui/SectionButtons";
import { seatQueryKeys } from "@/entities/booking/lib/useSeatState";
import {
  SectionType,
  Section,
  Seat,
  SECTIONS,
  SEAT_INFO,
  SEAT_STATUS,
} from "@/entities/booking/model/types";
import {
  usePrefetchSeatCaches,
  useAllSectionsSeatState,
} from "@/entities/booking/lib/useSeatState";
import { toast } from "sonner";

interface SelectSectionProps {
  selectedSection?: SectionType;
  onSectionSelect?: (section: SectionType) => void;
  className?: string;
}

export const SelectSection = memo<SelectSectionProps>(
  ({ selectedSection = null, onSectionSelect, className }) => {
  const { isLoading: isPrefetching, error: prefetchError } = usePrefetchSeatCaches();
  const {
    data: allSeats,
    isLoading: isAllSeatsLoading,
    error: allSeatsError,
  } = useAllSectionsSeatState();

  useEffect(() => {
    if (prefetchError) {
      console.error("Prefetch error:", prefetchError);
      toast.error("좌석 정보를 불러오는 중 오류가 발생했습니다.");
    }
    if (allSeatsError) {
      console.error("AllSeats error:", allSeatsError);
      toast.error("전체 좌석 정보를 불러오는 중 오류가 발생했습니다.");
    }
  }, [prefetchError, allSeatsError]);

  const handleSectionSelect = useCallback(
    (section: SectionType) => {
      onSectionSelect?.(section);
    },
    [onSectionSelect],
  );

  const sectionQueries = useQueries({
    queries: SECTIONS.map(section => ({
      queryKey: seatQueryKeys.seatState(section),
      enabled: false,
      staleTime: 0,
    })),
  });

  const sectionQueriesData = useMemo(() => sectionQueries.map(q => q.data), [sectionQueries]);

  const seatInfoMap = useMemo(() => {
    const map: Record<Section, string> = {} as Record<Section, string>;
    const isLoading = isPrefetching || isAllSeatsLoading;

    if (allSeats && allSeats.length > 0) {
      SECTIONS.forEach(section => {
        const total = SEAT_INFO[section].total;
        const sectionSeats = allSeats.filter(seat => seat.section === section);
        const occupied = sectionSeats.filter(seat => seat.status === SEAT_STATUS.OCCUPIED).length;
        const available = total - occupied;

        map[section] = `${available}/${total}`;
      });
    } else {
      SECTIONS.forEach((section, index) => {
        const total = SEAT_INFO[section].total;
        const cachedSeats = sectionQueriesData[index] as Seat[] | undefined;

        if (cachedSeats) {
          const occupied = cachedSeats.filter(seat => seat.status === SEAT_STATUS.OCCUPIED).length;
          map[section] = `${total - occupied}/${total}`;
        } else {
          map[section] = isLoading ? "로딩중..." : `0/${total}`;
        }
      });
    }
    return map;
  }, [allSeats, sectionQueriesData, isPrefetching, isAllSeatsLoading]);

  return (
    <div className={cn("w-full", className)}>
      <SectionButtons
        key={`section-buttons-${JSON.stringify(seatInfoMap)}`}
        selectedSection={selectedSection}
        onSectionSelect={handleSectionSelect}
        sections={SECTIONS}
        seatInfoMap={seatInfoMap}
      />
    </div>
  );
});

SelectSection.displayName = "SelectSection";

export default SelectSection;
