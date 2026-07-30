import { useQuery } from "@tanstack/react-query";
import { getAllTeams } from "@/entities/team/api/getAllTeams";
import { Team } from "@/entities/team/model/types";

export const useGetTeams = () => {
  return useQuery<Team[]>({
    queryKey: ["mainTeams"],
    queryFn: getAllTeams,
  });
};
