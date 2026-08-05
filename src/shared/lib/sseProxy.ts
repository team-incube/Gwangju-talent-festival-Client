import { NextRequest, NextResponse } from "next/server";

const HEARTBEAT_MS = 15_000;
const ENCODER = new TextEncoder();
const CONNECTED = ENCODER.encode(": connected\n\n");
const PING = ENCODER.encode(": ping\n\n");

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  // 자체 nginx를 거칠 때만 유효하고 Vercel에서는 무해
  "X-Accel-Buffering": "no",
};

// 백엔드 JwtFilter는 Authorization 헤더만 읽고 쿠키는 인증에 쓰지 않는다 —
// 브라우저 EventSource는 커스텀 헤더를 못 보내므로, 이 서버 라우트에서 쿠키의
// accessToken을 꺼내 Authorization 헤더로 변환해 백엔드에 전달한다
export async function proxySSE(request: NextRequest, path: string) {
  const token = request.cookies.get("accessToken")?.value ?? "";

  let upstream: Response;
  try {
    upstream = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      headers: { Accept: "text/event-stream", Authorization: `Bearer ${token}` },
      signal: request.signal,
    });
  } catch {
    // 헤더 도착 전에 브라우저가 끊으면 request.signal이 fetch를 abort한다 — 재연결에서 흔한 정상 경로
    return new NextResponse("Backend unreachable", { status: 502 });
  }

  if (!upstream.ok) {
    return new NextResponse(
      `Backend connection failed: ${upstream.status} ${upstream.statusText}`,
      { status: upstream.status },
    );
  }
  if (!upstream.body) {
    return new NextResponse("Backend sent no body", { status: 502 });
  }

  const reader = upstream.body.getReader();
  let heartbeat: ReturnType<typeof setInterval>;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // 첫 바이트가 나가야 응답 헤드가 플러시된다. 백엔드의 첫 이벤트를 기다리면
      // 이벤트가 없는 동안 서버리스 함수가 그대로 타임아웃된다
      controller.enqueue(CONNECTED);

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(PING);
        } catch {
          clearInterval(heartbeat);
        }
      }, HEARTBEAT_MS);
    },

    // pull 기반이라 소비자가 읽을 때만 업스트림을 당긴다 (백프레셔)
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          clearInterval(heartbeat);
          controller.close();
          return;
        }
        controller.enqueue(value);
      } catch (error) {
        clearInterval(heartbeat);
        controller.error(error);
      }
    },

    // 브라우저가 끊으면 즉시 호출된다. releaseLock과 달리 업스트림 연결을 실제로 닫는다
    async cancel() {
      clearInterval(heartbeat);
      await reader.cancel().catch(() => {});
    },
  });

  return new NextResponse(stream, { headers: SSE_HEADERS });
}
