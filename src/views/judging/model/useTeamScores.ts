"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  EMPTY_SCORE,
  EvaluationScoreKey,
  Score,
  TeamScore,
  toTeamScore,
} from "@/entities/judging/model/score";
import { saveScore } from "@/entities/judging/api/saveScore";
import { judgeListQueryKey } from "./queryKeys";
import { readLocalDraftsByPrefix, removeLocalDraft, writeLocalDraft } from "@/shared/utils/localDraft";
import { useOnlineStatus } from "@/shared/hooks/useOnlineStatus";

const DRAFT_KEY_PREFIX = "judge-score-draft-";
const draftKey = (teamId: number) => `${DRAFT_KEY_PREFIX}${teamId}`;

export const useTeamScores = (teams: Score[]) => {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();
  const [edits, setEdits] = useState<Record<number, TeamScore>>({});
  const failedTeamIdsRef = useRef<Set<number>>(new Set());

  // 저장 버튼을 누르기 전에 이탈(새로고침/오프라인 등)해도 편집 중이던 점수를 잃지 않도록 복원한다
  useEffect(() => {
    const drafts = readLocalDraftsByPrefix<TeamScore>(DRAFT_KEY_PREFIX);
    const restored = Object.entries(drafts).reduce<Record<number, TeamScore>>(
      (acc, [teamId, score]) => ({ ...acc, [Number(teamId)]: score }),
      {},
    );
    if (Object.keys(restored).length > 0) {
      setEdits(prev => ({ ...restored, ...prev }));
    }
  }, []);

  const getScore = useCallback(
    (teamId: number): TeamScore => {
      if (edits[teamId]) return edits[teamId];
      const team = teams.find(team => team.teamId === teamId);
      return team?.isJudged ? toTeamScore(team) : EMPTY_SCORE;
    },
    [edits, teams],
  );

  const updateScore = useCallback(
    (teamId: number, key: EvaluationScoreKey, value: number) => {
      setEdits(prev => {
        const next = { ...prev, [teamId]: { ...(prev[teamId] ?? getScore(teamId)), [key]: value } };
        writeLocalDraft(draftKey(teamId), next[teamId]);
        return next;
      });
    },
    [getScore],
  );

  const hasUnsavedEdit = useCallback((teamId: number) => teamId in edits, [edits]);

  const {
    mutate: submitScore,
    isPending,
    variables: savingVariables,
  } = useMutation({
    mutationFn: (teamId: number) => saveScore(teamId, getScore(teamId)),
    onMutate: async (teamId: number) => {
      await queryClient.cancelQueries({ queryKey: judgeListQueryKey });
      const previousScores = queryClient.getQueryData<Score[]>(judgeListQueryKey);
      const wasJudged = previousScores?.find(team => team.teamId === teamId)?.isJudged ?? false;
      const score = getScore(teamId);

      queryClient.setQueryData<Score[]>(judgeListQueryKey, old =>
        old?.map(team => (team.teamId === teamId ? { ...team, ...score, isJudged: true } : team)),
      );

      return { previousScores, wasJudged };
    },
    onSuccess: (_data, teamId, context) => {
      toast.success(context?.wasJudged ? "심사가 수정되었습니다" : "심사가 저장되었습니다");
      failedTeamIdsRef.current.delete(teamId);
      removeLocalDraft(draftKey(teamId));
      setEdits(prev => {
        const next = { ...prev };
        delete next[teamId];
        return next;
      });
    },
    onError: (error, teamId, context) => {
      if (context?.previousScores) {
        queryClient.setQueryData(judgeListQueryKey, context.previousScores);
      }
      failedTeamIdsRef.current.add(teamId);
      toast.error(
        error instanceof Error
          ? error.message
          : "심사 저장에 실패했습니다. 기기에 임시 저장했으니 연결되면 다시 시도해주세요.",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: judgeListQueryKey });
    },
  });

  // 저장 버튼을 눌렀지만 네트워크 문제로 실패했던 팀은, 연결이 복구되면 자동으로 재시도한다
  useEffect(() => {
    if (!isOnline) return;
    failedTeamIdsRef.current.forEach(teamId => submitScore(teamId));
  }, [isOnline, submitScore]);

  const savingTeamId = isPending ? (savingVariables ?? null) : null;

  return { getScore, updateScore, submitScore, savingTeamId, hasUnsavedEdit };
};
