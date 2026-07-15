import { useQuery } from "@tanstack/react-query";
import { Team } from "@/entities/team/model/types";
import { getAllTeams } from "@/entities/team/api/getAllTeams";
import { teamOrderQueryKey } from "./queryKeys";

export const useGetTeamOrder = () => {
  return useQuery<Team[]>({
    queryKey: teamOrderQueryKey,
    queryFn: getAllTeams,
  });
};
