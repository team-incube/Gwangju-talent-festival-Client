"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Button from "@/shared/ui/Button";
import { LotterySeatGrid } from "@/entities/booking/ui/LotterySeatGrid";
import { useLotteryAnimation } from "@/entities/booking/lib/useLotteryAnimation";
import { getLotteryConfig, convertToSeats } from "@/entities/booking/model/lotterySeats";
import { Seat, SECTIONS } from "@/entities/booking/model/types";
import { getSeatLayout } from "@/entities/booking/model/seatLayouts";
import { cn } from "@/shared/utils/cn";
import { redirect } from "next/navigation";

const ANIM_DURATION = 30;
const ANIM_INTERVAL = 90;
const TEAMS = [
  "신가밴드",
  "라온",
  "야간합주실",
  "곽서영",
  "METAPHOR",
  "ALL",
  "구각와니",
  "신준",
  "UNIVERSE",
  "정은서",
  "열정의 하마",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LotteryView = () => {
  const params = useParams();
  const lotteryId = params.id as string;

  const [resultSeats, setResultSeats] = useState<Seat[]>([]);
  const [plannedSequence, setPlannedSequence] = useState<Seat[]>([]);

  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [revealedSeats, setRevealedSeats] = useState<Seat[]>([]);
  const isBatchRunning = stepIndex >= 0;
  const timerRef = useRef<number | null>(null);
  const slotIntervalRef = useRef<number | null>(null);
  const [slotLabel, setSlotLabel] = useState<string>("");

  const allSeats = useMemo<Seat[]>(
    () =>
      SECTIONS.flatMap(section => {
        const layout = getSeatLayout(section);
        return layout?.seats ?? [];
      }),
    [],
  );

  const { isAnimating, currentSeat, startAnimation, resetAnimation } = useLotteryAnimation({
    seats: allSeats,
    duration: ANIM_DURATION,
    interval: ANIM_INTERVAL,
  });

  useEffect(() => {
    const config = getLotteryConfig(lotteryId);
    if (config) {
      const seats = convertToSeats(config);
      setResultSeats(seats);
      setStepIndex(-1);
      setRevealedSeats([]);
      setPlannedSequence([]);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      cleanupSlotInterval();
      setSlotLabel("");
    }
  }, [lotteryId]);

  const cleanupTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const cleanupSlotInterval = () => {
    if (slotIntervalRef.current) {
      window.clearInterval(slotIntervalRef.current);
      slotIntervalRef.current = null;
    }
  };

  useEffect(() => () => cleanupTimer(), []);

  useEffect(() => {
    if (isBatchRunning && isAnimating) {
      cleanupSlotInterval();
      slotIntervalRef.current = window.setInterval(() => {
        if (allSeats.length === 0) return;
        const r = Math.floor(Math.random() * allSeats.length);
        const s = allSeats[r];
        setSlotLabel(`${s.section}${s.row}${s.seatNumber}`);
      }, 60);
    } else {
      cleanupSlotInterval();
    }

    return () => cleanupSlotInterval();
  }, [isBatchRunning, isAnimating, allSeats]);

  const runStep = useCallback(
    (index: number, seq: Seat[]) => {
      setStepIndex(index);
      setSlotLabel("");
      resetAnimation();
      startAnimation();

      cleanupTimer();
      timerRef.current = window.setTimeout(() => {
        const targetSeat = seq[index];
        setRevealedSeats(prev => {
          const exists = prev.some(
            seat =>
              seat.section === targetSeat.section &&
              seat.row === targetSeat.row &&
              seat.seatNumber === targetSeat.seatNumber,
          );
          return exists ? prev : [...prev, targetSeat];
        });

        if (index + 1 < seq.length) {
          runStep(index + 1, seq);
        } else {
          setStepIndex(-1);
        }
      }, ANIM_DURATION + 30);
    },
    [resetAnimation, startAnimation],
  );

  const handleStartLottery = useCallback(() => {
    if (allSeats.length === 0) return;
    if (resultSeats.length === 0) return;

    const seq = shuffle(resultSeats);
    setPlannedSequence(seq);
    setRevealedSeats([]);

    runStep(0, seq);
  }, [allSeats.length, resultSeats, runStep]);

  const currentTarget = useMemo<Seat | null>(
    () => (stepIndex >= 0 && plannedSequence[stepIndex] ? plannedSequence[stepIndex] : null),
    [stepIndex, plannedSequence],
  );

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="p-6 mb-6 mt-8">
          <LotterySeatGrid
            layout={null}
            lotterySeats={allSeats}
            currentSeat={currentSeat}
            isAnimating={isAnimating}
            revealedSeats={revealedSeats}
          />
        </div>

        {(revealedSeats.length > 0 || currentTarget) && (
          <div className="p-6 mt-6 border bg-black">
            <div className="flex flex-wrap justify-center gap-2 mx-4">
              {revealedSeats.map(s => (
                <span
                  key={`${s.section}-${s.row}-${s.seatNumber}`}
                  className="inline-flex items-center justify-center rounded-full border border-purple-200 text-purple-100 px-1 py-1 text-body2b font-semibold min-w-[60px] h-8 my-8"
                >
                  {s.section}
                  {s.row}
                  {s.seatNumber}
                </span>
              ))}
              {isBatchRunning &&
                currentTarget &&
                !revealedSeats.some(
                  rs =>
                    rs.section === currentTarget.section &&
                    rs.row === currentTarget.row &&
                    rs.seatNumber === currentTarget.seatNumber,
                ) && (
                  <span
                    key={`target-${currentTarget.section}-${currentTarget.row}-${currentTarget.seatNumber}`}
                    className="inline-flex items-center justify-center rounded-full border border-purple-200 text-purple-100 px-1 py-1 text-body2b font-semibold min-w-[60px] h-8 my-8 animate-pulse"
                  >
                    {isAnimating && slotLabel
                      ? slotLabel
                      : `${currentTarget.section}${currentTarget.row}${currentTarget.seatNumber}`}
                  </span>
                )}
            </div>
          </div>
        )}
        <div className="bg-black p-6">
          <div className="flex gap-4 justify-center">
            <div className="flex justify-center gap-2 mb-6 mt-8 w-full bottom-4 absolute">
              {Array.from({ length: 11 }, (_, i) => i + 1).map(teamNumber => (
                <div
                  key={teamNumber}
                  className={cn(
                    "flex items-center justify-center w-full h-24 rounded-md text-body2b font-semibold border-2 transition-colors",
                    Number(lotteryId) === teamNumber
                      ? "bg-main-600 text-white text-body3b border-main-800"
                      : "bg-transparent text-white text-body3r border-gray-400 hover:border-gray-300",
                  )}
                  onClick={() => {
                    redirect(`/admin/lottery/${teamNumber}`);
                  }}
                >
                  {teamNumber}. {TEAMS[teamNumber - 1]}
                </div>
              ))}
            </div>
            <Button
              onClick={handleStartLottery}
              disabled={
                isBatchRunning || isAnimating || allSeats.length === 0 || resultSeats.length === 0
              }
              className={cn(
                "px-8 py-3 text-lg font-bold bottom-4 right-4 absolute",
                isBatchRunning || isAnimating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700",
              )}
            >
              {isBatchRunning || isAnimating
                ? "선택 중..."
                : `${TEAMS[Number(lotteryId) - 1]} 시작`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryView;
