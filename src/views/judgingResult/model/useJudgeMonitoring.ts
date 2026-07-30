"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  JudgeMonitoringResponse,
  mergeMonitoringSnapshot,
  sanitizeMonitoringResponse,
} from "@/entities/judging/model/monitoring";
import { parsePartialJson } from "@/shared/utils/partialJson";

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;
const SSE_ERROR_TOAST_ID = "judge-monitoring-sse-error";

export const useJudgeMonitoring = () => {
  const [data, setData] = useState<JudgeMonitoringResponse | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const connect = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      const eventSource = new EventSource("/api/judge/monitor/changes", {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      eventSource.addEventListener("judge-monitoring", event => {
        const parsed = parsePartialJson<unknown>(event.data);
        const sanitized = parsed ? sanitizeMonitoringResponse(parsed.data) : null;

        if (!parsed || !sanitized) {
          toast.error("심사 모니터링 데이터를 불러오는 중 오류가 발생했습니다.");
          return;
        }

        setData(prev => (parsed.recovered ? mergeMonitoringSnapshot(prev, sanitized) : sanitized));
      });

      eventSource.onopen = () => {
        retryCountRef.current = 0;
        setIsConnected(true);
        toast.dismiss(SSE_ERROR_TOAST_ID);
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        toast.error("실시간 심사 모니터링 연결에 실패했습니다.", { id: SSE_ERROR_TOAST_ID });
        if (eventSource.readyState !== EventSource.OPEN) {
          eventSource.close();
          if (eventSourceRef.current === eventSource) {
            eventSourceRef.current = null;
          }
          if (!retryTimerRef.current) {
            scheduleReconnect();
          }
        }
      };
    };

    const scheduleReconnect = () => {
      if (retryCountRef.current >= MAX_RETRIES) {
        toast.error("실시간 연결이 종료되었습니다. 페이지를 새로고침 해주세요.", {
          id: SSE_ERROR_TOAST_ID,
        });
        return;
      }
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
  }, []);

  return { data, isConnected };
};
