"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveJudgeComment } from "../api/saveJudgeComment";
import { Stroke } from "@/entities/judging/model/handwriting";
import { judgeCommentQueryKey } from "./queryKeys";
import { readLocalDraft, removeLocalDraft, writeLocalDraft } from "@/shared/utils/localDraft";
import { useOnlineStatus } from "@/shared/hooks/useOnlineStatus";

const SAVE_DEBOUNCE_MS = 500;
const DRAFT_KEY_PREFIX = "judge-comment-draft-";
const draftKey = (teamId: number) => `${DRAFT_KEY_PREFIX}${teamId}`;

type PendingSave = { teamId: number; strokes: Stroke[] };

export const getJudgeCommentDraft = (teamId: number) => readLocalDraft<Stroke[]>(draftKey(teamId));

export const useSaveJudgeComment = (teamId: number | null) => {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<PendingSave | null>(null);
  const hasNotifiedFailureRef = useRef(false);

  const { mutate } = useMutation({
    mutationFn: ({ teamId, strokes }: PendingSave) => saveJudgeComment(teamId, strokes),
    onSuccess: (_data, { teamId }) => {
      removeLocalDraft(draftKey(teamId));
      hasNotifiedFailureRef.current = false;
    },
    onError: () => {
      if (hasNotifiedFailureRef.current) return;
      hasNotifiedFailureRef.current = true;
      toast.error("네트워크 연결이 끊겨 기기에 임시 저장했어요. 연결되면 자동으로 다시 저장할게요.");
    },
  });

  const commit = useCallback(
    (pending: PendingSave) => {
      queryClient.setQueryData(judgeCommentQueryKey(pending.teamId), {
        teamId: pending.teamId,
        strokes: pending.strokes,
      });
      writeLocalDraft(draftKey(pending.teamId), pending.strokes);
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
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

  // 오프라인이라 전송하지 못한 draft가 남아있으면, 연결이 복구됐을 때(또는 마운트 시점에 이미 온라인이면) 자동으로 재전송한다
  useEffect(() => {
    if (!isOnline || teamId === null) return;
    const draft = readLocalDraft<Stroke[]>(draftKey(teamId));
    if (draft) commit({ teamId, strokes: draft });
  }, [isOnline, teamId, commit]);

  return { save, saveImmediately, isOnline };
};
