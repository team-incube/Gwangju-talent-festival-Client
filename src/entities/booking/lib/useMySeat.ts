import { useQuery } from "@tanstack/react-query";
import { getMySeat, getMySeats } from "../api/getMySeat";
import { Seat } from "../model/types";
import { getTokenFromCookie, isLoggedIn } from "@/shared/utils/auth";
import { useEffect, useState } from "react";

export const useMySeat = () => {
  const [isClient, setIsClient] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setUserLoggedIn(isLoggedIn());

    const handleStorageChange = () => {
      setUserLoggedIn(isLoggedIn());
    };

    const handleFocus = () => {
      setUserLoggedIn(isLoggedIn());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return useQuery<Seat | null, Error, Seat | null>({
    queryKey: ["mySeat", userLoggedIn],
    queryFn: () => getMySeat(),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    enabled: isClient && userLoggedIn,
  });
};

export const useMySeats = () => {
  const [isClient, setIsClient] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setUserLoggedIn(isLoggedIn());

    const handleStorageChange = () => {
      setUserLoggedIn(isLoggedIn());
    };

    const handleFocus = () => {
      setUserLoggedIn(isLoggedIn());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return useQuery<Seat[], Error, Seat[]>({
    queryKey: ["mySeats", userLoggedIn],
    queryFn: () => getMySeats(),
    staleTime: 0, // 항상 refetch
    gcTime: 1000 * 60 * 10,
    enabled: isClient && userLoggedIn,
  });
};

export const useMyBookedSeats = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const userRole = getTokenFromCookie("role");
      setRole(userRole);
    }
  }, []);

  const isPerformer = role === "PERFORMER";

  const singleSeatQueryWithCondition = useQuery<Seat | null, Error, Seat | null>({
    queryKey: ["mySeat"],
    queryFn: () => getMySeat(),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    enabled: isClient && !!role && !isPerformer,
  });

  const multiSeatsQueryWithCondition = useQuery<Seat[], Error, Seat[]>({
    queryKey: ["mySeats"],
    queryFn: () => getMySeats(),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    enabled: isClient && !!role && isPerformer,
  });

  // role을 못 읽으면 두 쿼리 모두 비활성인데 isLoading은 false라,
  // 호출부가 "예약된 좌석 없음"으로 오판한다 (미들웨어가 막지만 이중 안전장치)
  if (!isClient || !role) {
    return {
      data: [],
      seats: [],
      isMultiple: false,
      isLoading: true,
      error: null,
    };
  }

  if (isPerformer) {
    return {
      ...multiSeatsQueryWithCondition,
      data: multiSeatsQueryWithCondition.data || [],
      seats: multiSeatsQueryWithCondition.data || [],
      isMultiple: true,
    };
  } else {
    return {
      ...singleSeatQueryWithCondition,
      data: singleSeatQueryWithCondition.data ? [singleSeatQueryWithCondition.data] : [],
      seats: singleSeatQueryWithCondition.data ? [singleSeatQueryWithCondition.data] : [],
      isMultiple: false,
    };
  }
};
