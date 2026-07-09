import instance from "@/shared/lib/axios";
import { Stroke } from "@/entities/judging/model/handwriting";

export const saveJudgeComment = async (teamId: number, strokes: Stroke[]) => {
  await instance.put(`/judge/${teamId}/comment`, { strokes });
};
