"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Team } from "@/entities/team/model/types";
import { updateTeamOrder } from "@/entities/team/api/updateTeamOrder";
import { teamOrderQueryKey } from "./queryKeys";

export const useReorderTeams = () => {
  const queryClient = useQueryClient();

  const { mutate: reorderTeams, isPending: isReordering } = useMutation({
    mutationFn: (orderedTeamIds: number[]) =>
      updateTeamOrder(orderedTeamIds.map((teamId, index) => ({ teamId, order: index + 1 }))),
    onMutate: async (orderedTeamIds: number[]) => {
      await queryClient.cancelQueries({ queryKey: teamOrderQueryKey });
      const previousTeams = queryClient.getQueryData<Team[]>(teamOrderQueryKey);

      if (previousTeams) {
        const teamMap = new Map(previousTeams.map(team => [team.teamId, team]));
        const reordered = orderedTeamIds
          .map((teamId, index) => {
            const team = teamMap.get(teamId);
            return team ? { ...team, performOrder: index + 1 } : null;
          })
          .filter((team): team is Team => team !== null);
        queryClient.setQueryData<Team[]>(teamOrderQueryKey, reordered);
      }

      return { previousTeams };
    },
    onError: (error, _orderedTeamIds, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(teamOrderQueryKey, context.previousTeams);
      }
      toast.error(error instanceof Error ? error.message : "팀 순서 변경에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: teamOrderQueryKey });
    },
  });

  return { reorderTeams, isReordering };
};
