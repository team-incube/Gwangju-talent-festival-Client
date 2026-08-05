import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxySSE } from "../sseProxy";

const API_URL = "https://backend.test";
const decoder = new TextDecoder();

const makeRequest = (cookie = "accessToken=token-abc") =>
  new NextRequest("http://localhost/api/judge/monitor/changes", { headers: { cookie } });

const mockUpstream = (body: BodyInit | null, init?: ResponseInit) => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(body, { status: 200, ...init }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_API_URL", API_URL);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("proxySSE", () => {
  it("백엔드가 아무것도 보내지 않아도 SSE 헤더와 첫 바이트를 즉시 내보낸다", async () => {
    // 이벤트를 하나도 보내지 않는 백엔드 — 실제 장애 상황
    mockUpstream(new ReadableStream());

    const response = await proxySSE(makeRequest(), "/judge/monitor/changes");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream; charset=utf-8");

    const { value } = await response.body!.getReader().read();
    expect(decoder.decode(value)).toBe(": connected\n\n");
  });

  it("hop-by-hop 헤더를 응답에 붙이지 않는다", async () => {
    mockUpstream(new ReadableStream());

    const response = await proxySSE(makeRequest(), "/judge/monitor/changes");

    expect(response.headers.get("Connection")).toBeNull();
    expect(response.headers.get("Transfer-Encoding")).toBeNull();
  });

  it("쿠키의 accessToken을 Authorization 헤더로 변환해 백엔드에 전달한다", async () => {
    const fetchMock = mockUpstream(new ReadableStream());

    await proxySSE(makeRequest(), "/judge/monitor/changes");

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/judge/monitor/changes`,
      expect.objectContaining({
        headers: { Accept: "text/event-stream", Authorization: "Bearer token-abc" },
      }),
    );
  });

  it("백엔드가 보낸 이벤트를 그대로 전달한다", async () => {
    mockUpstream("event: judge-monitoring\ndata: {}\n\n");

    const response = await proxySSE(makeRequest(), "/judge/monitor/changes");
    const reader = response.body!.getReader();

    await reader.read();
    const { value } = await reader.read();
    expect(decoder.decode(value)).toBe("event: judge-monitoring\ndata: {}\n\n");
  });

  it("브라우저가 연결을 끊으면 백엔드 연결도 취소한다", async () => {
    let upstreamCancelled = false;
    mockUpstream(
      new ReadableStream({
        cancel() {
          upstreamCancelled = true;
        },
      }),
    );

    const response = await proxySSE(makeRequest(), "/judge/monitor/changes");
    const reader = response.body!.getReader();
    await reader.read();

    await reader.cancel();

    expect(upstreamCancelled).toBe(true);
  });

  it("백엔드가 스트림을 닫으면 응답 스트림도 닫는다", async () => {
    mockUpstream("data: last\n\n");

    const response = await proxySSE(makeRequest(), "/judge/monitor/changes");
    const reader = response.body!.getReader();

    await reader.read();
    await reader.read();
    const { done } = await reader.read();
    expect(done).toBe(true);
  });

  it("백엔드가 실패하면 상태 코드를 그대로 반환한다", async () => {
    mockUpstream(null, { status: 401, statusText: "Unauthorized" });

    const response = await proxySSE(makeRequest(), "/judge/monitor/changes");

    expect(response.status).toBe(401);
  });

  it("백엔드에 연결하지 못하면 502를 반환한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("aborted")));

    const response = await proxySSE(makeRequest(), "/judge/monitor/changes");

    expect(response.status).toBe(502);
  });
});

describe("proxySSE 토큰 재발급", () => {
  const TOKENS = {
    accessToken: "new-access",
    accessTokenExpiresAt: "2099-01-01T00:00:00Z",
    refreshToken: "new-refresh",
    refreshTokenExpiresAt: "2099-01-01T00:00:00Z",
  };

  // 만료된 accessToken -> 401 -> 재발급 -> 재시도 순서로 응답하는 백엔드
  const mockExpiredThenRefreshed = () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(TOKENS), { status: 200 }))
      .mockResolvedValueOnce(new Response(new ReadableStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  };

  it("accessToken이 만료되면 재발급 후 SSE에 다시 연결한다", async () => {
    const fetchMock = mockExpiredThenRefreshed();

    const response = await proxySSE(
      makeRequest("accessToken=expired; refreshToken=refresh-abc"),
      "/judge/monitor/changes",
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${API_URL}/auth/refresh`,
      expect.objectContaining({ method: "PATCH", headers: { "Refresh-Token": "refresh-abc" } }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      `${API_URL}/judge/monitor/changes`,
      expect.objectContaining({
        headers: { Accept: "text/event-stream", Authorization: "Bearer new-access" },
      }),
    );
  });

  it("재발급한 토큰을 응답 쿠키로 내려보낸다", async () => {
    mockExpiredThenRefreshed();

    const response = await proxySSE(
      makeRequest("accessToken=expired; refreshToken=refresh-abc"),
      "/judge/monitor/changes",
    );

    expect(response.cookies.get("accessToken")?.value).toBe("new-access");
    expect(response.cookies.get("refreshToken")?.value).toBe("new-refresh");
  });

  it("refreshToken이 없으면 재발급을 시도하지 않고 401을 그대로 반환한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxySSE(makeRequest("accessToken=expired"), "/judge/monitor/changes");

    expect(response.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("재발급도 실패하면 401을 그대로 반환한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response(null, { status: 401 }))
        .mockResolvedValueOnce(new Response(null, { status: 401 })),
    );

    const response = await proxySSE(
      makeRequest("accessToken=expired; refreshToken=dead"),
      "/judge/monitor/changes",
    );

    expect(response.status).toBe(401);
  });
});
