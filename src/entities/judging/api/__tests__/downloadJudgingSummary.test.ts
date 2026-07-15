import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadJudgingSummary } from "../downloadJudgingSummary";

const createResponse = ({
  ok,
  blob,
  headers,
  json,
  jsonRejects,
}: {
  ok: boolean;
  blob?: Blob;
  headers?: Record<string, string>;
  json?: unknown;
  jsonRejects?: boolean;
}): Response => {
  return {
    ok,
    blob: vi.fn().mockResolvedValue(blob ?? new Blob(["dummy"])),
    json: jsonRejects
      ? vi.fn().mockRejectedValue(new Error("invalid json"))
      : vi.fn().mockResolvedValue(json ?? {}),
    headers: {
      get: vi.fn((key: string) => headers?.[key] ?? null),
    },
  } as unknown as Response;
};

let createObjectURLMock: ReturnType<typeof vi.fn>;
let revokeObjectURLMock: ReturnType<typeof vi.fn>;
let clickMock: ReturnType<typeof vi.fn>;
let appendChildSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.clearAllMocks();

  createObjectURLMock = vi.fn().mockReturnValue("blob:mock-url");
  revokeObjectURLMock = vi.fn();
  URL.createObjectURL = createObjectURLMock;
  URL.revokeObjectURL = revokeObjectURLMock;

  clickMock = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(clickMock);
  appendChildSpy = vi.spyOn(document.body, "appendChild");

  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("downloadJudgingSummary - 성공", () => {
  it("/api/excel/summary를 호출하고 blob으로 다운로드 링크를 생성해 클릭한다", async () => {
    const response = createResponse({ ok: true });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    await downloadJudgingSummary();

    expect(fetch).toHaveBeenCalledWith("/api/excel/summary");
    expect(createObjectURLMock).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:mock-url");
  });

  it("Content-Disposition 헤더에서 파일명을 추출해 link.download에 설정한다", async () => {
    const response = createResponse({
      ok: true,
      headers: { "content-disposition": 'attachment; filename="심사결과.xlsx"' },
    });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    let appendedLink: HTMLAnchorElement | undefined;
    appendChildSpy.mockImplementation(node => {
      appendedLink = node as HTMLAnchorElement;
      return node;
    });

    await downloadJudgingSummary();

    expect(appendedLink?.download).toBe("심사결과.xlsx");
  });

  it("RFC 2047 MIME 인코디드 워드(=?UTF-8?Q?...?=) 파일명을 디코딩한다", async () => {
    const response = createResponse({
      ok: true,
      headers: {
        "content-disposition":
          'attachment; filename="=?UTF-8?Q?=EC=8B=AC=EC=82=AC=EC=A7=91=EA=B3=84=ED=91=9C?=.xlsx"',
      },
    });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    let appendedLink: HTMLAnchorElement | undefined;
    appendChildSpy.mockImplementation(node => {
      appendedLink = node as HTMLAnchorElement;
      return node;
    });

    await downloadJudgingSummary();

    expect(appendedLink?.download).toBe("심사집계표.xlsx");
  });

  it("Content-Disposition 헤더가 없으면 기본 파일명을 사용한다", async () => {
    const response = createResponse({ ok: true });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    let appendedLink: HTMLAnchorElement | undefined;
    appendChildSpy.mockImplementation(node => {
      appendedLink = node as HTMLAnchorElement;
      return node;
    });

    await downloadJudgingSummary();

    expect(appendedLink?.download).toBe("judging-summary.xlsx");
  });
});

describe("downloadJudgingSummary - 실패", () => {
  it("응답이 실패면 서버 메시지를 담은 에러를 던진다", async () => {
    const response = createResponse({ ok: false, json: { message: "권한이 없습니다." } });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    await expect(downloadJudgingSummary()).rejects.toThrow("권한이 없습니다.");
  });

  it("실패 응답의 JSON 파싱도 실패하면 기본 메시지로 대체한다", async () => {
    const response = createResponse({ ok: false, jsonRejects: true });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    await expect(downloadJudgingSummary()).rejects.toThrow("심사 집계표를 다운로드하지 못했습니다.");
  });
});
