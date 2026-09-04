import instance from "@/shared/lib/axios";
import { JudgeMonitorCommentResponse, sanitizeMonitorCommentResponse } from "../model/monitoring";

export const getJudgeMonitorComment = async (
  teamId: number,
  judgeId: number,
): Promise<JudgeMonitorCommentResponse> => {
  // 요청 경로가 "/judge"로 시작해야 axios 인터셉터가 이 페이지의 401/403을
  // 리다이렉트 없이 호출부로 그대로 전달한다 (src/shared/lib/axios.ts 참고)
  const res = await instance.get<unknown>(`/judge/monitor/${teamId}/comment/${judgeId}`);
  const sanitized = sanitizeMonitorCommentResponse(res.data);
  if (!sanitized) {
    throw new Error("필기 데이터를 불러오는 중 오류가 발생했습니다.");
  }
  return sanitized;
};
