import { NextRequest } from "next/server";
import { proxySSE } from "@/shared/lib/sseProxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// ponytail: 서버리스 함수 실행 상한. SSE는 5분마다 끊기고 EventSource가 자동 재연결한다.
// 무중단 연결이 필요하면 Edge runtime 전환 또는 폴링으로
export const maxDuration = 300;

export const GET = (request: NextRequest) => proxySSE(request, "/seat/changes");
