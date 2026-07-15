import { useQuery } from "@tanstack/react-query";
import { Score } from "@/entities/judging/model/score";
import { getJudgeList } from "../api/getJudgeList";
import { judgeListQueryKey } from "./queryKeys";

export const useGetJudgeList = () => {
  return useQuery<Score[]>({
    queryKey: judgeListQueryKey,
    queryFn: getJudgeList,
  });
};
