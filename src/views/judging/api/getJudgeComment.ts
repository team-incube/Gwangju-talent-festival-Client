import instance from "@/shared/lib/axios";
import { JudgeCommentResponse } from "@/entities/judging/model/handwriting";

export const getJudgeComment = async (teamId: number): Promise<JudgeCommentResponse> => {
  const res = await instance.get<JudgeCommentResponse>(`/judge/${teamId}/comment`);
  return res.data;
};
