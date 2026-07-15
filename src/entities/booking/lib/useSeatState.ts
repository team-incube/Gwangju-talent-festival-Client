import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSeatState } from "@/entities/booking/api/getSeatState";
import {
  Section,
  Seat,
  SEAT_STATUS,
  getSectionFromLabel,
  SeatChangeEvent,
} from "@/entities/booking/model/types";
import { getSeatLayout } from "@/entities/booking/model/seatLayouts";

export const seatQueryKeys = {
  seatState: (section: Section) => ["seatState", section] as const,
} as const;

export function useSectionSeatState(section: Section) {
  return useQuery({
    queryKey: seatQueryKeys.seatState(section),
    queryFn: async () => {
      const response = await getSeatState(section);

      const layout = getSeatLayout(section);
      const transformedSeats = layout.seats.map((seat, index) => ({
        ...seat,
        status: response.seats[index] ? SEAT_STATUS.AVAILABLE : SEAT_STATUS.OCCUPIED,
      }));
      return transformedSeats;
    },
    enabled: !!section,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function usePrefetchSeatCaches() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["__pre__seat_all__"],
    queryFn: async () => {
      const response = await getSeatState();

      Object.entries(response.sections).forEach(([label, sectionData]) => {
        const section = getSectionFromLabel(label);
        if (!section) return;

        if (sectionData && Array.isArray(sectionData.seats)) {
          const sectionSeats = sectionData.seats;
          const layout = getSeatLayout(section);
          const transformedSeats: Seat[] = layout.seats.map((seat, index) => ({
            ...seat,
            status:
              index < sectionSeats.length && sectionSeats[index]
                ? SEAT_STATUS.AVAILABLE
                : SEAT_STATUS.OCCUPIED,
          }));

          queryClient.setQueryData(seatQueryKeys.seatState(section), transformedSeats);
        } else {
          console.warn(sectionData);
        }
      });

      return { warmed: true, at: Date.now() };
    },
    staleTime: 0,
    gcTime: 0,
  });
}

export function useAllSectionsSeatState() {
  return useQuery({
    queryKey: ["allSectionsSeatState"],
    queryFn: async () => {
      const response = await getSeatState();

      const allSeats: Seat[] = [];

      Object.entries(response.sections).forEach(([label, sectionData]) => {
        const section = getSectionFromLabel(label);
        if (!section) return;

        if (sectionData && Array.isArray(sectionData.seats)) {
          const sectionSeats = sectionData.seats;

          const layout = getSeatLayout(section);
          const transformedSeats: Seat[] = layout.seats.map((seat, index) => ({
            ...seat,
            status:
              index < sectionSeats.length && sectionSeats[index]
                ? SEAT_STATUS.AVAILABLE
                : SEAT_STATUS.OCCUPIED,
          }));
          allSeats.push(...transformedSeats);
        } else {
          console.warn(sectionData);
        }
      });
      return allSeats;
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
}

export function updateSeatInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  seatChangeEvent: SeatChangeEvent,
): void {
  const {
    seat_section: section,
    seat_row: seatRow,
    seat_number: seatNumber,
    is_available: isAvailable,
  } = seatChangeEvent;

  queryClient.setQueryData<Seat[]>(seatQueryKeys.seatState(section), oldData => {
    if (!oldData) return oldData;

    return oldData.map(seat => {
      if (seat.seatNumber === seatNumber.toString() && seat.row === seatRow) {
        return {
          ...seat,
          status: isAvailable ? SEAT_STATUS.AVAILABLE : SEAT_STATUS.OCCUPIED,
        };
      }
      return seat;
    });
  });
}
