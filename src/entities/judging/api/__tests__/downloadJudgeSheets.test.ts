import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadJudgeSheets } from "../downloadJudgeSheets";

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

describe("downloadJudgeSheets - 성공", () => {
  it("/api/excel/judge-sheets를 호출하고 blob으로 다운로드 링크를 생성해 클릭한다", async () => {
    const response = createResponse({ ok: true });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    await downloadJudgeSheets();

    expect(fetch).toHaveBeenCalledWith("/api/excel/judge-sheets");
    expect(createObjectURLMock).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    await vi.waitFor(() => {
      expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:mock-url");
    });
  });

  it("Content-Disposition 헤더에서 파일명을 추출해 link.download에 설정한다", async () => {
    const response = createResponse({
      ok: true,
      headers: { "content-disposition": 'attachment; filename="심사결과.zip"' },
    });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    let appendedLink: HTMLAnchorElement | undefined;
    appendChildSpy.mockImplementation(node => {
      appendedLink = node as HTMLAnchorElement;
      return node;
    });

    await downloadJudgeSheets();

    expect(appendedLink?.download).toBe("심사결과.zip");
  });

  it("Content-Disposition 헤더가 없으면 기본 파일명을 사용한다", async () => {
    const response = createResponse({ ok: true });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    let appendedLink: HTMLAnchorElement | undefined;
    appendChildSpy.mockImplementation(node => {
      appendedLink = node as HTMLAnchorElement;
      return node;
    });

    await downloadJudgeSheets();

    expect(appendedLink?.download).toBe("심사결과.zip");
  });
});

describe("downloadJudgeSheets - 실패", () => {
  it("응답이 실패면 서버 메시지를 담은 에러를 던진다", async () => {
    const response = createResponse({ ok: false, json: { message: "권한이 없습니다." } });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    await expect(downloadJudgeSheets()).rejects.toThrow("권한이 없습니다.");
  });

  it("실패 응답의 JSON 파싱도 실패하면 기본 메시지로 대체한다", async () => {
    const response = createResponse({ ok: false, jsonRejects: true });
    vi.mocked(fetch).mockResolvedValueOnce(response);

    await expect(downloadJudgeSheets()).rejects.toThrow("개별 심사표를 다운로드하지 못했습니다.");
  });
});
