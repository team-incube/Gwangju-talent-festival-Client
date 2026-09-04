"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import BackHeader from "@/shared/ui/BackHeader";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { phoneNumberSchema } from "@/shared/model/phoneNumberSchema";
import SelectSection from "@/widgets/booking/ui/SelectSection";
import SeatSection from "@/widgets/booking/ui/SeatSection";
import { applySeatChange } from "@/entities/booking/lib/useSeatState";
import { useSeatChangeSSE } from "@/entities/booking/lib/useSeatChangeSSE";
import { useSearchSeatsByPhone } from "@/entities/booking/lib/useSearchSeatsByPhone";
import { SectionType, SeatChangeEvent } from "@/entities/booking/model/types";

// 조회 전용 화면 — 좌석 클릭으로 아무것도 바뀌지 않는다
const NOOP_SEAT_SELECT = () => {};

const SeatStatusPage = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [inputError, setInputError] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: foundSeats, isFetching, error } = useSearchSeatsByPhone(searchedPhone);

  const handleSeatChange = useCallback(
    (event: SeatChangeEvent) => applySeatChange(queryClient, event),
    [queryClient],
  );

  const handleReconnect = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["seatState"] });
    queryClient.invalidateQueries({ queryKey: ["allSectionsSeatState"] });
  }, [queryClient]);

  useSeatChangeSSE({ onSeatChange: handleSeatChange, onReconnect: handleReconnect });

  // 찾은 좌석이 다른 구역이면 보고 있는 구역을 옮겨줘야 하이라이트가 보인다
  useEffect(() => {
    if (foundSeats && foundSeats.length > 0) {
      setSelectedSection(foundSeats[0].section);
    }
  }, [foundSeats]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const digits = phoneInput.replace(/[^0-9]/g, "");
    const result = phoneNumberSchema.safeParse(digits);

    if (!result.success) {
      setInputError(result.error.issues[0].message);
      setSearchedPhone("");
      return;
    }

    setInputError(undefined);
    setSearchedPhone(digits);
  };

  const resultMessage = () => {
    if (isFetching) return "조회 중...";
    if (error) return error.message;
    if (!foundSeats) return null;
    if (foundSeats.length === 0) return "해당 전화번호로 예매한 좌석이 없습니다.";
    return null;
  };

  const message = resultMessage();

  return (
    <main className="w-full max-w-[480px] mx-auto h-dvh bg-white flex flex-col overflow-hidden">
      <div className="px-4">
        <BackHeader goto="/home" text="좌석 현황" />
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0 p-4 gap-4">
        <form onSubmit={handleSearch} className="flex items-start gap-8">
          <Input
            type="tel"
            inputMode="numeric"
            placeholder="전화번호 (- 없이)"
            value={phoneInput}
            onChange={event => setPhoneInput(event.target.value)}
            error={inputError}
            hideErrorSpace={!inputError}
          />
          <Button type="submit" className="shrink-0 h-[50px] w-80" disabled={isFetching}>
            조회
          </Button>
        </form>

        {message && (
          <p className={`text-caption1r ${error ? "text-red-500" : "text-gray-600"}`}>{message}</p>
        )}

        <SelectSection selectedSection={selectedSection} onSectionSelect={setSelectedSection} />

        <div className="min-h-0">
          <SeatSection
            selectedSection={selectedSection}
            selectedSeat={null}
            onSeatSelect={NOOP_SEAT_SELECT}
            selectedSeatInfo={null}
            onSectionSelect={setSelectedSection}
            myBookedSeats={foundSeats}
            selectedSeats={foundSeats}
          />
        </div>
      </div>
    </main>
  );
};

export default SeatStatusPage;
