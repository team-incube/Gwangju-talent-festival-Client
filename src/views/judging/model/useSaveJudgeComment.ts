"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveJudgeComment } from "../api/saveJudgeComment";
import { Stroke } from "@/entities/judging/model/handwriting";
import { judgeCommentQueryKey } from "./queryKeys";

const SAVE_DEBOUNCE_MS = 500;

type PendingSave = { teamId: number; strokes: Stroke[] };

export const useSaveJudgeComment = (teamId: number | null) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<PendingSave | null>(null);

  const { mutate } = useMutation({
    mutationFn: ({ teamId, strokes }: PendingSave) => saveJudgeComment(teamId, strokes),
    onError: () => {
      toast.error("필기 메모 저장에 실패했습니다.");
    },
  });

  const commit = useCallback(
    (pending: PendingSave) => {
      queryClient.setQueryData(judgeCommentQueryKey(pending.teamId), {
        teamId: pending.teamId,
        strokes: pending.strokes,
      });
      mutate(pending);
    },
    [mutate, queryClient],
  );

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (pendingRef.current) {
      commit(pendingRef.current);
      pendingRef.current = null;
    }
  }, [commit]);

  const save = useCallback(
    (strokes: Stroke[]) => {
      if (teamId === null) return;
      pendingRef.current = { teamId, strokes };
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
    },
    [teamId, flush],
  );

  const saveImmediately = useCallback(
    (strokes: Stroke[]) => {
      if (teamId === null) return;
      pendingRef.current = { teamId, strokes };
      flush();
    },
    [teamId, flush],
  );

  useEffect(() => {
    return () => {
      flush();
    };
  }, [teamId, flush]);

  return { save, saveImmediately };
};
