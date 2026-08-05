import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/seat/changes`;

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const token = request.cookies.get("accessToken")?.value ?? "";
    const requestHeaders: HeadersInit = {
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(backendUrl, {
      headers: requestHeaders,
      credentials: "include",
      signal: request.signal,
    });

    if (!response.ok) {
      return new NextResponse(
        `Backend connection failed: ${response.status} ${response.statusText}`,
        {
          status: response.status,
        },
      );
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "text/event-stream; charset=utf-8");
    responseHeaders.set("Cache-Control", "no-cache, no-transform");
    responseHeaders.set("Connection", "keep-alive");
    responseHeaders.set("Transfer-Encoding", "chunked");
    // 프록시(nginx 등)가 스트림을 버퍼링하면 첫 바이트가 도달하지 않아
    // EventSource가 CONNECTING에서 멈춘다
    responseHeaders.set("X-Accel-Buffering", "no");
    responseHeaders.set("Access-Control-Allow-Origin", origin);
    responseHeaders.set("Access-Control-Allow-Methods", "GET");
    responseHeaders.set("Access-Control-Allow-Headers", "Cache-Control, Cookie");
    responseHeaders.set("Access-Control-Allow-Credentials", "true");

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            // 클라이언트(브라우저) 쪽 연결이 이미 끊겼으면 컨트롤러도 닫혀있어
            // enqueue/close를 호출하면 예외가 나므로 조용히 루프만 종료한다
            if (request.signal.aborted) break;
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          if (!request.signal.aborted) {
            console.error(error);
          }
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new NextResponse(stream, { headers: responseHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
