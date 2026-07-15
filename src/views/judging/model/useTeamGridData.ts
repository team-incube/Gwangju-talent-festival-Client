import { useMemo } from "react";
import { Score } from "@/entities/judging/model/score";
import { useGetJudgeList } from "./useGetJudgeList";
import { useGetTeamOrder } from "./useGetTeamOrder";

export type OrderedTeam = Score & { performOrder: number };

export const useTeamGridData = () => {
  const { data: scores = [], isLoading: isScoresLoading, isError: isScoresError } =
    useGetJudgeList();
  const { data: teamOrder = [], isLoading: isOrderLoading, isError: isOrderError } =
    useGetTeamOrder();

  const teams = useMemo<OrderedTeam[]>(() => {
    const orderMap = new Map(teamOrder.map(team => [team.teamId, team.performOrder]));
    return [...scores]
      .map(score => ({ ...score, performOrder: orderMap.get(score.teamId) ?? score.teamId }))
      .sort((a, b) => a.performOrder - b.performOrder);
  }, [scores, teamOrder]);

  return {
    teams,
    isLoading: isScoresLoading || isOrderLoading,
    isError: isScoresError || isOrderError,
  };
};
