"use client";

import { useCallback, useState } from "react";
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

export const useTeamScores = (teams: Score[]) => {
  const queryClient = useQueryClient();
  const [edits, setEdits] = useState<Record<number, TeamScore>>({});

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
      setEdits(prev => ({
        ...prev,
        [teamId]: { ...(prev[teamId] ?? getScore(teamId)), [key]: value },
      }));
    },
    [getScore],
  );

  const hasUnsavedEdit = useCallback((teamId: number) => teamId in edits, [edits]);

  const { mutate: submitScore, isPending: isSaving } = useMutation({
    mutationFn: (teamId: number) => saveScore(teamId, getScore(teamId)),
    onMutate: async (teamId: number) => {
      await queryClient.cancelQueries({ queryKey: judgeListQueryKey });
      const previousScores = queryClient.getQueryData<Score[]>(judgeListQueryKey);
      const score = getScore(teamId);

      queryClient.setQueryData<Score[]>(judgeListQueryKey, old =>
        old?.map(team => (team.teamId === teamId ? { ...team, ...score, isJudged: true } : team)),
      );

      return { previousScores };
    },
    onSuccess: (_data, teamId) => {
      setEdits(prev => {
        const next = { ...prev };
        delete next[teamId];
        return next;
      });
    },
    onError: (error, _teamId, context) => {
      if (context?.previousScores) {
        queryClient.setQueryData(judgeListQueryKey, context.previousScores);
      }
      toast.error(error instanceof Error ? error.message : "심사 저장에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: judgeListQueryKey });
    },
  });

  return { getScore, updateScore, submitScore, isSaving, hasUnsavedEdit };
};
