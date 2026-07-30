import { describe, it, expect, beforeEach } from "vitest";
import { readLocalDraft, writeLocalDraft, removeLocalDraft, readLocalDraftsByPrefix } from "../localDraft";

beforeEach(() => {
  window.localStorage.clear();
});

describe("writeLocalDraft / readLocalDraft", () => {
  it("저장한 값을 그대로 읽어온다", () => {
    writeLocalDraft("draft-key", { a: 1 });
    expect(readLocalDraft("draft-key")).toEqual({ a: 1 });
  });

  it("저장된 값이 없으면 null을 반환한다", () => {
    expect(readLocalDraft("missing-key")).toBeNull();
  });
});

describe("removeLocalDraft", () => {
  it("저장된 draft를 삭제한다", () => {
    writeLocalDraft("draft-key", { a: 1 });
    removeLocalDraft("draft-key");
    expect(readLocalDraft("draft-key")).toBeNull();
  });
});

describe("readLocalDraftsByPrefix", () => {
  it("접두사가 일치하는 draft를 모두 모아 반환한다", () => {
    writeLocalDraft("judge-score-draft-1", { score: 10 });
    writeLocalDraft("judge-score-draft-2", { score: 20 });
    writeLocalDraft("other-key", { score: 99 });

    expect(readLocalDraftsByPrefix("judge-score-draft-")).toEqual({
      "1": { score: 10 },
      "2": { score: 20 },
    });
  });

  it("일치하는 draft가 없으면 빈 객체를 반환한다", () => {
    expect(readLocalDraftsByPrefix("judge-score-draft-")).toEqual({});
  });
});
