"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toast } from "sonner";
import {
  DirtyCommentKey,
  JudgeMonitoringResponse,
  dirtyCommentKey,
  mergeMonitoringSnapshot,
  sanitizeMonitoringDeltaResponse,
  sanitizeMonitoringResponse,
} from "@/entities/judging/model/monitoring";
import { Stroke } from "@/entities/judging/model/handwriting";
import { parsePartialJson } from "@/shared/utils/partialJson";

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;
const SSE_ERROR_TOAST_ID = "judge-monitoring-sse-error";

export const useJudgeMonitoring = () => {
  const [data, setData] = useState<JudgeMonitoringResponse | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // Delta로 dirty 표시된 (teamId, judgeId) 셀 → 해당 셀을 dirty로 만든 마지막 Delta version.
  // 같은 셀에 재조회가 겹쳐도 이 값과 응답의 version이 일치할 때만 반영해 오래된 응답을 걸러낸다.
  // resolveDirtyComment에서 setData 반영 여부를 같은 틱에 동기적으로 판단해야 해서 state 대신
  // ref로 들고, 변경 시 렌더를 강제로 트리거한다
  const dirtyCellsRef = useRef<Map<DirtyCommentKey, number>>(new Map());
  const [, forceRerender] = useReducer((tick: number) => tick + 1, 0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAppliedVersionRef = useRef(0);

  useEffect(() => {
    const connect = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      eventSourceRef.current?.close();

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

        lastAppliedVersionRef.current = sanitized.version;
        setData(prev => (parsed.recovered ? mergeMonitoringSnapshot(prev, sanitized) : sanitized));
        // full snapshot은 그 자체로 최신 진실이므로, 대기 중이던 dirty 표시는 전부 무효가 된다
        dirtyCellsRef.current = new Map();
        forceRerender();
      });

      eventSource.addEventListener("judge-monitoring-delta", event => {
        const parsed = parsePartialJson<unknown>(event.data);
        const sanitized = parsed ? sanitizeMonitoringDeltaResponse(parsed.data) : null;

        if (!parsed || !sanitized) {
          toast.error("심사 모니터링 데이터를 불러오는 중 오류가 발생했습니다.");
          return;
        }

        // 이미 적용한 version 이하의 Delta는 중복/역전된 이벤트이므로 무시한다
        if (sanitized.version <= lastAppliedVersionRef.current) {
          return;
        }
        lastAppliedVersionRef.current = sanitized.version;

        if (sanitized.scores) {
          const { judges, scoreRows } = sanitized.scores;
          setData(prev => (prev ? { ...prev, version: sanitized.version, judges, scoreRows } : prev));
        } else {
          setData(prev => (prev ? { ...prev, version: sanitized.version } : prev));
        }

        if (sanitized.comments.length > 0) {
          sanitized.comments.forEach(({ teamId, judgeId }) => {
            dirtyCellsRef.current.set(dirtyCommentKey(teamId, judgeId), sanitized.version);
          });
          forceRerender();
        }
      });

      eventSource.onopen = () => {
        retryCountRef.current = 0;
        setIsConnected(true);
        toast.dismiss(SSE_ERROR_TOAST_ID);
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        // 에러 후 CONNECTING이면 브라우저가 스스로 재연결하는 중이므로 건드리지 않는다.
        // CLOSED는 네이티브 재연결이 없으므로 백오프로 직접 다시 붙는다
        if (eventSource.readyState !== EventSource.CLOSED) {
          return;
        }
        toast.error("실시간 심사 모니터링 연결에 실패했습니다.", { id: SSE_ERROR_TOAST_ID });
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

  // 개별 필기 조회 응답을 반영한다. 조회를 시작한 뒤에 더 최신 Delta가 같은 셀을 다시
  // dirty로 표시했다면(version이 달라짐) 그 사이 값이 또 바뀐 것이므로 이 응답은 버린다
  const resolveDirtyComment = useCallback(
    (teamId: number, judgeId: number, strokes: Stroke[], version: number) => {
      const key = dirtyCommentKey(teamId, judgeId);
      if (dirtyCellsRef.current.get(key) !== version) return;

      dirtyCellsRef.current.delete(key);
      forceRerender();

      setData(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          commentRows: prev.commentRows.map(row => {
            if (row.teamId !== teamId) return row;
            return {
              ...row,
              comments: row.comments.map(comment =>
                comment.judgeId === judgeId ? { ...comment, strokes } : comment,
              ),
            };
          }),
        };
      });
    },
    [],
  );

  return { data, isConnected, dirtyCells: dirtyCellsRef.current, resolveDirtyComment };
};
