import { useQuery } from "@tanstack/react-query";
import { Team } from "./types";
import { getAllTeams } from "../api/getAllTeams";
import { teamOrderQueryKey } from "./queryKeys";

export const useGetTeamOrder = () => {
  return useQuery<Team[]>({
    queryKey: teamOrderQueryKey,
    queryFn: getAllTeams,
  });
};
