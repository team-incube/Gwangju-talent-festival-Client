import instance from "@/shared/lib/axios";
import { JudgeMonitorCommentResponse } from "../model/monitoring";

export const getJudgeMonitorComment = async (
  teamId: number,
  judgeId: number,
): Promise<JudgeMonitorCommentResponse> => {
  // 뷰포트 진입마다 조회되는 고빈도 엔드포인트라 공용 /api/server 프록시를 거치지 않고
  // 전용 BFF 라우트로 직접 보낸다 (baseURL 재정의로 axios 인스턴스의 인증 처리는 그대로 재사용)
  const res = await instance.get<JudgeMonitorCommentResponse>(
    `/api/judge/monitor/${teamId}/comment/${judgeId}`,
    { baseURL: "" },
  );
  return res.data;
};
