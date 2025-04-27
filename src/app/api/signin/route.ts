import { NextRequest } from "next/server";
import { apiHandler } from "@/shared/utils/api";

export async function POST(request: NextRequest) {
  return apiHandler(request, "/auth/login");
}
