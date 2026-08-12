import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { SeatChangeEvent } from "../model/types";
import { fromApiSeat } from "../model/seatLayouts";

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

interface UseSeatChangeSSEOptions {
  onSeatChange?: (event: SeatChangeEvent) => void;
  onReconnect?: () => void;
  enabled?: boolean;
}

export function useSeatChangeSSE(options: UseSeatChangeSSEOptions = {}) {
  const { onSeatChange, onReconnect, enabled = true } = options;
  const eventSourceRef = useRef<EventSource | null>(null);
  const onSeatChangeRef = useRef(onSeatChange);
  const onReconnectRef = useRef(onReconnect);
  const hasConnectedRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onSeatChangeRef.current = onSeatChange;
    onReconnectRef.current = onReconnect;
  }, [onSeatChange, onReconnect]);

  useEffect(() => {
    if (!enabled) return;

    const connect = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      eventSourceRef.current?.close();

      const eventSource = new EventSource("/api/seat/changes", {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      eventSource.addEventListener("SEAT_CHANGE", event => {
        try {
          const data = JSON.parse(event.data);

          let seatChangeEvent: SeatChangeEvent | null = null;
          if (data.seat_row != null) {
            seatChangeEvent = {
              seat_section: data.seat_section,
              seat_row: data.seat_row,
              seat_number: data.seat_number,
              is_available: data.is_available,
            };
          } else {
            const seat = fromApiSeat(data.seatSection, data.seatNumber);
            if (seat) {
              seatChangeEvent = {
                seat_section: seat.section,
                seat_row: seat.row,
                seat_number: Number(seat.seatNumber),
                is_available: data.available ?? data.isAvailable ?? data.is_available,
              };
            }
          }

          if (seatChangeEvent && onSeatChangeRef.current) {
            try {
              onSeatChangeRef.current(seatChangeEvent);
            } catch {
              toast.error("좌석 정보 처리 중 오류가 발생했습니다.");
            }
          }
        } catch {
          toast.error("좌석 정보를 불러오는 중 오류가 발생했습니다.");
        }
      });

      eventSource.onopen = () => {
        retryCountRef.current = 0;
        toast.dismiss("sse-error");
        // 끊긴 동안 놓친 SEAT_CHANGE는 다시 오지 않으므로 재연결 때 좌석 상태를 다시 받아온다
        if (hasConnectedRef.current) {
          onReconnectRef.current?.();
        }
        hasConnectedRef.current = true;
      };

      eventSource.onerror = () => {
        // 에러 후 CONNECTING이면 브라우저가 스스로 재연결하는 중이므로 건드리지 않는다.
        // CLOSED는 네이티브 재연결이 없으므로 백오프로 직접 다시 붙는다
        if (eventSource.readyState !== EventSource.CLOSED) {
          return;
        }
        toast.error("실시간 좌석 정보 연결에 실패했습니다.", { id: "sse-error" });
        if (eventSourceRef.current === eventSource) {
          eventSourceRef.current = null;
        }
        if (!retryTimerRef.current) {
          scheduleReconnect();
        }
      };
    };

    const scheduleReconnect = () => {
      if (retryCountRef.current >= MAX_RETRIES) {
        toast.error("실시간 연결이 종료되었습니다. 페이지를 새로고침 해주세요.", {
          id: "sse-error",
        });
        return;
      }
      // 탭 비활성화/오프라인 상태에서는 재시도 횟수를 낭비하지 않고
      // visibilitychange/online 이벤트가 발생할 때 재연결
      if (document.hidden || !navigator.onLine) {
        return;
      }
      const delay = BASE_DELAY * 2 ** retryCountRef.current;
      retryCountRef.current++;
      retryTimerRef.current = setTimeout(connect, delay);
    };

    const isDisconnected = () =>
      eventSourceRef.current === null ||
      eventSourceRef.current.readyState === EventSource.CLOSED;

    const handleVisibilityChange = () => {
      if (!document.hidden && isDisconnected()) {
        retryCountRef.current = 0;
        connect();
      }
    };

    const handleOnline = () => {
      if (isDisconnected()) {
        retryCountRef.current = 0;
        connect();
      }
    };

    connect();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [enabled]);

  const closeConnection = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  };

  return { closeConnection };
}
