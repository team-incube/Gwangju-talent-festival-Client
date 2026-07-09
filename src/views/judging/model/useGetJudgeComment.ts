import { useQuery } from "@tanstack/react-query";
import { getJudgeComment } from "../api/getJudgeComment";
import { judgeCommentQueryKey } from "./queryKeys";

export const useGetJudgeComment = (teamId: number | null) => {
  return useQuery({
    queryKey: judgeCommentQueryKey(teamId as number),
    queryFn: () => getJudgeComment(teamId as number),
    enabled: teamId !== null,
  });
};
