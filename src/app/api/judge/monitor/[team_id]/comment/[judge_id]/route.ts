import { NextRequest } from "next/server";
import { apiHandler } from "@/shared/utils/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ team_id: string; judge_id: string }> },
) {
  const { team_id, judge_id } = await params;
  return apiHandler(request, `/judge/monitor/${team_id}/comment/${judge_id}`, "GET");
}
