import { useQuery } from "@tanstack/react-query";
import { searchSeatsByPhone } from "../api/searchSeatsByPhone";
import { Seat } from "../model/types";

export const useSearchSeatsByPhone = (phoneNumber: string) =>
  useQuery<Seat[], Error>({
    queryKey: ["searchSeatsByPhone", phoneNumber],
    queryFn: () => searchSeatsByPhone(phoneNumber),
    enabled: phoneNumber.length > 0,
    retry: false,
    staleTime: 0,
  });
