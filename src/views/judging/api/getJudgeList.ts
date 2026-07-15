import instance from "@/shared/lib/axios";
import { Score } from "@/entities/judging/model/score";

export const getJudgeList = async (): Promise<Score[]> => {
  const res = await instance.get<Score[]>("/judge");
  return res.data;
};
