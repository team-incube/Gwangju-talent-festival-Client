import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/judge/monitor/changes`;

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const cookie = request.headers.get("cookie");
    const requestHeaders: HeadersInit = {
      Accept: "text/event-stream",
    };

    if (cookie) {
      requestHeaders["Cookie"] = cookie;
    }

    const response = await fetch(backendUrl, {
      headers: requestHeaders,
      credentials: "include",
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
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          console.error(error);
          controller.error(error);
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
